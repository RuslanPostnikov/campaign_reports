import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CampaignReport, EventName } from './entities/campaign-report.entity';
import { ProbationApiService } from '../probation-api/probation-api.service';
import { parse } from 'csv-parse/sync';
import dayjs from 'dayjs';
import { AggregatedReportResponse } from './campaign-reports.interfaces';

@Injectable()
export class CampaignReportsService {
  constructor(
    @InjectRepository(CampaignReport)
    private readonly campaignReportRepository: Repository<CampaignReport>,
    private readonly probationApiService: ProbationApiService,
    private readonly dataSource: DataSource,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async fetchHourlyReports() {
    const now = dayjs().format('YYYY-MM-DD HH:mm:ss');
    const startOfDay = dayjs().startOf('d').format('YYYY-MM-DD HH:mm:ss');
    await this.fetchReports(startOfDay, now);
  }

  async fetchReports(fromDate: string, toDate: string) {
    for (const eventName of Object.values(EventName)) {
      let nextUrl = null;
      do {
        const response = await this.probationApiService.fetchReports(
          fromDate,
          toDate,
          eventName,
          nextUrl,
        );
        await this.processCampaignReports(response.data.csv);
        nextUrl = response.data?.pagination?.next;
      } while (nextUrl);
    }
  }

  async getAggregatedReports(
    fromDate: Date,
    toDate: Date,
    eventName: EventName,
    take: number,
    page: number,
  ): Promise<AggregatedReportResponse> {
    const skip = (page - 1) * take;

    const baseQuery = this.campaignReportRepository
      .createQueryBuilder('report')
      .where('report.event_time BETWEEN :fromDate AND :toDate', {
        fromDate,
        toDate,
      })
      .andWhere('report.event_name = :eventName', { eventName });

    const resultsQuery = baseQuery
      .clone()
      .select('report.ad_id', 'ad_id')
      .addSelect('DATE(report.event_time)', 'date')
      .addSelect('COUNT(*)', 'count')
      .groupBy('report.ad_id')
      .addGroupBy('DATE(report.event_time)')
      .orderBy('date', 'ASC')
      .addOrderBy('ad_id', 'ASC')
      .offset(skip)
      .limit(take);

    const totalQuery = baseQuery
      .clone()
      .select(
        'COUNT(DISTINCT CONCAT(report.ad_id, DATE(report.event_time)))',
        'total',
      );

    const [results, totalResult] = await Promise.all([
      resultsQuery.getRawMany(),
      totalQuery.getRawOne(),
    ]);

    const total = parseInt(totalResult.total);
    const totalPages = Math.ceil(total / take);

    return {
      data: results,
      meta: {
        pagination: {
          total,
          totalPages,
          page,
          take,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      },
    };
  }

  private async processCampaignReports(csvData: string) {
    const reports = this.parseCsvData(csvData);
    await this.batchUpsertReports(reports);
  }

  private async batchUpsertReports(reports: Partial<CampaignReport>[]) {
    const batchSize = 1000;

    for (let i = 0; i < reports.length; i += batchSize) {
      const batch = reports.slice(i, i + batchSize);
      await this.upsertReports(batch);
    }
  }

  private async upsertReports(reports: Partial<CampaignReport>[]) {
    await this.dataSource.transaction(async (transactionalEntityManager) => {
      const values = reports
        .map(
          (report) =>
            `('${report.campaign}', '${report.campaign_id}', '${report.adgroup}', 
          '${report.adgroup_id}', '${report.ad}', '${report.ad_id}', 
          '${report.client_id}', '${report.event_name}', '${report.event_time.toISOString()}')`,
        )
        .join(',');

      await transactionalEntityManager.query(`
        INSERT INTO campaign_reports (
          campaign, campaign_id, adgroup, adgroup_id, ad, ad_id, 
          client_id, event_name, event_time
        ) 
        VALUES ${values}
        ON CONFLICT (event_time, client_id, event_name) 
        DO UPDATE SET
          campaign = EXCLUDED.campaign,
          campaign_id = EXCLUDED.campaign_id,
          adgroup = EXCLUDED.adgroup,
          adgroup_id = EXCLUDED.adgroup_id,
          ad = EXCLUDED.ad,
          ad_id = EXCLUDED.ad_id
      `);
    });
  }

  private parseCsvData(csvData: string): Partial<CampaignReport>[] {
    const records: Partial<CampaignReport>[] = parse(csvData, {
      columns: true,
      skip_empty_lines: true,
    });

    return records.map((record) => {
      if (record.event_name !== 'install' && record.event_name !== 'purchase') {
        throw new BadRequestException(
          `Invalid event_name: ${record.event_name}`,
        );
      }
      return {
        ...record,
        event_time: new Date(record.event_time),
      };
    });
  }
}

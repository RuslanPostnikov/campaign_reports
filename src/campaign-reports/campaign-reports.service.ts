import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// import { Cron, CronExpression } from '@nestjs/schedule';
import { CampaignReport } from './entities/campaign-report.entity';
// import { ProbationApiService } from '../probation-api/probation-api.service';
import { parse } from 'csv-parse/sync';

@Injectable()
export class CampaignReportsService {
  private readonly logger = new Logger(CampaignReportsService.name);

  constructor(
    @InjectRepository(CampaignReport)
    private campaignReportRepository: Repository<CampaignReport>,
    // private probationApiService: ProbationApiService,
  ) {}

  // @Cron(CronExpression.EVERY_HOUR)
  // async fetchHourlyReports() {
  //   const now = new Date();
  //   const startOfDay = new Date(
  //     now.getFullYear(),
  //     now.getMonth(),
  //     now.getDate(),
  //   );
  //   await this.fetchReports(startOfDay, now);
  // }

  // async fetchReports(fromDate: Date, toDate: Date) {
  //   let nextUrl = null;
  //   do {
  //     const response = await this.probationApiService.fetchReports(
  //       fromDate,
  //       toDate,
  //       nextUrl,
  //     );
  //     await this.saveCampaignReports(response.data.csv);
  //     nextUrl = response.data.pagination.next;
  //   } while (nextUrl);
  // }

  private async saveCampaignReports(csvData: string) {
    const reports = this.parseCsvData(csvData);
    for (const report of reports) {
      await this.campaignReportRepository.save(report);
    }
  }

  private parseCsvData(csvData: string): Partial<CampaignReport>[] {
    const records = parse(csvData, {
      columns: true,
      skip_empty_lines: true,
    });

    return records.map((record) => ({
      ...record,
      event_time: new Date(record.event_time),
    }));
  }

  async getAggregatedReports(
    fromDate: Date,
    toDate: Date,
    eventName: string,
    take: number,
    page: number,
  ) {
    const skip = (page - 1) * take;
    const [results, total] = await this.campaignReportRepository
      .createQueryBuilder('report')
      .select('report.ad_id', 'ad_id')
      .addSelect('DATE(report.event_time)', 'date')
      .addSelect('COUNT(*)', 'count')
      .where('report.event_time BETWEEN :fromDate AND :toDate', {
        fromDate,
        toDate,
      })
      .andWhere('report.event_name = :eventName', { eventName })
      .groupBy('report.ad_id')
      .addGroupBy('DATE(report.event_time)')
      .orderBy('date', 'ASC')
      .addOrderBy('ad_id', 'ASC')
      .skip(skip)
      .take(take)
      .getManyAndCount();

    return {
      data: results,
      meta: {
        total,
        page,
        take,
      },
    };
  }
}

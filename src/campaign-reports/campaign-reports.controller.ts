import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { CampaignReportsService } from './campaign-reports.service';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import { FetchCampaignReportDto } from './dto/fetch-campaign-report.dto';
import { AggregateCampaignReportDto } from './dto/aggregate-campaign-report.dto';

@Controller('campaign-reports')
@UseGuards(ApiKeyGuard)
export class CampaignReportsController {
  constructor(
    private readonly campaignReportsService: CampaignReportsService,
  ) {}

  @Post('fetch')
  async fetchReports(@Query() fetchDto: FetchCampaignReportDto) {
    return this.campaignReportsService.fetchReports(
      new Date(fetchDto.fromDate),
      new Date(fetchDto.toDate),
    );
  }

  @Get('aggregate')
  async getAggregatedReports(
    @Query() aggregateDto: AggregateCampaignReportDto,
  ) {
    return this.campaignReportsService.getAggregatedReports(
      new Date(aggregateDto.fromDate),
      new Date(aggregateDto.toDate),
      aggregateDto.eventName,
      aggregateDto.take,
      aggregateDto.page,
    );
  }
}

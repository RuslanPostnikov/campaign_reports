import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CampaignReportsService } from './campaign-reports.service';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import { FetchCampaignReportDto } from './dto/fetch-campaign-report.dto';
import { AggregateCampaignReportDto } from './dto/aggregate-campaign-report.dto';

@ApiTags('campaign-reports')
@ApiBearerAuth('api-key')
@Controller('campaign-reports')
@UseGuards(ApiKeyGuard)
export class CampaignReportsController {
  constructor(
    private readonly campaignReportsService: CampaignReportsService,
  ) {}

  @Get('fetch')
  @ApiOperation({ summary: 'Fetch campaign reports' })
  @ApiResponse({ status: 200, description: 'Reports fetched successfully' })
  async fetchReports(@Query() fetchDto: FetchCampaignReportDto) {
    return this.campaignReportsService.fetchReports(
      fetchDto.fromDate,
      fetchDto.toDate,
    );
  }

  @Get('aggregate')
  @ApiOperation({ summary: 'Get aggregated campaign reports' })
  @ApiResponse({
    status: 200,
    description: 'Aggregated reports retrieved successfully',
  })
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

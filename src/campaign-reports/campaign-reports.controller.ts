import { Controller } from '@nestjs/common';
import { CampaignReportsService } from './campaign-reports.service';

@Controller('campaign-reports')
export class CampaignReportsController {
  constructor(private readonly campaignReportsService: CampaignReportsService) {}
}

import { Module } from '@nestjs/common';
import { CampaignReportsService } from './campaign-reports.service';
import { CampaignReportsController } from './campaign-reports.controller';
import { CampaignReport } from './entities/campaign-report.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([CampaignReport])],
  controllers: [CampaignReportsController],
  providers: [CampaignReportsService],
})
export class CampaignReportsModule {}

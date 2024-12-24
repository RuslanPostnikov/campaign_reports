import { Module } from '@nestjs/common';
import { CampaignReportsService } from './campaign-reports.service';
import { CampaignReportsController } from './campaign-reports.controller';
import { CampaignReport } from './entities/campaign-report.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProbationApiModule } from '../probation-api/probation-api.module';

@Module({
  imports: [TypeOrmModule.forFeature([CampaignReport]), ProbationApiModule],
  controllers: [CampaignReportsController],
  providers: [CampaignReportsService],
})
export class CampaignReportsModule {}

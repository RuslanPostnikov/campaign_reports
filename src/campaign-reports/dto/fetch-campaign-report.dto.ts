import { IsDateString } from 'class-validator';

export class FetchCampaignReportDto {
  @IsDateString()
  fromDate: string;

  @IsDateString()
  toDate: string;
}

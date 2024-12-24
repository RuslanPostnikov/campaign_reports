import { IsString, IsDateString } from 'class-validator';

export class CreateCampaignReportDto {
  @IsString()
  campaign: string;

  @IsString()
  campaign_id: string;

  @IsString()
  adgroup: string;

  @IsString()
  adgroup_id: string;

  @IsString()
  ad: string;

  @IsString()
  ad_id: string;

  @IsString()
  client_id: string;

  @IsString()
  event_name: string;

  @IsDateString()
  event_time: string;
}

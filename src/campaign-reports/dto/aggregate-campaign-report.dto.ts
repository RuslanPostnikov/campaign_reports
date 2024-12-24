import { IsDateString, IsString, IsInt, Min } from 'class-validator';

export class AggregateCampaignReportDto {
  @IsDateString()
  fromDate: string;

  @IsDateString()
  toDate: string;

  @IsString()
  eventName: string;

  @IsInt()
  @Min(1)
  take: number;

  @IsInt()
  @Min(1)
  page: number;
}

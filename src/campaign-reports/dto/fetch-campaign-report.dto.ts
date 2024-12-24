import { IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FetchCampaignReportDto {
  @ApiProperty({ example: '2023-06-01 00:00:00' })
  @IsDateString()
  fromDate: string;

  @ApiProperty({ example: '2023-06-30 23:59:59' })
  @IsDateString()
  toDate: string;
}

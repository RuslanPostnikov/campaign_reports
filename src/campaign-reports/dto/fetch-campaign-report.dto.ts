import { IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FetchCampaignReportDto {
  @ApiProperty({ example: '2024-12-24 00:00:00' })
  @IsDateString()
  fromDate: string;

  @ApiProperty({ example: '2024-12-24 23:59:59' })
  @IsDateString()
  toDate: string;
}

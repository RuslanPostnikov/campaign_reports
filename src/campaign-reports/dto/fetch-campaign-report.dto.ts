import { IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsDateRange } from '../decorators/is-date-range.decorator';

export class FetchCampaignReportDto {
  @ApiProperty({ example: '2024-12-24 00:00:00' })
  @IsDateString()
  @IsDateRange('toDate')
  fromDate: string;

  @ApiProperty({ example: '2024-12-24 23:59:59' })
  @IsDateString()
  toDate: string;
}

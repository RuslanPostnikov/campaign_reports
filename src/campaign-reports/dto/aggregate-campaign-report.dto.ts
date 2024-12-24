import { IsDateString, IsInt, Min, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EventName, EVENT_NAMES } from '../entities/campaign-report.entity';

export class AggregateCampaignReportDto {
  @ApiProperty({ example: '2024-12-24 00:00:00' })
  @IsDateString()
  fromDate: string;

  @ApiProperty({ example: '2024-12-24 23:59:59' })
  @IsDateString()
  toDate: string;

  @ApiProperty({ example: "'install' | 'purchase'" })
  @IsEnum(EVENT_NAMES)
  eventName: EventName;

  @ApiProperty({ example: 10 })
  @IsInt()
  @Min(1)
  take: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  page: number;
}

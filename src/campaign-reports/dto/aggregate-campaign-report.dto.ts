import { IsInt, Min, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EventName } from '../entities/campaign-report.entity';
import { Type } from 'class-transformer';
import { FetchCampaignReportDto } from './fetch-campaign-report.dto';

export class AggregateCampaignReportDto extends FetchCampaignReportDto {
  @ApiProperty({ example: EventName.INSTALL })
  @IsEnum(EventName)
  eventName: EventName;

  @ApiProperty({ example: 10 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  take: number;

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number;
}

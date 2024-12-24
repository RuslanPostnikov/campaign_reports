import { IsDateString, IsString, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AggregateCampaignReportDto {
  @ApiProperty({ example: '2023-06-01 00:00:00' })
  @IsDateString()
  fromDate: string;

  @ApiProperty({ example: '2023-06-30 23:59:59' })
  @IsDateString()
  toDate: string;

  @ApiProperty({ example: 'install' })
  @IsString()
  eventName: string;

  @ApiProperty({ example: 10 })
  @IsInt()
  @Min(1)
  take: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  page: number;
}

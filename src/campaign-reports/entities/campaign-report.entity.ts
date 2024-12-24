import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export const EVENT_NAMES = ['install', 'purchase'] as const;

export type EventName = (typeof EVENT_NAMES)[number];

@Entity('campaign_reports')
@Unique(['event_time', 'client_id', 'event_name'])
export class CampaignReport {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  campaign: string;

  @ApiProperty()
  @Column()
  campaign_id: string;

  @ApiProperty()
  @Column()
  adgroup: string;

  @ApiProperty()
  @Column()
  adgroup_id: string;

  @ApiProperty()
  @Column()
  ad: string;

  @ApiProperty()
  @Column()
  ad_id: string;

  @ApiProperty()
  @Column()
  client_id: string;

  @ApiProperty()
  @Column()
  event_name: EventName;

  @ApiProperty()
  @Column()
  event_time: Date;
}

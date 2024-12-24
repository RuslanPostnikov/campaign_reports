import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum EventName {
  INSTALL = 'install',
  PURCHASE = 'purchase',
}

@Entity('campaign_reports')
@Unique(['event_time', 'client_id', 'event_name'])
export class CampaignReport {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
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

  @ApiProperty({ enum: EventName })
  @Column({
    type: 'enum',
    enum: EventName,
  })
  event_name: EventName;

  @ApiProperty()
  @Column()
  event_time: Date;
}

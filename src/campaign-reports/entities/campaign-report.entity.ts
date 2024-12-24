import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('campaign_reports')
@Unique(['event_time', 'client_id', 'event_name'])
export class CampaignReport {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  campaign: string;

  @Column()
  campaign_id: string;

  @Column()
  adgroup: string;

  @Column()
  adgroup_id: string;

  @Column()
  ad: string;

  @Column()
  ad_id: string;

  @Column()
  client_id: string;

  @Column()
  event_name: string;

  @Column()
  event_time: Date;
}

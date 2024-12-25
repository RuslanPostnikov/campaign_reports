import { EventName } from '../campaign-reports/entities/campaign-report.entity';

export interface ProbationApiResponse {
  timestamp: number;
  data: {
    csv: string;
    pagination: {
      next: string | null;
    };
  };
}

export interface ReportParams {
  from_date: string;
  to_date: string;
  event_name: EventName;
  take: number;
}

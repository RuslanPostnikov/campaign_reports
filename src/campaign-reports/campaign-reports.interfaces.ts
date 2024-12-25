interface PaginationMeta {
  total: number;
  totalPages: number;
  page: number;
  take: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface AggregatedReportResult {
  ad_id: string;
  date: string;
  count: number;
}

export interface AggregatedReportResponse {
  data: AggregatedReportResult[];
  meta: {
    pagination: PaginationMeta;
  };
}

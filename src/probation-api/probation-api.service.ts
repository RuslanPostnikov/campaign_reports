import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AxiosResponse } from 'axios';
import { EventName } from '../campaign-reports/entities/campaign-report.entity';
import { ProbationApiResponse, ReportParams } from './probation-api.interfaces';

@Injectable()
export class ProbationApiService {
  private readonly apiUrl: string;
  private readonly apiKey: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.apiUrl = this.configService.get<string>('probationApi.url');
    this.apiKey = this.configService.get<string>('probationApi.key');
  }

  async fetchReports(
    fromDate: string,
    toDate: string,
    eventName: EventName,
    nextUrl?: string,
  ): Promise<ProbationApiResponse> {
    const url = nextUrl || `${this.apiUrl}/tasks/campaign/reports`;
    const params: Partial<ReportParams> = nextUrl
      ? {}
      : {
          from_date: fromDate,
          to_date: toDate,
          event_name: eventName,
          take: 1000,
        };

    try {
      return await lastValueFrom(this.makeRequest(url, params));
    } catch (error) {
      this.handleError(error);
    }
  }

  private makeRequest(
    url: string,
    params: Partial<ReportParams>,
  ): Observable<ProbationApiResponse> {
    return this.httpService
      .get<ProbationApiResponse>(url, {
        params,
        headers: { 'x-api-key': this.apiKey },
      })
      .pipe(
        map((response: AxiosResponse<ProbationApiResponse>) => response.data),
        catchError(this.handleError),
      );
  }

  private handleError(error: any): never {
    console.error('Error in Probation API request:', error);
    throw new HttpException(
      'Failed to fetch reports from Probation API',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

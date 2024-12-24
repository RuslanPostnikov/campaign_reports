import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { EventName } from '../campaign-reports/entities/campaign-report.entity';

@Injectable()
export class ProbationApiService {
  constructor(private readonly configService: ConfigService) {}

  async fetchReports(
    fromDate: Date,
    toDate: Date,
    eventName: EventName,
    nextUrl?: string,
  ) {
    const url =
      nextUrl ||
      `${this.configService.get('probationApi.url')}/tasks/campaign/reports`;
    const params = nextUrl
      ? {}
      : {
          from_date: fromDate.toISOString(),
          to_date: toDate.toISOString(),
          event_name: eventName,
          take: 1000,
        };

    try {
      const response = await axios.get(url, {
        params,
        headers: {
          'x-api-key': this.configService.get('probationApi.key'),
        },
      });

      return response.data;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Failed to fetch reports from Probation API',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

import { Module } from '@nestjs/common';
import { ProbationApiService } from './probation-api.service';

@Module({
  providers: [ProbationApiService],
  exports: [ProbationApiService],
})
export class ProbationApiModule {}

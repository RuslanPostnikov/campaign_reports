import { Module } from '@nestjs/common';
import { ProbationApiService } from './probation-api.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [ProbationApiService],
  exports: [ProbationApiService],
})
export class ProbationApiModule {}

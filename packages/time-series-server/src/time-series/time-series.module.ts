import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TimeSeriesController } from './time-series.controller';
import { TimeSeriesService } from './services/time-series.service';
import { TimeSeriesMetricService } from './services/time-series-metrics.service';
import {
  TimeSeriesProcessedData,
  TimeSeriesRawData,
} from './time-series.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TimeSeriesRawData, TimeSeriesProcessedData]),
  ],
  providers: [TimeSeriesService, TimeSeriesMetricService],
  controllers: [TimeSeriesController],
})
export class TimeSeriesModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { configuration } from './config/configuration';
import { DatabaseModule } from './common/database/database.module';
import { TimeSeriesModule } from './time-series/time-series.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    DatabaseModule,
    TimeSeriesModule,
  ],
})
export class AppModule {}

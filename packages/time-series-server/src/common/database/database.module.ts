import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import {
  TimeSeriesProcessedData,
  TimeSeriesRawData,
} from '../../time-series/time-series.entity';

@Global()
@Module({
  imports: [
    // Primary Database (PostgreSQL)
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          name: 'primary',
          type: 'postgres',
          host: configService.get<string>('database.postgres.host'),
          port: configService.get<number>('database.postgres.port'),
          username: configService.get<string>('database.postgres.username'),
          password: configService.get<string>('database.postgres.password'),
          database: configService.get<string>('database.postgres.db'),
          entities: [TimeSeriesProcessedData, TimeSeriesRawData],
          synchronize: true, // Set to false in production
        };
      },
    }),
  ],
})
export class DatabaseModule {}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import moment from 'moment';

import { GetMetricsDTO } from '../dtos/time-series-metrics.dto';
import { AggregationType, IntervalType } from '../time-series.enum';
import { TimeSeriesProcessedData } from '../time-series.entity';
import { DATE_COLUMN } from '../time-series.constants';

interface Compute {
  type: AggregationType;
  path: string;
  as?: string;
}

@Injectable()
export class TimeSeriesMetricService {
  constructor(
    @InjectRepository(TimeSeriesProcessedData)
    private readonly processedDataRepo: Repository<TimeSeriesProcessedData>
  ) {}

  private formatDate(dateString: string, interval: IntervalType) {
    const date = moment(dateString);

    switch (interval) {
      case IntervalType.DAILY:
        return date.format('YYYY-MM-DD'); // 2024-02-22
      case IntervalType.WEEKLY:
        return `${date.format('YYYY')}-W${date.isoWeek()}`; // W08-2024
      case IntervalType.MONTHLY:
        return date.format('YYYY-MM'); // 2024-02
      default:
        return dateString;
    }
  }

  /**
   * Converts an interval to PostgreSQL's date_trunc format
   */
  private getIntervalQuery(interval?: IntervalType): string {
    if (!interval) return DATE_COLUMN;

    const dateTruncMap: Record<string, string> = {
      [IntervalType.DAILY]: 'day',
      [IntervalType.WEEKLY]: 'week',
      [IntervalType.MONTHLY]: 'month',
    };

    return `date_trunc('${dateTruncMap[interval]}', ${DATE_COLUMN})`;
  }

  /**
   * Maps aggregation types to SQL functions
   */
  private getAggregationFunction(compute: Compute): string {
    const functionMap: Record<string, string> = {
      [AggregationType.SUM]: 'SUM',
      [AggregationType.AVG]: 'AVG',
      [AggregationType.COUNT]: 'COUNT',
      [AggregationType.MIN]: 'MIN',
      [AggregationType.MAX]: 'MAX',
    };

    const as = compute.as || compute.path;
    const aggFunc = functionMap[compute.type];

    return `${aggFunc}(${compute.path}) AS "${as}"`;
  }

  async computeMetrics(
    metricQuery: GetMetricsDTO
  ): Promise<Record<string, string>[]> {
    const { filter, group } = metricQuery;
    const { by: groupBy, computes } = group;

    const queryBuilder = this.processedDataRepo.createQueryBuilder();

    // Compute interval grouping
    const intervalQuery = this.getIntervalQuery(groupBy.interval);

    queryBuilder.select(`${intervalQuery} AS interval`);

    // Apply aggregations dynamically
    computes.forEach((compute) => {
      queryBuilder.addSelect(this.getAggregationFunction(compute));
    });

    // Apply date filtering
    if (filter.from && filter.to) {
      queryBuilder.where(`${DATE_COLUMN} BETWEEN :from AND :to`, {
        from: filter.from,
        to: filter.to,
      });
    } else if (filter.from) {
      queryBuilder.where(`${DATE_COLUMN} BETWEEN :from AND :to`, {
        from: filter.from,
        to: new Date(),
      });
    }

    // Apply GROUP BY
    queryBuilder.groupBy(intervalQuery);

    // Sort results by interval
    queryBuilder.orderBy('interval', 'DESC');

    // Execute the query
    const rows = await queryBuilder.getRawMany<Record<string, string>>();

    return rows.map((row) => {
      return {
        ...row,
        interval: this.formatDate(row.interval, groupBy.interval),
      };
    });
  }
}

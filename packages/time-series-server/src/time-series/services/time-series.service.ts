import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  FindManyOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import * as fs from 'fs';
import csvParser from 'csv-parser';

import { BadRequestException } from '../../common/exceptions/app.exception';
import {
  TimeSeriesProcessedData,
  TimeSeriesRawData,
} from '../time-series.entity';
import { Utils } from '../../common/utils';
import { ListTimeSeriesDTO } from '../dtos/list-time-series.dto';
import { DATE_COLUMN, TIME_SERIES_SCHEMA } from '../time-series.constants';

@Injectable()
export class TimeSeriesService {
  private readonly logger = new Logger('TimeSeriesService');

  constructor(
    @InjectRepository(TimeSeriesRawData)
    private readonly rawDataRepo: Repository<TimeSeriesRawData>,
    @InjectRepository(TimeSeriesProcessedData)
    private readonly processedDataRepo: Repository<TimeSeriesProcessedData>
  ) {}

  // Process csv file and clean data
  async processFile(filePath: string): Promise<void> {
    const cleanedData: any[] = [];
    const rawData: any[] = [];

    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (row) => {
          rawData.push(row);

          const cleanedRow = this.cleanData(row);
          if (cleanedRow) cleanedData.push(cleanedRow);
        })
        .on('end', () => {
          void this.storeData(rawData, cleanedData).then(resolve).catch(reject);
        })
        .on('error', () => {
          reject(new BadRequestException('Error processing file'));
        });
    });
  }

  async generateCsv(): Promise<string> {
    const data = await this.processedDataRepo.find();

    if (data.length === 0) {
      return 'No data available\n';
    }

    const headers =
      TIME_SERIES_SCHEMA.HEADERS as (keyof TimeSeriesProcessedData)[];

    const csvRows: string[] = [];

    // Add CSV headers
    csvRows.push(headers.join(','));

    // Add CSV data
    for (const row of data) {
      const csvRow = [];

      for (const header of headers) {
        if (header === DATE_COLUMN) {
          csvRow.push(row.date.toISOString());
        } else {
          csvRow.push(row[header]);
        }
      }

      csvRows.push(csvRow.join(','));
    }

    return csvRows.join('\n');
  }

  async listByFilters(filters: ListTimeSeriesDTO) {
    const { from, to, page, limit } = filters;

    const whereCondition: FindOptionsWhere<TimeSeriesProcessedData> = {};

    // Date Range Filtering
    if (from && to) {
      whereCondition.date = Between(from, to);
    } else if (from) {
      whereCondition.date = Between(from, new Date());
    }

    // Pagination and Sorting Options
    const options: FindManyOptions<TimeSeriesProcessedData> = {
      where: whereCondition,
      order: { [filters.sort_by]: filters.sort_order },
      take: limit,
      skip: (page - 1) * limit,
    };

    const [items, total] = await this.processedDataRepo.findAndCount(options);

    return {
      paging: {
        total,
        page,
        limit,
      },
      items,
    };
  }

  private async storeData(rawData: any[], cleanedData: any[]) {
    try {
      // Save raw data as JSON
      await this.rawDataRepo.save({ raw_data: rawData });
      this.logger.log('Raw data stored');

      // Save cleaned data in structured table
      await this.processedDataRepo.save(cleanedData);
      this.logger.log('Cleaned data stored');
    } catch (error) {
      this.logger.error(`Error while storing data ${error}`);

      throw new BadRequestException('Error saving data');
    }
  }

  private cleanData(row: any) {
    const date = Utils.standardizeDate(row.date);
    const amount = Utils.parseAmount(row.amount);
    const product = row.product?.trim() || null;
    const category = row.category?.trim()?.toLowerCase() || null;

    // Remove invalid rows
    if (!date || !product || !amount || !category) return null;

    return { date, product, amount, category };
  }
}

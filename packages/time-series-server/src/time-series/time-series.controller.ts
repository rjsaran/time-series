import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';

import { TimeSeriesService } from './services/time-series.service';
import { ListTimeSeriesDTO } from './dtos/list-time-series.dto';
import { GetMetricsDTO } from './dtos/time-series-metrics.dto';
import { TimeSeriesMetricService } from './services/time-series-metrics.service';

@Controller('time-series')
export class TimeSeriesController {
  constructor(
    private readonly timeSeriesService: TimeSeriesService,
    private readonly metricService: TimeSeriesMetricService
  ) {}

  @Get('')
  listByFilters(@Query() filters: ListTimeSeriesDTO) {
    return this.timeSeriesService.listByFilters(filters);
  }

  @Post('metrics')
  async getAnalytics(@Body() dto: GetMetricsDTO) {
    const metrics = await this.metricService.computeMetrics(dto);

    return {
      items: metrics,
    };
  }

  @Post('upload/csv')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_req, file, cb) =>
          cb(null, `${Date.now()}-${file.originalname}`),
      }),
    })
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    await this.timeSeriesService.processFile(file.path);

    return {
      success: true,
      message: 'File uploaded and processed successfully',
    };
  }

  @Get('export/csv')
  async exportCleanedData(@Res() res: Response) {
    const csvData = await this.timeSeriesService.generateCsv();

    res.setHeader(
      'Content-Disposition',
      'attachment; filename="cleaned_data.csv"'
    );
    res.setHeader('Content-Type', 'text/csv');

    res.send(csvData);
  }
}

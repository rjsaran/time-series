import { Logger, NestApplicationOptions, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';

import * as bodyParser from 'body-parser';

import { AppModule } from './app.module';

import { ValidationPipe } from './common/pipes/validation.pipe';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

export interface BaseServer {
  app: NestExpressApplication;
  bootstrap: () => Promise<Server>;
}

export class Server implements BaseServer {
  private readonly logger = new Logger('Server');

  app: NestExpressApplication;

  constructor(readonly nestConfig?: NestApplicationOptions) {}

  private setupGlobalPrefix() {
    this.app.setGlobalPrefix('api');
  }

  private setupBodyParser() {
    this.app.use(
      bodyParser.json({
        limit: '5mb',
      }),
    );
  }

  private setupInterceptors() {
    this.app.useGlobalInterceptors(new TransformInterceptor());
  }

  private setupFilters() {
    this.app.useGlobalFilters(new HttpExceptionFilter());
  }

  private setupPipes() {
    this.app.useGlobalPipes(new ValidationPipe());
  }

  private async startServer() {
    const configService = this.app.get(ConfigService);

    const port = configService.get<number>('server.port')!;

    this.app.disable('x-powered-by');

    this.app.enableVersioning({
      defaultVersion: '1',
      type: VersioningType.URI,
    });

    this.app.enableCors();

    this.app.set('trust proxy', 1);

    await this.app.listen(port);

    this.logger.log(`Server successfully started on port: ${port}`);
  }

  async bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(
      AppModule,
      this.nestConfig,
    );

    this.app = app;

    this.setupGlobalPrefix();
    this.setupBodyParser();
    this.setupInterceptors();
    this.setupFilters();
    this.setupPipes();

    await this.startServer();

    return this;
  }
}

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';

import { Response } from 'express';
import {
  AppException,
  InternalServerException,
  UnknownException,
} from '../exceptions/app.exception';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('HttpExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof AppException) {
      this.logger.error(exception.stack);

      return response.status(exception.getStatus()).json(exception.toJson());
    }

    if (exception instanceof HttpException) {
      this.logger.error(exception);

      const httpException = new UnknownException(exception.getStatus());

      httpException.addContext({
        message: exception.message,
      });

      return response
        .status(httpException.getStatus())
        .json(httpException.toJson());
    }

    if (exception instanceof Error) {
      this.logger.error(exception.stack);

      const internalServerError = new InternalServerException();

      internalServerError.addContext({
        message: exception.message,
      });

      return response
        .status(internalServerError.getStatus())
        .json(internalServerError.toJson());
    }
  }
}

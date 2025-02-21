import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * @description
 * All errors thrown in the Application must use or extend this error class.
 *
 * Note that this class should not be directly used in code, but should be extended by
 * a more specific Error class.
 *
 */
export class AppException extends HttpException {
  context: Record<string, any> = {};

  constructor(message: string, status: number) {
    super(message, status);
  }

  addContext(ctx: Record<string, any>) {
    this.context = Object.assign(this.context, ctx);

    return this;
  }

  toJson() {
    return {
      statusCode: this.getStatus(),
      message: this.message,
      context: this.context,
    };
  }
}

/**
 * @description
 *
 */
export class UnknownException extends AppException {
  constructor(status: HttpStatus) {
    super('Unknown Error', status);
  }
}

/**
 * @description
 * This error should be thrown when an entity cannot be found in the database, i.e. no entity of
 * the given entityName (Product, Order etc.) exists with the provided id.
 *
 */
export class EntityNotFoundException extends AppException {
  constructor(message?: string) {
    super(message || 'Entity not found', HttpStatus.NOT_FOUND);
  }
}

/**
 * @description
 * This error should be thrown when the user's authentication credentials do not match.
 *
 */
export class UnauthorizedException extends AppException {
  constructor(message?: string) {
    super(message || 'Unauthorized', HttpStatus.UNAUTHORIZED);
  }
}

/**
 * @description
 * This error should be thrown when a user attempts to access a resource which is outside of
 * his or her privileges.
 *
 */
export class ForbiddenException extends AppException {
  constructor(message?: string) {
    super(message || 'Forbidden', HttpStatus.UNAUTHORIZED);
  }
}

/**
 * @description
 * This error should be thrown when user input is not as expected.
 *
 */
export class BadRequestException extends AppException {
  constructor(message?: string) {
    super(message || 'Bad request', HttpStatus.BAD_REQUEST);
  }
}

/**
 * @description
 * This error should be thrown when some unexpected and exceptional case is encountered.
 *
 */
export class InternalServerException extends AppException {
  constructor(message?: string) {
    super(
      message || "Internal server error, we're working on it",
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

import { validate, ValidationError } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { BadRequestException } from '../exceptions/app.exception';

@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(
    value: unknown,
    { metatype }: ArgumentMetadata,
  ): Promise<unknown> {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToInstance(metatype, value);

    const errors: ValidationError[] = await validate(object, {
      validationError: { target: false, value: false },
    });

    if (errors.length > 0) {
      const badRequestException = new BadRequestException();

      badRequestException.addContext({
        errors: errors.map((error) => error.constraints),
      });

      throw badRequestException;
    }

    return object;
  }

  private toValidate(metatype: unknown): boolean {
    const types: unknown[] = [String, Boolean, Number, Array, Object];

    return typeof metatype === 'function' && !types.includes(metatype);
  }
}

import {
  IsOptional,
  IsString,
  Min,
  Max,
  IsDate,
  IsEnum,
  IsInt,
} from 'class-validator';

import { Type } from 'class-transformer';

export class ListTimeSeriesDTO {
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  from?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  to?: Date;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit = 10;

  @IsOptional()
  @IsString()
  sort_by = 'date';

  @IsOptional()
  @IsEnum(['ASC', 'DESC'], { message: 'sortOrder must be ASC or DESC' })
  sort_order: 'ASC' | 'DESC' = 'DESC';
}

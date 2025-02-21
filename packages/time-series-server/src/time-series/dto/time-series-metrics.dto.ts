import {
  IsString,
  IsOptional,
  IsArray,
  IsEnum,
  ValidateNested,
  IsDefined,
} from 'class-validator';

import { Type } from 'class-transformer';
import { AggregationType, IntervalType } from '../time-series.enum';

class FilterDTO {
  @IsOptional()
  @IsString()
  from?: string;

  @IsOptional()
  @IsString()
  to?: string;
}

class GroupByDTO {
  @IsDefined()
  @IsEnum(IntervalType)
  interval: IntervalType;
}

class ComputeDTO {
  @IsDefined()
  @IsEnum(AggregationType)
  type: AggregationType;

  @IsDefined()
  @IsString()
  path: string;

  @IsOptional()
  @IsString()
  as?: string;
}

class GroupDTO {
  @IsDefined()
  @ValidateNested()
  @Type(() => GroupByDTO)
  by: GroupByDTO;

  @IsDefined()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ComputeDTO)
  computes: ComputeDTO[];
}

export class GetMetricsDTO {
  @IsDefined()
  @ValidateNested()
  @Type(() => FilterDTO)
  filter: FilterDTO;

  @IsDefined()
  @ValidateNested()
  @Type(() => GroupDTO)
  group: GroupDTO;
}

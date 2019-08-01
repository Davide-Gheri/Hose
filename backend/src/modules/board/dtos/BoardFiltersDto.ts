import { PaginationQueryDto } from '../../../validation/PaginationQuery.dto';
import { IsOptional } from 'class-validator';

export class BoardFiltersDto extends PaginationQueryDto {
  @IsOptional()
  onlyOrphans: boolean;
}

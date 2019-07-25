import { IsOptional } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  skip?: number;

  @IsOptional()
  take?: number;
}

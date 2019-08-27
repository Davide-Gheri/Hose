import { createParamDecorator } from '@nestjs/common';
import { Request } from 'express';
import { QueryBuilder } from '../lib/querystring-builder';
import { FindManyOptions } from 'typeorm';

/**
 * Decorator to get TypeORM ready filters from querystring
 */
export const ParsedQuery = createParamDecorator((additionalQuery: Partial<FindManyOptions> = {}, req: Request) => {
  const qb = new QueryBuilder(req.query);
  return qb.build(additionalQuery);
});

import { createParamDecorator } from '@nestjs/common';
import { Request } from 'express';
import { QueryBuilder } from '../lib/querystring-builder';
import { FindManyOptions } from 'typeorm';

export const ParsedQuery = createParamDecorator((additionalQuery: Partial<FindManyOptions> = {}, req: Request) => {
  const qb = new QueryBuilder(req.query);
  return qb.build(additionalQuery);
});

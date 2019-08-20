import { FindManyOptions } from 'typeorm';
import { LookupDelimiter, LookupFilter } from './lookup.enum';
import { FieldFilter } from './field.filter';

export class FilterFactory {
  public get(query: FindManyOptions, key: string, value: string) {
    if (this.isFieldFilter(key)) {
      const field: string = key.split(LookupDelimiter.LOOKUP_DELIMITER)[0];
      const notQuery: boolean = key.includes(`${LookupDelimiter.LOOKUP_DELIMITER}${LookupFilter.NOT}`);
      const lookup = key.includes(LookupDelimiter.LOOKUP_DELIMITER)
        ? key.split(LookupDelimiter.LOOKUP_DELIMITER)[notQuery ? 2 : 1] as LookupFilter
        : LookupFilter.EXACT;
      return new FieldFilter(query, field, lookup, value, notQuery);
    }
  }

  private isFieldFilter(key: string): boolean {
    return !key.includes(LookupDelimiter.RELATION_DELIMITER);
  }
}

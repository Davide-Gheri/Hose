import { FindManyOptions, Like, IsNull, LessThan, MoreThan, LessThanOrEqual, MoreThanOrEqual, In, Between, FindOperator, Not } from 'typeorm';
import { LookupFilter } from './lookup.enum';

export class FieldFilter {
  constructor(
    public query: FindManyOptions,
    public readonly prop: string,
    public readonly lookup: LookupFilter,
    public readonly value: string,
    private readonly notOperator: boolean = false,
  ) {}

  public buildQuery() {
    let ormValue = this.getOrmValue();
    if (this.notOperator) {
      ormValue = Not(ormValue);
    }
    this.query.where = {
      ...this.query.where as object,
      [this.prop]: ormValue,
    };
  }

  private getOrmValue(): string | FindOperator<any> {
    switch (this.lookup) {
      case LookupFilter.EXACT:
        return this.value;
      case LookupFilter.CONTAINS:
        return Like(`%${this.value}%`);
      case LookupFilter.STARTS_WITH:
        return Like(`${this.value}%`);
      case LookupFilter.ENDS_WITH:
        return Like(`%${this.value}`);
      case LookupFilter.IS_NULL:
        return IsNull();
      case LookupFilter.LT:
        return LessThan(this.value);
      case LookupFilter.GT:
        return MoreThan(this.value);
      case LookupFilter.LTE:
        return LessThanOrEqual(this.value);
      case LookupFilter.GTE:
        return MoreThanOrEqual(this.value);
      case LookupFilter.IN:
        return In(this.value.split(','));
      case LookupFilter.BETWEEN:
        const [min, max] = this.value.split(',');
        return Between(+min, +max);
    }
  }
}

import { FindManyOptions } from 'typeorm';
import { FilterFactory } from './filter.factory';

export class QueryBuilder {
  private typeOrmQuery: FindManyOptions = {};

  constructor(
    private rawQuery: Record<string, any>,
  ) {}

  public build(additionalQuery?: Partial<FindManyOptions>) {
    this.setSkip();
    this.setTake();
    this.setOrder();

    const factory = new FilterFactory();

    Object.keys(this.rawQuery).forEach(key => {
      const filter = factory.get(this.typeOrmQuery, key, this.rawQuery[key]);
      filter.buildQuery();
    });

    if (additionalQuery) {
      return {
        ...this.typeOrmQuery,
        ...additionalQuery,
      };
    }
    return this.typeOrmQuery;
  }

  private setSkip() {
    if (this.rawQuery.skip) {
      this.typeOrmQuery.skip = this.rawQuery.skip;
      delete this.rawQuery.skip;
    }
  }

  private setTake() {
    if (this.rawQuery.take) {
      this.typeOrmQuery.take = this.rawQuery.take;
      delete this.rawQuery.take;
    }
  }

  private setOrder() {
    if (this.rawQuery.orderBy) {
      const [field, order] = this.rawQuery.orderBy.split('|');
      if (field && order) {
        this.typeOrmQuery.order = {[field]: order};
      }
      delete this.rawQuery.orderBy;
    } else {
      this.typeOrmQuery.order = {createdAt: 'ASC'};
    }
  }
}

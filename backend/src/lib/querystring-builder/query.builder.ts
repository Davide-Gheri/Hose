import { FindManyOptions } from 'typeorm';
import { FilterFactory } from './filter.factory';

/**
 * Create a FindManyOptions object to filter TypeORM queries from the Express Request.query object
 */
export class QueryBuilder {
  private typeOrmQuery: FindManyOptions = {};

  constructor(
    private rawQuery: Record<string, any>,
  ) {}

  /**
   * Build the query object
   * @param additionalQuery Additional filters to attach. WARNING the merging is not recursive
   */
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

  /**
   * Set "skip" parameter from "skip" key of source object
   */
  private setSkip() {
    if (this.rawQuery.skip) {
      this.typeOrmQuery.skip = this.rawQuery.skip;
      delete this.rawQuery.skip;
    }
  }

  /**
   * Set "take" parameter from "take" key of source object
   */
  private setTake() {
    if (this.rawQuery.take) {
      this.typeOrmQuery.take = this.rawQuery.take;
      delete this.rawQuery.take;
    }
  }

  /**
   * Set "order" parameter from "orderBy" key of source object
   * Supports only one order condition, the syntax is "orderBy=FIELD|ORDER"
   * @example
   * '&field=title|ASC'
   */
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

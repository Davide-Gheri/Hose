import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { InfluxDB, ISchemaOptions, escape, IPoint } from 'influx';
import Config from 'config';
import { INFLUX_SCHEMA } from '../providers/schema.provider';

@Injectable()
export class InfluxService implements OnModuleInit {
  private instance: InfluxDB;

  constructor(
    @Inject(INFLUX_SCHEMA) schema: ISchemaOptions[],
  ) {
    this.instance = new InfluxDB({
      ...Config.get('influx'),
      schema,
    });
  }

  onModuleInit(): void {
    this.instance.getDatabaseNames()
      .then(names => {
        if (!names.includes(Config.get('influx.database'))) {
          return this.instance.createDatabase(Config.get('influx.database'));
        }
      });
  }

  get escape() {
    return escape;
  }

  insert(data: IPoint | IPoint[]) {
    if (!Array.isArray(data)) {
      data = [data];
    }
    return this.instance.writePoints(data);
  }

  find(query: string) {
    return this.instance.query(query);
  }

  delete(whereQuery?: string) {
    return this.instance.query(`DELETE from ${Config.get('influx.schema.table')} ${whereQuery ? 'where ' + whereQuery : ''}`);
  }
}

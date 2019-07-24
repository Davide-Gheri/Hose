import { ISchemaOptions, FieldType } from 'influx';
import { Provider } from '@nestjs/common';
import Config from 'config';
export const INFLUX_SCHEMA = 'INFLUX_SCHEMA';

const schema: ISchemaOptions[] = [
  {
    measurement: Config.get('influx.schema.table'),
    fields: {
      record: FieldType.INTEGER,
    },
    tags: [
      'boardId',
    ],
  },
];

export const provideInfluxSchema = (): Provider => {
  return {
    provide: INFLUX_SCHEMA,
    useValue: schema,
  };
};

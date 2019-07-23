import { CommandOptionsOption, Option } from 'nestjs-command';

export const FreshOption = (option?: CommandOptionsOption) => (
  Option({
    name: 'f',
    alias: 'fresh',
    boolean: true,
    describe: 'Drop existing data before seeding',
    ...option,
  })
);

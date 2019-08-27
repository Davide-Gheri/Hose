import { CommandOptionsOption, Option } from 'nestjs-command';

/**
 * Add -f --fresh option, boolean
 * @param option
 * @constructor
 */
export const FreshOption = (option?: CommandOptionsOption) => (
  Option({
    name: 'f',
    alias: 'fresh',
    boolean: true,
    describe: 'Drop existing data before seeding',
    ...option,
  })
);

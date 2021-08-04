import { Command } from 'commander';

import { localeList } from './commands/locale-list';
import { localeRemove } from './commands/locale-remove';
import { localeSet } from './commands/locale-set';

// init
bootstrap();

async function bootstrap() {
  const program = new Command();

  program
    .command('list')
    .alias('ls')
    .description('List all locales.')
    .action(localeList);

  program
    .command('set [code]')
    .option('-n, --fullName [name]', 'Locale full name.')
    .description('Add/update a locale record.')
    .action(localeSet);

  program
    .command('remove [code]')
    .alias('rm')
    .description('Remove a locale record and all associated translations.')
    .action(localeRemove);

  await program.parseAsync(process.argv);
}

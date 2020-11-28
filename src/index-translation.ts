import program = require('commander');

import { translationDuplicates } from './commands/translation-duplicates';
import { translationList } from './commands/translation-list';
import { translationSet } from './commands/translation-set';

// init
bootstrap();

async function bootstrap() {
  program
    .command('list')
    .option(
      '-t, --term [value]',
      'Optional search term to filter by. Wildcard character: `%`'
    )
    .option(
      '-k, --key [value]',
      'Optional resource key filter by. Wildcard character: `%`'
    )
    .option('-l, --locale [code]', 'Optional locale code to filter by.')
    .alias('ls')
    .description('List translations.')
    .action(translationList);

  program
    .command('duplicates')
    .alias('d')
    .description('Find duplicate translations.')
    .action(translationDuplicates);

  program
    .command('set [key] [value]')
    .option('-d, --desc [value]', 'Resource description.')
    .option(
      '-l, --locale [code]',
      'Translation locale code. Default: `defaultLocale`'
    )
    .description('Add/update a translation record.')
    .action(translationSet);

  await program.parseAsync(process.argv);
}

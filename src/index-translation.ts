import program = require('commander');

import { translationList } from './commands/translation-list';
import { translationSet } from './commands/translation-set';

// init
bootstrap();

async function bootstrap() {
  program
    .command('list [key]')
    .alias('ls')
    .description('List translations by resource.')
    .action(translationList);

  program
    .command('set [key] [value]')
    .option('-d, --desc [value]', 'Resource description.')
    .option('-l, --locale [code]', 'Translation locale code. Default: `defaultLocale`')
    .description('Add/update a translation record.')
    .action(translationSet);

  await program.parseAsync(process.argv);
}

import { Command } from 'commander';
import updateNotifier = require('update-notifier');

import pkg = require('../package.json');
import { exportCmd } from './commands/export';
import { generate } from './commands/generate';
import { importCmd } from './commands/import';
import { init } from './commands/init';

// init
updateNotifier({ pkg } as any).notify();
bootstrap();

async function bootstrap() {
  const program = new Command();

  program
    .command('init')
    .description('Setup configuration and initialize database.')
    .option(
      '-l, --defaultLocale [code]',
      'Default locale to set. Default: `en-US`'
    )
    .option(
      '-d, --directory [path]',
      'Directory to store database and generated files. Default: `./i18n`'
    )
    .action(init);

  program
    .command('import [file]')
    .option(
      '-f, --format [value]',
      'File format. Available: `xliff`, `csv`, `json`. Default: `xliff`'
    )
    .option(
      '-l, --locale [code]',
      'Locale code to import translations for. Default: `defaultLocale`'
    )
    .option(
      '-b, --bump',
      'Save translations (bumping version number) even if the value has not changed. Default: `false`'
    )
    .description('Import translation records.')
    .action(importCmd);

  program
    .command('generate')
    .alias('g')
    .description('Generate locale JSON files.')
    .action(generate);

  program
    .command('export')
    .alias('x')
    .option(
      '-f, --format [value]',
      'Output file format. Available: `xliff`, `csv`, `json`. Default: `xliff`'
    )
    .option(
      '-l, --locale [code]',
      'Locale code to export translations for. Default: all locales'
    )
    .description('Export translations for translation.')
    .action(exportCmd);

  program.command('locale [cmd]', 'Locale commands.').alias('l');
  program.command('resource [cmd]', 'Resource commands.').alias('r');
  program.command('translation [cmd]', 'Translation commands.').alias('t');

  await program.version((pkg as any).version).parseAsync(process.argv);
}

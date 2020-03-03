import program = require('commander');

import { resourceList } from './commands/resource-list';

// init
bootstrap();

async function bootstrap() {
  program
    .command('list')
    .alias('ls')
    .description('List all resources.')
    .action(resourceList);

  await program.parseAsync(process.argv);
}

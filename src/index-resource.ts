import program = require('commander');

import { resourceList } from './commands/resource-list';
import { resourceRemove } from './commands/resource-remove';

// init
bootstrap();

async function bootstrap() {
  program
    .command('list')
    .alias('ls')
    .description('List all resources.')
    .action(resourceList);

  program
    .command('remove [code]')
    .alias('rm')
    .description('Remove a resource record and all associated translations.')
    .action(resourceRemove);

  await program.parseAsync(process.argv);
}

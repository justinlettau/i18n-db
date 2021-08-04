import { Command } from 'commander';

import { resourceList } from './commands/resource-list';
import { resourceRemove } from './commands/resource-remove';
import { resourceRename } from './commands/resource-rename';

// init
bootstrap();

async function bootstrap() {
  const program = new Command();

  program
    .command('list')
    .alias('ls')
    .description('List all resources.')
    .action(resourceList);

  program
    .command('rename [oldKey] [newKey')
    .alias('ren')
    .description('Rename a resource key.')
    .action(resourceRename);

  program
    .command('remove [key]')
    .alias('rm')
    .description('Remove a resource record and all associated translations.')
    .action(resourceRemove);

  await program.parseAsync(process.argv);
}

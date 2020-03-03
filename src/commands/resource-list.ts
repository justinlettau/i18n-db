import chalk from 'chalk';
import Table from 'cli-table';

import { getConnection } from '../connection';
import { ResourceRepository } from '../repositories/resource.repository';
import { getConfiguration } from '../configuration';

/**
 * Resource locales.
 */
export async function resourceList() {
  const config = getConfiguration();
  const connection = await getConnection(config);
  const resourceRepo = connection.getCustomRepository(ResourceRepository);
  const resources = await resourceRepo.findAll();

  if (resources.length === 0) {
    console.log(chalk.red('No resource found!'));
    return;
  }

  const table = new Table({
    head: ['Key', 'Name']
  });

  resources.forEach(item => {
    table.push([item.key, item.description || 'n/a']);
  });

  console.log(table.toString());
}

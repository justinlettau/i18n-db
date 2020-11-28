import chalk from 'chalk';
import * as inquirer from 'inquirer';

import { getConfiguration } from '../configuration';
import { getConnection } from '../connection';
import { ResourceRepository } from '../repositories/resource.repository';

/**
 * Rename resource key.
 *
 * @param oldKey Old resource key.
 * @param newKey New resource key.
 */
export async function resourceRename(oldKey: string, newKey: string) {
  const config = getConfiguration();
  const connection = await getConnection(config);
  const resourceRepo = connection.getCustomRepository(ResourceRepository);
  const resource = await resourceRepo.findByKey(oldKey);

  if (!resource) {
    console.log(chalk.red(`Resource "${oldKey}" not found!`));
    return;
  }

  const answers = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'continue',
      message: `Are you sure you want to rename "${oldKey}" to "${newKey}"?`,
    },
  ]);

  if (!answers.continue) {
    console.log('Cancelled, nothing was changed.');
    return;
  }

  resource.key = newKey;
  await resourceRepo.save(resource);

  console.log(chalk.green(`Resource renamed: "${oldKey}" -> "${newKey}"!`));
}

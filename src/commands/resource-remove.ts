import chalk from 'chalk';
import * as inquirer from 'inquirer';

import { getConfiguration } from '../configuration';
import { getConnection } from '../connection';
import { ResourceRepository } from '../repositories/resource.repository';
import { TranslationRepository } from '../repositories/translation.repository';

/**
 * Remove resource.
 *
 * @param key Resource key.
 */
export async function resourceRemove(key: string) {
  const config = getConfiguration();
  const connection = await getConnection(config);
  const resourceRepo = connection.getCustomRepository(ResourceRepository);
  const resource = await resourceRepo.findByKey(key);

  if (!resource) {
    console.log(chalk.red(`Resource "${key}" not found!`));
    return;
  }

  const answers = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'continue',
      message: `Are you sure you want to remove "${key}" and all associated translations?`,
    },
  ]);

  if (!answers.continue) {
    console.log('Cancelled, nothing was removed.');
    return;
  }

  const translationRepo = connection.getCustomRepository(TranslationRepository);
  await translationRepo.deleteByResourceId(resource.id);
  await resourceRepo.deleteById(resource.id);

  console.log(chalk.green(`Resource removed: "${key}"!`));
}

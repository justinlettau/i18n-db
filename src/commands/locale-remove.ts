import chalk from 'chalk';
import * as inquirer from 'inquirer';

import { getConfiguration } from '../configuration';
import { getConnection } from '../connection';
import { LocaleRepository } from '../repositories/locale.repository';
import { TranslationRepository } from '../repositories/translation.repository';

/**
 * Remove locale.
 *
 * @param code Local code.
 */
export async function localeRemove(code: string) {
  const config = getConfiguration();
  const connection = await getConnection(config);
  const localeRepo = connection.getCustomRepository(LocaleRepository);
  const locale = await localeRepo.findByCode(code);

  if (!locale) {
    console.log(chalk.red(`Local "${code}" not found!`));
    return;
  }

  const answers = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'continue',
      message: `Are you sure you want to remove "${code}" and all associated translations?`
    }
  ]);

  if (!answers.continue) {
    console.log('Cancelled, nothing was removed.');
    return;
  }

  const translationRepo = connection.getCustomRepository(TranslationRepository);
  await translationRepo.deleteByLocalId(locale.id);
  await localeRepo.deleteByCode(code);

  console.log(chalk.green(`Local removed: "${code}"!`));
}

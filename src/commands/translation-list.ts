import chalk from 'chalk';
import Table from 'cli-table';

import { getConfiguration } from '../configuration';
import { getConnection } from '../connection';
import { TranslationRepository } from '../repositories/translation.repository';

/**
 * List translations.
 *
 * @param key Resource key.
 */
export async function translationList(key: string) {
  const config = getConfiguration();
  const connection = await getConnection(config);
  const translationRepo = connection.getCustomRepository(TranslationRepository);
  const translations = await translationRepo.findByResource(key);

  if (translations.length === 0) {
    console.log(chalk.red(`No translations found for "${key}"!`));
    return;
  }

  const table = new Table({
    head: ['Locale', 'value']
  });

  translations.forEach(item => {
    table.push([item.locale.code, item.value]);
  });

  console.log(table.toString());
}

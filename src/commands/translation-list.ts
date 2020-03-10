import chalk from 'chalk';
import Table from 'cli-table';

import { getConfiguration } from '../configuration';
import { getConnection } from '../connection';
import { TranslationListOptions } from '../interfaces';
import { TranslationRepository } from '../repositories/translation.repository';

/**
 * List translations.
 *
 * @param key Resource key.
 */
export async function translationList(options: TranslationListOptions) {
  const config = getConfiguration();
  const connection = await getConnection(config);
  const translationRepo = connection.getCustomRepository(TranslationRepository);
  const translations = await translationRepo.findWhere({
    locale: options.locale,
    key: options.key,
    term: options.term
  });

  if (translations.length === 0) {
    console.log(chalk.red('No translations found!'));
    return;
  }

  const table = new Table({
    head: ['Locale', 'Key', 'value']
  });

  translations.forEach(item => {
    table.push([
      item.locale.code,
      item.resource.key,
      item.value.length > 50 ? `${item.value.substring(0, 50)}...` : item.value
    ]);
  });

  console.log(table.toString());
}

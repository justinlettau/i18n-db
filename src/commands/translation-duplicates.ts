import chalk from 'chalk';
import Table from 'cli-table';

import { getConfiguration } from '../configuration';
import { getConnection } from '../connection';
import { truncate } from '../helpers/truncate';
import { TranslationRepository } from '../repositories/translation.repository';

/**
 * Find duplicate translations.
 */
export async function translationDuplicates() {
  const config = getConfiguration();
  const connection = await getConnection(config);
  const translationRepo = connection.getCustomRepository(TranslationRepository);
  const duplicates = await translationRepo.findDuplicates(config.defaultLocale);

  if (duplicates.length === 0) {
    console.log(chalk.green('No duplicates found!'));
    return;
  }

  const table = new Table({
    head: ['#', 'Value', 'Keys']
  });

  duplicates.forEach(item => {
    table.push([chalk.yellow(item.occurrences), truncate(item.value), item.keys.split(',').join('\n')]);
  });

  console.log(table.toString());
}

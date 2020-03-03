import chalk from 'chalk';
import Table from 'cli-table';

import { getConfiguration } from '../configuration';
import { getConnection } from '../connection';
import { LocaleRepository } from '../repositories/locale.repository';

/**
 * List locales.
 */
export async function localeList() {
  const config = getConfiguration();
  const connection = await getConnection(config);
  const localeRepo = connection.getCustomRepository(LocaleRepository);
  const locales = await localeRepo.findAll();

  if (locales.length === 0) {
    console.log(chalk.red(`No locales found!`));
    return;
  }

  const table = new Table({
    head: ['Code', 'Name']
  });

  locales.forEach(item => {
    table.push([item.code, item.name || 'n/a']);
  });

  console.log(table.toString());
}

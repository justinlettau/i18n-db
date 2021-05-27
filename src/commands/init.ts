import chalk from 'chalk';
import * as fs from 'fs-extra';
import * as path from 'path';

import { CONFIG_FILENAME, DATABASE_FILENAME } from '../configuration';
import { getConnection } from '../connection';
import { Configuration, InitOptions } from '../interfaces';
import { LocaleRepository } from '../repositories/locale.repository';

/**
 * Init.
 *
 * @param options Command options.
 */
export async function init(options: InitOptions) {
  const cwd = process.cwd();
  const configFile = path.join(cwd, CONFIG_FILENAME);
  let config: Configuration = {
    defaultLocale: options.defaultLocale || 'en-US',
    directory: options.directory || './i18n',
    output: options.output || './i18n',
    nested: true,
  };

  if (fs.existsSync(configFile)) {
    config = fs.readJsonSync(configFile);
    console.log('Configuration file already exists');
  } else {
    fs.writeJsonSync(configFile, config, { spaces: 2 });
    console.log('Configuration file created');
  }

  const sqliteFile = path.join(cwd, config.directory, DATABASE_FILENAME);

  if (fs.existsSync(sqliteFile)) {
    console.log('Database already exists');
  } else {
    const connection = await getConnection(config, true);
    console.log('Database created');

    await connection
      .getCustomRepository(LocaleRepository)
      .save({ code: config.defaultLocale });
    console.log(`Locale created: "${config.defaultLocale}"`);
  }

  console.log(chalk.green('Initialization complete!'));
}

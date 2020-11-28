import chalk from 'chalk';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as glob from 'glob';

import { getConfiguration } from '../configuration';
import { getConnection } from '../connection';
import { LocaleRepository } from '../repositories/locale.repository';
import { TranslationRepository } from '../repositories/translation.repository';

/**
 * Generate locale JSON files.
 */
export async function generate() {
  const config = getConfiguration();
  const connection = await getConnection(config);
  const localeRepo = connection.getCustomRepository(LocaleRepository);
  const translationRepo = connection.getCustomRepository(TranslationRepository);
  const locales = await localeRepo.findAll();
  const translations = await translationRepo.findAll();

  if (translations.length === 0) {
    console.log(chalk.red('No translations found!'));
    return;
  }

  const cwd = process.cwd();
  const pattern = path.join(cwd, config.directory, '*.json');
  const paths = glob.sync(pattern);
  let count = 0;

  for (const locale of locales) {
    const code = locale.code;
    const items = translations.filter((x) => x.locale.code === code);

    const file = `${code}.json`;
    const dir = path.join(cwd, config.directory, file);
    const content = items.reduce(
      (obj, item) => ({ ...obj, [item.resource.key]: item.value }),
      {}
    );
    const index = paths.indexOf(dir.replace(/\\/g, '/'));

    fs.writeJsonSync(dir, content, { spaces: 2 });
    count++;

    if (index !== -1) {
      paths.splice(index, 1);
    }

    console.log(`File generated: "${file}"`);
  }

  // remove any files from deleted locales
  paths.forEach((item) => {
    const file = item.split('/').pop();
    fs.removeSync(item);
    console.log(`File removed: "${file}"`);
  });

  console.log(chalk.green(`Successfully generated ${count} files!`));
}

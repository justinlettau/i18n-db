import chalk from 'chalk';
import * as fs from 'fs-extra';
import * as inquirer from 'inquirer';

import { getConfiguration } from '../configuration';
import { getConnection } from '../connection';
import { fromCsv } from '../converters/csv';
import { fromJson } from '../converters/json';
import { fromXliff } from '../converters/xliff';
import { Locale } from '../entities/locale.entity';
import { InterchangeItem, TranslationImportOptions } from '../interfaces';
import { LocaleRepository } from '../repositories/locale.repository';
import { ResourceRepository } from '../repositories/resource.repository';
import { TranslationRepository } from '../repositories/translation.repository';

/**
 * Import translation records.
 *
 * @param file File path and name.
 * @param options CLI arguments.
 */
export async function importCmd(file: string, options: TranslationImportOptions) {
  const config = getConfiguration();
  const connection = await getConnection(config);
  const localeRepo = connection.getCustomRepository(LocaleRepository);
  const resourceRepo = connection.getCustomRepository(ResourceRepository);
  const translationRepo = connection.getCustomRepository(TranslationRepository);
  const sourceLocale = config.defaultLocale;
  let targetLocale = options.locale;
  let locale: Locale;

  if (targetLocale) {
    locale = await localeRepo.findByCode(targetLocale);
  } else {
    const locales = await localeRepo.findAll();
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'code',
        message: 'Please select a locale to import for.',
        choices: locales.map(item => {
          const suffix = item.code === config.defaultLocale ? ' (default)' : '';

          return {
            name: item.code + suffix,
            value: item.code
          };
        })
      }
    ]);

    targetLocale = answers.code;
    locale = locales.find(item => item.code === targetLocale);
  }

  const resources = await resourceRepo.findAll();
  const translations = await translationRepo.findByLocale([targetLocale]);
  const content = fs.readFileSync(file, 'utf8');
  let items: InterchangeItem[];
  let count = 0;

  switch (options.format) {
    case 'csv':
      items = fromCsv(sourceLocale, targetLocale, content);
      break;
    case 'json':
      items = fromJson(sourceLocale, targetLocale, content);
      break;
    default:
      items = fromXliff(sourceLocale, targetLocale, content);
      break;
  }

  for (const item of items) {
    let resource = resources.find(x => x.key === item.key);

    if (!resource) {
      resource = await resourceRepo.save({ key: item.key, description: item.note });
      resources.push(resource);
      console.log(`Resource created: "${item.key}"`);
    }

    if (!item.target) {
      console.log(`Skipping translation "${item.key}", no value`);
      continue;
    }

    const translation = translations.find(x => x.resource.key === item.key);

    if (!translation || translation.value !== item.target || options.bump) {
      await translationRepo.save({
        id: translation?.id,
        value: item.target,
        resourceId: resource.id,
        localeId: locale.id
      });

      count++;

      const msg = translation ? 'Translation updated' : 'Translation created';
      console.log(`${msg} (${targetLocale}): "${item.key}"`);
    }
  }

  console.log(chalk.green(`Successfully imported ${count} translations!`));
}

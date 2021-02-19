import chalk from 'chalk';
import * as fs from 'fs-extra';
import * as path from 'path';

import { getConfiguration } from '../configuration';
import { getConnection } from '../connection';
import { toCsv } from '../converters/csv';
import { toJson } from '../converters/json';
import { toXliff } from '../converters/xliff';
import { Locale } from '../entities/locale.entity';
import { InterchangeItem, TranslationExportOptions } from '../interfaces';
import { LocaleRepository } from '../repositories/locale.repository';
import { ResourceRepository } from '../repositories/resource.repository';
import { TranslationRepository } from '../repositories/translation.repository';

/**
 * Export translations for translation.
 *
 * @param options CLI arguments.
 */
export async function exportCmd(options: TranslationExportOptions) {
  const config = getConfiguration();
  const connection = await getConnection(config);
  const localeRepo = connection.getCustomRepository(LocaleRepository);
  const resourceRepo = connection.getCustomRepository(ResourceRepository);
  const translationRepo = connection.getCustomRepository(TranslationRepository);
  const cwd = process.cwd();
  const dir = path.join(cwd, 'i18n-export');
  let locales: Locale[] = [];
  let count = 0;

  fs.ensureDirSync(dir);

  if (options.locale) {
    const locale = await localeRepo.findByCode(options.locale);
    locales = [locale];
  } else {
    locales = await localeRepo.findAll();
  }

  for (const locale of locales) {
    const sourceLocale = config.defaultLocale;
    const targetLocale = locale.code;

    if (targetLocale === config.defaultLocale) {
      console.log(`Skipping "${targetLocale}", default locale`);
      continue;
    }

    const resources = await resourceRepo.findAll();

    if (resources.length === 0) {
      console.log(`Skipping "${targetLocale}", no resources`);
      continue;
    }

    const translations = await translationRepo.findByLocale([
      sourceLocale,
      targetLocale,
    ]);
    const items: InterchangeItem[] = [];
    let content: string;
    let extension: string;

    resources.forEach((item) => {
      const source = translations.find(
        (x) => x.locale.code === sourceLocale && x.resourceId === item.id
      );
      const target = translations.find(
        (x) => x.locale.code === targetLocale && x.resourceId === item.id
      );

      if (!source) {
        console.log(`Skipping "${item.key}", source not found`);
        return;
      }

      if (target && target.version >= source.version) {
        return;
      }

      items.push({
        key: item.key,
        source: source.value || '',
        target: target?.value || '',
        note: item.description || undefined,
      });
    });

    if (items.length === 0) {
      console.log(`Skipping "${targetLocale}", no translations needed`);
      continue;
    }

    switch (options.format) {
      case 'csv':
        extension = 'csv';
        content = toCsv(sourceLocale, targetLocale, items);
        break;
      case 'json':
        extension = 'json';
        content = toJson(sourceLocale, targetLocale, items);
        break;
      default:
        extension = 'xliff';
        content = await toXliff(sourceLocale, targetLocale, items);
        break;
    }

    const file = `${targetLocale}.${extension}`;
    const dest = path.join(dir, file);

    fs.writeFileSync(dest, content);
    count++;

    console.log(`File exported: "${file}"`);
  }

  console.log(chalk.green(`Successfully exported ${count} files!`));
}

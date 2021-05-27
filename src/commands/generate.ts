import chalk from 'chalk';
import * as fs from 'fs-extra';
import * as glob from 'glob';
import * as micromatch from 'micromatch';
import * as path from 'path';
import * as dot from 'ts-dot-prop';
import { isArray, isString } from 'ts-util-is';

import { getConfiguration } from '../configuration';
import { getConnection } from '../connection';
import { OutputConfig } from '../interfaces';
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

  let output: OutputConfig[];
  let count = 0;

  if (isArray(config.output)) {
    output = config.output;
  } else if (isString(config.output)) {
    output = [{ match: null, directory: config.output }];
  } else {
    output = [{ match: null, directory: config.directory }];
  }

  output.forEach((out) => {
    const dir = out.directory;
    let matches = translations;

    if (out.match) {
      matches = translations.filter((x) =>
        micromatch.isMatch(x.resource.key, out.match)
      );
    }

    const cwd = process.cwd();
    const pattern = path.join(cwd, dir, '*.json');
    const paths = glob.sync(pattern);

    for (const locale of locales) {
      const code = locale.code;
      const items = matches.filter((x) => x.locale.code === code);

      const relativePath = path.join(dir, `${code}.json`);
      const fullPath = path.join(cwd, relativePath);
      const content = items.reduce((obj, item) => {
        if (config.nested) {
          dot.set(obj, item.resource.key, item.value);
        } else {
          obj[item.resource.key] = item.value;
        }

        return obj;
      }, {} as Record<string, any>);
      const index = paths.indexOf(fullPath.replace(/\\/g, '/'));

      fs.outputJsonSync(fullPath, content, { spaces: 2 });
      count++;

      if (index !== -1) {
        paths.splice(index, 1);
      }

      console.log(`File generated: "${relativePath}"`);
    }

    // remove any files from deleted locales
    paths.forEach((item) => {
      const file = item.split('/').pop();
      fs.removeSync(item);
      console.log(`File removed: "${file}"`);
    });
  });

  console.log(chalk.green(`Successfully generated ${count} files!`));
}

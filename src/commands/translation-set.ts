import chalk from 'chalk';
import * as inquirer from 'inquirer';

import { getConfiguration } from '../configuration';
import { getConnection } from '../connection';
import { truncate } from '../helpers/truncate';
import { TranslationSetOptions } from '../interfaces';
import { LocaleRepository } from '../repositories/locale.repository';
import { ResourceRepository } from '../repositories/resource.repository';
import { TranslationRepository } from '../repositories/translation.repository';

/**
 * Add/update translation.
 *
 * @param key Resource key.
 * @param options CLI options.
 */
export async function translationSet(
  key: string,
  value: string,
  options: TranslationSetOptions
) {
  const config = getConfiguration();
  const connection = await getConnection(config);
  const localeRepo = connection.getCustomRepository(LocaleRepository);
  const resourceRepo = connection.getCustomRepository(ResourceRepository);
  const translationRepo = connection.getCustomRepository(TranslationRepository);
  const code = options.locale || config.defaultLocale;
  const locale = await localeRepo.findByCode(code);

  if (!locale) {
    console.log(chalk.red(`Locale "${code}" does not exist!`));
    return;
  }

  const duplicates = await translationRepo.findWhere({
    locale: code,
    term: value,
  });

  if (duplicates.length > 0) {
    const answers = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'continue',
        message: `It looks like "${truncate(
          value
        )}" already exists (${duplicates
          .map((x) => `"${x.resource.key}"`)
          .join(', ')}), are you sure you want to continue?"`,
      },
    ]);

    if (!answers.continue) {
      console.log('Cancelled, nothing was set.');
      return;
    }
  }

  let resource = await resourceRepo.findByKey(key);

  if (!resource || (options.desc && options.desc !== resource.description)) {
    const existed = !!resource?.id;

    resource = await resourceRepo.save({
      id: resource?.id,
      key,
      description: options.desc,
    });

    console.log(`${existed ? 'Resource updated' : 'Resource added'}: "${key}"`);
  }

  const existing = await translationRepo.findUnique(locale.id, resource.id);

  await translationRepo.save({
    id: existing?.id,
    value,
    localeId: locale.id,
    resourceId: resource.id,
  });

  const msg = existing ? 'Translation updated' : 'Translation added';
  console.log(chalk.green(`${msg}: "${code}"!`));
}

import chalk from 'chalk';

import { getConfiguration } from '../configuration';
import { getConnection } from '../connection';
import { LocaleSetOptions } from '../interfaces';
import { LocaleRepository } from '../repositories/locale.repository';

/**
 * Add/update locale.
 *
 * @param code Locale code.
 * @param options CLI options.
 */
export async function localeSet(code: string, options: LocaleSetOptions) {
  const config = getConfiguration();
  const connection = await getConnection(config);
  const localeRepo = connection.getCustomRepository(LocaleRepository);
  const locale = await localeRepo.findByCode(code);

  await localeRepo.save({
    id: locale?.id,
    code,
    name: options.fullName,
  });

  const msg = locale ? 'Locale updated' : 'Locale added';
  console.log(chalk.green(`${msg}: "${code}"!`));
}

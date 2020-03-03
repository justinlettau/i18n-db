import * as path from 'path';
import { createConnection } from 'typeorm';

import { DATABASE_FILENAME } from './configuration';
import { Locale } from './entities/locale.entity';
import { Resource } from './entities/resource.entity';
import { Translation } from './entities/translation.entity';
import { Configuration } from './interfaces';

/**
 * Create sqlite database connection.
 *
 * @param config Configuration object.
 * @param synchronize True to synchronize database with entities.
 */
export async function getConnection(config: Configuration, synchronize = false) {
  const cwd = process.cwd();
  const file = path.join(cwd, config.directory, DATABASE_FILENAME);

  return await createConnection({
    type: 'sqlite',
    database: file,
    synchronize,
    entities: [Locale, Translation, Resource]
  });
}

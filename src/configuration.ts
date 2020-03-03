import * as fs from 'fs-extra';
import * as path from 'path';

import { Configuration } from './interfaces';

/**
 * Database file name.
 */
export const DATABASE_FILENAME = 'i18n.db';

/**
 * Configuration file name.
 */
export const CONFIG_FILENAME = 'i18n.json';

/**
 * Get configuration.
 */
export function getConfiguration() {
  const cwd = process.cwd();
  const file = path.join(cwd, CONFIG_FILENAME);
  let config: Configuration;

  try {
    config = fs.readJsonSync(file);
  } catch {
    // could not find configuration file
  }

  return config;
}

/**
 * Configuration.
 */
export interface Configuration {
  defaultLocale: string;
  directory: string;
  nested?: boolean;
  output?: string | OutputConfig[];
}

/**
 * Output configuration.
 */
export interface OutputConfig {
  match: string | null;
  directory: string;
}

/**
 * Init options.
 */
export interface InitOptions {
  defaultLocale?: string;
  directory?: string;
  output?: string;
}

/**
 * Locale set options.
 */
export interface LocaleSetOptions {
  fullName?: string;
}

/**
 * Translation list options.
 */
export interface TranslationListOptions {
  term?: string;
  key?: string;
  locale?: string;
}

/**
 * Translation set options.
 */
export interface TranslationSetOptions {
  locale?: string;
  desc?: string;
}

/**
 * Import options.
 */
export interface TranslationImportOptions {
  format?: FileType;
  locale?: string;
  bump?: boolean;
}

/**
 * Export options.
 */
export interface TranslationExportOptions {
  format?: FileType;
  locale?: string;
}

/**
 * Supported translation file types.
 */
export type FileType = 'xliff' | 'csv' | 'json';

/**
 * Common interchange structure.
 */
export interface InterchangeItem {
  key: string;
  source: string;
  target: string;
  note?: string;
}

/**
 * Translation duplicate.
 */
export interface Duplicate {
  value: string;
  occurrences: number;
  keys: string;
}

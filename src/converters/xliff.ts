import js2xliff from 'xliff/js2xliff';
import xliff2js from 'xliff/xliff2js';

import { InterchangeItem } from '../interfaces';

/**
 * Convert interchange items to xliff file content.
 *
 * @param source Source locale code.
 * @param target Target locale code.
 * @param items Interchange items.
 */
export function toXliff(
  source: string,
  target: string,
  items: InterchangeItem[]
) {
  const result: {
    [key: string]: { source: string; target: string; note?: string };
  } = {};

  items.forEach((item) => {
    result[item.key] = {
      source: item.source,
      target: item.target,
    };

    if (item.note) {
      result[item.key].note = item.note;
    }
  });

  return js2xliff(
    {
      sourceLanguage: source,
      targetLanguage: target,
      resources: {
        f1: result,
      },
    },
    {}
  );
}

/**
 * Convert xliff file content to interchange items.
 *
 * @param source Source locale code.
 * @param target Target locale code.
 * @param items Raw xliff file content.
 */
export function fromXliff(source: string, target: string, content: string) {
  const result = xliff2js(content);
  const things = result?.resources?.f1;

  if (!things) {
    return [];
  }

  return Object.keys(things).map((key) => {
    const value = things[key];
    const item: InterchangeItem = {
      key,
      source: value.source,
      target: value.target,
      note: value.note,
    };

    return item;
  });
}

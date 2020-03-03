import stringify from 'csv-stringify/lib/sync';
import parse from 'csv-parse/lib/sync';

import { InterchangeItem } from '../interfaces';

/**
 * Convert interchange items to csv file content.
 *
 * @param source Source locale code.
 * @param target Target locale code.
 * @param items Interchange items.
 */
export function toCsv(source: string, target: string, items: InterchangeItem[]) {
  return stringify([['Key', source, target], ...items.map(x => [x.key, x.source, x.target])]);
}

/**
 * Convert csv file content to interchange items.
 *
 * @param source Source locale code.
 * @param target Target locale code.
 * @param items Raw csv file content.
 */
export function fromCsv(source: string, target: string, content: string) {
  const rows: any[] = parse(content);
  const first = rows[0];

  if (first && first[0] === 'Key') {
    // ignore head row
    rows.shift();
  }

  return rows.map(row => {
    const item: InterchangeItem = {
      key: row[0],
      source: row[1],
      target: row[2]
    };

    return item;
  });
}

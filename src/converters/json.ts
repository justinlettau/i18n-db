import { InterchangeItem } from '../interfaces';

/**
 * Convert interchange items to json file content.
 *
 * @param source Source locale code.
 * @param target Target locale code.
 * @param items Interchange items.
 */
export function toJson(source: string, target: string, items: InterchangeItem[]) {
  return JSON.stringify(
    {
      sourceLocale: source,
      targetLocale: target,
      resources: items
    },
    null,
    2
  );
}

/**
 * Convert json file content to interchange items.
 *
 * @param source Source locale code.
 * @param target Target locale code.
 * @param items Raw json file content.
 */
export function fromJson(source: string, target: string, content: string): InterchangeItem[] {
  const obj = JSON.parse(content);
  const resources: InterchangeItem[] = obj.resources;

  if (!resources) {
    // file from generate
    return Object.keys(obj).map(key => ({
      key,
      source: null,
      target: obj[key]
    }));
  }

  // file from export
  return resources;
}

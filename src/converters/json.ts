import { InterchangeItem } from '../interfaces';
import { isObject } from 'ts-util-is';

/**
 * Convert interchange items to json file content.
 *
 * @param source Source locale code.
 * @param target Target locale code.
 * @param items Interchange items.
 */
export function toJson(
  source: string,
  target: string,
  items: InterchangeItem[]
) {
  return JSON.stringify(
    {
      sourceLocale: source,
      targetLocale: target,
      resources: items,
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
export function fromJson(
  source: string,
  target: string,
  content: string
): InterchangeItem[] {
  const obj = JSON.parse(content);
  const resources: InterchangeItem[] = obj.resources;

  if (resources) {
    // file from export
    return resources;
  } else {
    // file from generate
    return parseNestedJson(obj, []);
  }
}

/**
 * Recursively traverse json structure and return interchange items.
 *
 * @param obj Json object.
 * @param path Previously traversed path.
 */
function parseNestedJson(obj: Record<string, any>, path: string[]) {
  const keys = Object.keys(obj);
  const output: InterchangeItem[] = [];

  keys.forEach(key => {
    const value = obj[key];
    const next = [...path, key];

    if (isObject(value)) {
      const result = parseNestedJson(value, next);
      output.push(...result);
    } else {
      output.push({
        key: next.join('.'),
        source: null,
        target: value,
      });
    }
  });

  return output;
}

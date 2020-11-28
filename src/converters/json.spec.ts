import { InterchangeItem } from '../interfaces';
import { fromJson, toJson } from './json';

describe('converts', () => {
  const sourceLocale = 'en-US';
  const targetLocale = 'es-MX';
  const items1: InterchangeItem[] = [
    {
      key: 'Greeting',
      source: 'Hello',
      target: 'Hola',
      note: 'Polite greeting.',
    },
  ];
  const items2: InterchangeItem[] = [
    {
      key: 'Greeting',
      source: null,
      target: 'Hola',
    },
  ];
  const file1 = JSON.stringify(
    {
      sourceLocale,
      targetLocale,
      resources: items1,
    },
    null,
    2
  );
  const file2 = JSON.stringify({ Greeting: 'Hola' }, null, 2);

  describe('toJson method', () => {
    it('should return json string', () => {
      const result = toJson(sourceLocale, targetLocale, items1);

      expect(result).toEqual(file1);
    });
  });

  describe('fromJson method', () => {
    it('should return interchange items (exported file)', () => {
      const result = fromJson(sourceLocale, targetLocale, file1);

      expect(result).toEqual(items1);
    });

    it('should return interchange items (generated file)', () => {
      const result = fromJson(sourceLocale, targetLocale, file2);

      expect(result).toEqual(items2);
    });
  });
});

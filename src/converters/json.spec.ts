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
  const file1 = JSON.stringify(
    {
      sourceLocale,
      targetLocale,
      resources: items1,
    },
    null,
    2
  );

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
      const content = JSON.stringify({
        Greeting: 'Hola',
        Nested: {
          Level1: 'Nivel 1',
          Down: {
            Deep: {
              Level3: 'Nivel 3'
            }
          }
        }
      }, null, 2);
      const result = fromJson(sourceLocale, targetLocale, content);

      expect(result).toEqual([
        {
          key: 'Greeting',
          source: null,
          target: 'Hola',
        },
        {
          key: 'Nested.Level1',
          source: null,
          target: 'Nivel 1',
        },
        {
          key: 'Nested.Down.Deep.Level3',
          source: null,
          target: 'Nivel 3',
        }
      ]);
    });
  });
});

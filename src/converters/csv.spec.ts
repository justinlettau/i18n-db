import { fromCsv, toCsv } from './csv';

describe('converts', () => {
  const sourceLocale = 'en-US';
  const targetLocale = 'es-MX';
  const items = [{ key: 'Greeting', source: 'Hello', target: 'Hola' }];
  const file = 'Key,en-US,es-MX\nGreeting,Hello,Hola\n';

  describe('toCsv method', () => {
    it('should return csv string', () => {
      const result = toCsv(sourceLocale, targetLocale, items);

      expect(result).toBe(file);
    });
  });

  describe('fromCsv method', () => {
    it('should return interchange items', () => {
      const result = fromCsv(sourceLocale, targetLocale, file);

      expect(result).toEqual(items);
    });
  });
});

/// <reference types="../typings" />

import { fromXliff, toXliff } from './xliff';

describe('converts', () => {
  const sourceLocale = 'en-US';
  const targetLocale = 'es-MX';
  const items = [
    {
      key: 'Greeting',
      source: 'Hello',
      target: 'Hola',
      note: 'Polite greeting.',
    },
  ];
  const file = `<xliff xmlns="urn:oasis:names:tc:xliff:document:2.0" version="2.0" srcLang="en-US" trgLang="es-MX">
  <file id="f1">
    <unit id="Greeting">
      <segment>
        <source>Hello</source>
        <target>Hola</target>
        <note>Polite greeting.</note>
      </segment>
    </unit>
  </file>
</xliff>`;

  describe('toXliff method', () => {
    it('should return xliff string', async () => {
      const result = await toXliff(sourceLocale, targetLocale, items);

      expect(result).toBe(file);
    });
  });

  describe('fromXliff method', () => {
    it('should return interchange items', async () => {
      const result = await fromXliff(sourceLocale, targetLocale, file);

      expect(result).toEqual(items);
    });
  });
});

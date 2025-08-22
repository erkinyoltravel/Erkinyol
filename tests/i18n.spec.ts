import { describe, it, expect } from 'vitest';
import Landing, { I18N as I } from '../components/ErkinYolLanding';

describe('I18N shape', () => {
  it('has ru/en/zh locales and core keys', () => {
    const langs = ['ru','en','zh'] as const;
    const keys = ['nav','cta','hero','services','tours','outbound','visa','why','contact','footer','taglines','misc'];
    langs.forEach((l) => {
      keys.forEach((k) => {
        // @ts-ignore
        expect((I||{})[l][k]).toBeDefined();
      });
    });
  });
});

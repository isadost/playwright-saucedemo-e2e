import { test, expect } from '../src/fixtures';
import { KNOWN_VIOLATIONS } from '../src/data/a11y-known';
import { scanA11y, summarize } from '../src/utils/a11y';
test.describe('Erişilebilirlik (WCAG 2.1 AA + best practice)', { tag: '@a11y' }, () => {
  test.describe('oturum olmadan', () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test('giriş sayfasında yeni ihlal yok', async ({ page, loginPage }, testInfo) => {
      await loginPage.goto();

      const violations = await scanA11y(page, testInfo);
      const unexpected = violations.filter((v) => !KNOWN_VIOLATIONS.login.includes(v.id));

      expect(summarize(unexpected), 'Beklenmeyen erişilebilirlik ihlalleri').toEqual([]);
    });
  });

  const pages = [
    { key: 'inventory', name: 'ürün listesi', path: '/inventory.html' },
    { key: 'productDetail', name: 'ürün detayı', path: '/inventory-item.html?id=4' },
    { key: 'cart', name: 'sepet', path: '/cart.html' },
    { key: 'checkoutInfo', name: 'checkout bilgi formu', path: '/checkout-step-one.html' },
  ];

  for (const { key, name, path } of pages) {
    test(`${name} sayfasında yeni ihlal yok`, async ({ page }, testInfo) => {
      await page.goto(path);

      const violations = await scanA11y(page, testInfo);
      const unexpected = violations.filter((v) => !KNOWN_VIOLATIONS[key].includes(v.id));

      expect(summarize(unexpected), 'Beklenmeyen erişilebilirlik ihlalleri').toEqual([]);
    });
  }
});

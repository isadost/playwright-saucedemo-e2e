import { test, expect } from '../src/fixtures';

// Bu dosyadaki testler auth.setup.ts'in kaydettiği oturumla başlar; giriş ekranı atlanır.
test.describe('Ürün listesi', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
  });

  test(
    'kayıtlı oturumla ürün listesine doğrudan erişilir',
    { tag: '@smoke' },
    async ({ page, inventoryPage }) => {
      await expect(page).toHaveURL(/\/inventory\.html$/);
      await expect(inventoryPage.title).toHaveText('Products');
    },
  );

  test('listede 6 ürün bulunur', async ({ inventoryPage }) => {
    await expect(inventoryPage.items).toHaveCount(6);
  });

  test('kullanıcı menüden çıkış yapabilir', async ({ page, inventoryPage, loginPage }) => {
    await inventoryPage.logout();

    await expect(page).toHaveURL(/saucedemo\.com\/$/);
    await expect(loginPage.loginButton).toBeVisible();
  });
});

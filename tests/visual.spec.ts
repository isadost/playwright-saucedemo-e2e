import { test, expect } from '../src/fixtures';
import { PASSWORD, USERS } from '../src/data/users';
import { PRODUCTS } from '../src/data/products';

// Referans görüntüler "Update visual baselines" workflow'u ile CI'da üretilir.
test.describe('Görsel regresyon', { tag: '@visual' }, () => {
  test.describe('oturum olmadan', () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test('giriş sayfası', async ({ page, loginPage }) => {
      await loginPage.goto();

      await expect(page).toHaveScreenshot('login.png', { fullPage: true });
    });
  });

  test('ürün listesi', async ({ page, inventoryPage }) => {
    await inventoryPage.goto();

    await expect(page).toHaveScreenshot('inventory.png', { fullPage: true });
  });

  test('iki ürünlü sepet', async ({ page, inventoryPage, cartPage }) => {
    await inventoryPage.goto();
    await inventoryPage.addToCart(PRODUCTS.backpack, PRODUCTS.bikeLight);
    await cartPage.goto();

    await expect(page).toHaveScreenshot('cart.png', { fullPage: true });
  });
});

// visual_user, standart kullanıcının referans görüntüsüyle karşılaştırılır.
test.describe('Bilinen hatalar: visual_user', { tag: ['@visual', '@known-bug'] }, () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test.fail(
    'BUG-06: visual_user ürün listesi standart kullanıcıyla aynı görünür',
    async ({ page, loginPage }) => {
      await loginPage.goto();
      await loginPage.login(USERS.visual, PASSWORD);
      await expect(page).toHaveURL(/\/inventory\.html$/);

      await expect(page).toHaveScreenshot('inventory.png', { fullPage: true });
    },
  );
});

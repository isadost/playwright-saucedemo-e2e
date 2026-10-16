import { test, expect } from '../src/fixtures';
import { PASSWORD, USERS } from '../src/data/users';
import { CUSTOMER, PRODUCTS } from '../src/data/products';

/*
 * problem_user hesabındaki bilinen hatalar.
 *
 * Her test, DOĞRU davranışı bekler ve test.fail ile işaretlidir:
 *  - Hata hâlâ varsa test beklendiği gibi başarısız olur ve rapor yeşil kalır.
 *  - Hata düzeltilirse test geçer, Playwright bunu "beklenmedik başarı" olarak
 *    kırmızıya çevirir. Böylece düzeltilen hata fark edilir ve işaret kaldırılır.
 */

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Bilinen hatalar: problem_user', { tag: '@known-bug' }, () => {
  test.beforeEach(async ({ page, loginPage }) => {
    await loginPage.goto();
    await loginPage.login(USERS.problem, PASSWORD);
    await expect(page).toHaveURL(/\/inventory\.html$/);
  });

  test.fail('BUG-01: her ürünün kendi görseli gösterilir', async ({ inventoryPage }) => {
    const sources = await inventoryPage.items
      .locator('img')
      .evaluateAll((imgs) => imgs.map((img) => img.getAttribute('src')));

    // Beklenen: 6 ürün, 6 farklı görsel
    expect(new Set(sources).size).toBe(6);
  });

  test.fail('BUG-02: isme göre Z→A sıralama çalışır', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('za');
    const names = await inventoryPage.getNames();

    expect(names).toEqual([...names].sort((a, b) => b.localeCompare(a)));
  });

  test.fail('BUG-03: tüm ürünler sepete eklenebilir', async ({ inventoryPage }) => {
    await inventoryPage.addToCart(...Object.values(PRODUCTS));

    await expect(inventoryPage.cartBadge).toHaveText('6');
  });

  test.fail(
    'BUG-04: ürün adına tıklayınca aynı ürünün detayı açılır',
    async ({ page, inventoryPage }) => {
      const { backpack } = PRODUCTS;
      await inventoryPage.itemNames.filter({ hasText: backpack.name }).click();

      await expect(page).toHaveURL(/inventory-item\.html/);
      await expect(page.getByTestId('inventory-item-name')).toHaveText(backpack.name);
    },
  );

  test.fail(
    'BUG-05: checkout formunda soyad alanına yazılabilir',
    async ({ page, checkoutPage }) => {
      await page.goto('/checkout-step-one.html');

      await checkoutPage.firstName.fill(CUSTOMER.firstName);
      // Kullanıcı gibi harf harf yazılır
      await checkoutPage.lastName.pressSequentially(CUSTOMER.lastName);

      await expect(checkoutPage.lastName).toHaveValue(CUSTOMER.lastName);
      await expect(checkoutPage.firstName).toHaveValue(CUSTOMER.firstName);
    },
  );
});

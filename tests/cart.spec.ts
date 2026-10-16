import { test, expect } from '../src/fixtures';
import { PRODUCTS } from '../src/data/products';

const { backpack, bikeLight, onesie } = PRODUCTS;

test.describe('Sepet', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
  });

  test('ürün eklenince sepet rozeti güncellenir', { tag: '@smoke' }, async ({ inventoryPage }) => {
    await expect(inventoryPage.cartBadge).toBeHidden();

    await inventoryPage.addToCart(backpack);
    await expect(inventoryPage.cartBadge).toHaveText('1');

    await inventoryPage.addToCart(bikeLight);
    await expect(inventoryPage.cartBadge).toHaveText('2');
  });

  test('eklenen ürünün butonu "Remove" olarak değişir', async ({ inventoryPage }) => {
    await inventoryPage.addToCart(backpack);

    await expect(inventoryPage.addToCartButton(backpack)).toBeHidden();
    await expect(inventoryPage.removeButton(backpack)).toBeVisible();
  });

  test('ürün listeden çıkarılınca rozet kaybolur', async ({ inventoryPage }) => {
    await inventoryPage.addToCart(backpack);
    await inventoryPage.removeButton(backpack).click();

    await expect(inventoryPage.cartBadge).toBeHidden();
    await expect(inventoryPage.addToCartButton(backpack)).toBeVisible();
  });

  test('sepet sayfası eklenen ürünleri listeler', async ({ inventoryPage, cartPage, page }) => {
    await inventoryPage.addToCart(backpack, onesie);
    await inventoryPage.openCart();

    await expect(page).toHaveURL(/\/cart\.html$/);
    await expect(cartPage.itemNames).toHaveText([backpack.name, onesie.name]);
  });

  test('sepet sayfasından ürün çıkarılabilir', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCart(backpack, onesie);
    await inventoryPage.openCart();
    await cartPage.remove(backpack);

    await expect(cartPage.itemNames).toHaveText([onesie.name]);
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

  test('sepet sayfa yenilendikten sonra korunur', async ({ inventoryPage, page }) => {
    await inventoryPage.addToCart(backpack, bikeLight);
    await page.reload();

    await expect(inventoryPage.cartBadge).toHaveText('2');
  });
});

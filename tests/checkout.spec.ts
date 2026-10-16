import { test, expect } from '../src/fixtures';
import { CUSTOMER, PRODUCTS, TAX_RATE } from '../src/data/products';

const { backpack, bikeLight } = PRODUCTS;

test.describe('Checkout', () => {
  test.beforeEach(async ({ inventoryPage, cartPage }) => {
    await inventoryPage.goto();
    await inventoryPage.addToCart(backpack, bikeLight);
    await inventoryPage.openCart();
    await cartPage.checkout();
  });

  test('sipariş baştan sona tamamlanır', { tag: '@smoke' }, async ({ page, checkoutPage }) => {
    await checkoutPage.fillInformation(CUSTOMER);
    await expect(page).toHaveURL(/\/checkout-step-two\.html$/);

    await checkoutPage.finish();

    await expect(page).toHaveURL(/\/checkout-complete\.html$/);
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
  });

  test('özet ekranındaki ara toplam, vergi ve toplam doğrudur', async ({ checkoutPage }) => {
    await checkoutPage.fillInformation(CUSTOMER);

    const expectedSubtotal = backpack.price + bikeLight.price;
    const expectedTax = Math.round(expectedSubtotal * TAX_RATE * 100) / 100;

    const subtotal = await checkoutPage.readAmount(checkoutPage.subtotalLabel);
    const tax = await checkoutPage.readAmount(checkoutPage.taxLabel);
    const total = await checkoutPage.readAmount(checkoutPage.totalLabel);

    // Kuruş hatalarına karşı toBeCloseTo kullanılır
    expect(subtotal).toBeCloseTo(expectedSubtotal, 2);
    expect(tax).toBeCloseTo(expectedTax, 2);
    expect(total).toBeCloseTo(expectedSubtotal + expectedTax, 2);
  });

  const missingFieldCases = [
    { field: 'ad', info: { ...CUSTOMER, firstName: '' }, error: 'First Name is required' },
    { field: 'soyad', info: { ...CUSTOMER, lastName: '' }, error: 'Last Name is required' },
    {
      field: 'posta kodu',
      info: { ...CUSTOMER, postalCode: '' },
      error: 'Postal Code is required',
    },
  ];

  for (const { field, info, error } of missingFieldCases) {
    test(`${field} boş bırakılınca form ilerlemez`, async ({ page, checkoutPage }) => {
      await checkoutPage.fillInformation(info);

      await expect(checkoutPage.error).toContainText(error);
      await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
    });
  }

  test('iptal edilince sepete dönülür ve ürünler korunur', async ({
    page,
    checkoutPage,
    cartPage,
  }) => {
    await checkoutPage.cancelButton.click();

    await expect(page).toHaveURL(/\/cart\.html$/);
    await expect(cartPage.itemNames).toHaveText([backpack.name, bikeLight.name]);
  });
});

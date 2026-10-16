import { test, expect } from '../src/fixtures';
import { PASSWORD, USERS } from '../src/data/users';

// Giriş testleri hazır oturumu kullanmamalı; boş oturumla başlar.
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Giriş', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test(
    'standart kullanıcı giriş yapıp ürün listesini görür',
    { tag: '@smoke' },
    async ({ page, loginPage, inventoryPage }) => {
      await loginPage.login(USERS.standard, PASSWORD);

      await expect(page).toHaveURL(/\/inventory\.html$/);
      await expect(inventoryPage.title).toHaveText('Products');
    },
  );

  const negativeCases = [
    {
      name: 'kilitli kullanıcı',
      username: USERS.lockedOut,
      password: PASSWORD,
      error: 'Sorry, this user has been locked out.',
    },
    {
      name: 'yanlış şifre',
      username: USERS.standard,
      password: 'yanlis_sifre',
      error: 'Username and password do not match any user in this service',
    },
    {
      name: 'boş kullanıcı adı',
      username: '',
      password: PASSWORD,
      error: 'Username is required',
    },
    {
      name: 'boş şifre',
      username: USERS.standard,
      password: '',
      error: 'Password is required',
    },
  ];

  for (const { name, username, password, error } of negativeCases) {
    test(`${name} ile giriş reddedilir`, async ({ page, loginPage }) => {
      await loginPage.login(username, password);

      await expect(loginPage.error).toContainText(error);
      await expect(page).not.toHaveURL(/inventory/);
    });
  }

  test('oturum açmadan ürün sayfasına doğrudan erişilemez', async ({ page, loginPage }) => {
    await page.goto('/inventory.html');

    await expect(loginPage.error).toContainText("You can only access '/inventory.html'");
    await expect(loginPage.loginButton).toBeVisible();
  });
});

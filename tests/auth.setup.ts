import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';
import { AUTH_FILE, PASSWORD, USERS } from '../src/data/users';

// Bir kez giriş yapılır, oturum dosyaya kaydedilir; diğer testler bu oturumu kullanır.
setup('standart kullanıcı oturumunu hazırla', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(USERS.standard, PASSWORD);

  await expect(page).toHaveURL(/\/inventory\.html$/);
  await page.context().storageState({ path: AUTH_FILE });
});

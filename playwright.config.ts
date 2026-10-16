import { defineConfig, devices } from '@playwright/test';
import { AUTH_FILE } from './src/data/users';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  // CI'da yanlışlıkla bırakılmış test.only varsa koşumu durdur
  forbidOnly: !!process.env.CI,
  // Yerelde tekrar deneme yok; CI'da ağ kaynaklı dalgalanmalara karşı 2 deneme
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'https://www.saucedemo.com',
    // SauceDemo seçicileri data-test özniteliğini kullanıyor
    testIdAttribute: 'data-test',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    // Önce oturum hazırlanır
    { name: 'setup', testMatch: /.*\.setup\.ts/ },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], storageState: AUTH_FILE },
      dependencies: ['setup'],
    },
    // Firefox ve WebKit 4. aşamada eklenecek
  ],
});

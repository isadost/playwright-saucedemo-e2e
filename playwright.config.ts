import { defineConfig, devices } from '@playwright/test';
import { AUTH_FILE } from './src/data/users';

// Ekran görüntüleri işletim sistemine göre piksel farkı içerir.
// Referanslar CI'da (Linux) üretildiği için görsel testler yalnızca Linux'ta çalışır.
const isLinux = process.platform === 'linux';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  // CI'da yanlışlıkla bırakılmış test.only varsa koşumu durdur
  forbidOnly: !!process.env.CI,
  // Yerelde tekrar deneme yok; CI'da ağ kaynaklı dalgalanmalara karşı 2 deneme
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  // Referans görüntüler platform eki olmadan tek bir klasörde tutulur
  snapshotPathTemplate: '{testDir}/__screenshots__/{testFilePath}/{arg}{ext}',
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.01 },
  },
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
      testIgnore: isLinux ? undefined : /visual\.spec\.ts/,
    },
    // Firefox ve WebKit sonraki adımda eklenecek
  ],
});

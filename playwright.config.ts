import { defineConfig, devices } from '@playwright/test';
import { AUTH_FILE } from './src/data/users';

// Ekran görüntüleri işletim sistemine göre piksel farkı içerir.
// Referanslar CI'da (Linux) üretildiği için görsel testler yalnızca Linux'ta çalışır.
const isLinux = process.platform === 'linux';
const isCI = !!process.env.CI;

// Görsel referanslar ve axe taraması tarayıcıdan bağımsız; yalnızca Chromium'da koşar
const chromiumOnly = [/visual\.spec\.ts/, /accessibility\.spec\.ts/];

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  // CI'da yanlışlıkla bırakılmış test.only varsa koşumu durdur
  forbidOnly: isCI,
  // Yerelde tekrar deneme yok; CI'da ağ kaynaklı dalgalanmalara karşı 2 deneme
  retries: isCI ? 2 : 0,
  // Yerelde işlemci çekirdeklerinin yarısı kullanılır; üç tarayıcı aynı anda koşunca
  // makine aşırı yüklenip Firefox testleri zaman aşımına düşüyordu
  workers: isCI ? 2 : 4,
  reporter: isCI ? [['list'], ['blob']] : [['list'], ['html', { open: 'never' }]],
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
    // Önce oturum hazırlanır; oturum çerezi tarayıcıdan bağımsızdır
    { name: 'setup', testMatch: /.*\.setup\.ts/ },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], storageState: AUTH_FILE },
      dependencies: ['setup'],
      testIgnore: isLinux ? undefined : /visual\.spec\.ts/,
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'], storageState: AUTH_FILE },
      dependencies: ['setup'],
      testIgnore: chromiumOnly,
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'], storageState: AUTH_FILE },
      dependencies: ['setup'],
      testIgnore: chromiumOnly,
    },
  ],
});

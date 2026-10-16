# playwright-saucedemo-e2e

![Playwright Tests](https://github.com/isadost/playwright-saucedemo-e2e/actions/workflows/playwright.yml/badge.svg)

[SauceDemo](https://www.saucedemo.com) e-ticaret demo sitesi için **Playwright + TypeScript** ile yazılmış uçtan uca test otomasyonu projesi.

> 🚧 Proje geliştirme aşamasında. Şu an: **2. aşama (mimari)** tamamlandı

## Teknolojiler

- Playwright Test
- TypeScript
- ESLint + Prettier
- GitHub Actions

## Proje yapısı

```
src/
  data/users.ts          # demo hesapları ve oturum dosyası yolu
  fixtures/index.ts      # sayfa nesnelerini testlere enjekte eden fixture'lar
  pages/                 # Page Object Model sınıfları
tests/
  auth.setup.ts          # bir kez giriş yapıp oturumu kaydeder
  login.spec.ts          # giriş senaryoları (pozitif + negatif)
  inventory.spec.ts      # kayıtlı oturumla çalışan ürün listesi testleri
```

## Mimari kararlar

- **Page Object Model:** Seçiciler sayfa sınıflarında, doğrulamalar testlerde. Bir seçici değişirse tek yerden düzeltilir.
- **Fixture'lar:** Sayfa nesneleri testlere parametre olarak gelir, her testte tekrar oluşturulmaz.
- **`storageState`:** Giriş bir kez `setup` projesinde yapılır ve oturum dosyaya kaydedilir. Diğer testler giriş ekranını atlayarak doğrudan işe başlar. Giriş testleri ise bilerek boş oturumla çalışır.
- **Veri odaklı negatif testler:** Hatalı giriş senaryoları tek bir tablodan üretilir; yeni senaryo eklemek bir satır demektir.

## Kurulum

```bash
npm install
npx playwright install chromium
```

## Çalıştırma

```bash
npm test              # tüm testler
npm run test:smoke    # sadece @smoke etiketli testler
npm run test:ui       # Playwright UI modu
npm run report        # son koşumun HTML raporu
```

## Yol haritası

- [x] Temel kurulum, smoke testleri, CI
- [x] Page Object Model, fixture'lar, `storageState` ile oturum yönetimi
- [ ] Sepet, sıralama ve checkout senaryoları; bilinen hataların belgelenmesi
- [ ] Görsel regresyon, erişilebilirlik testi, çoklu tarayıcı, GitHub Pages'te rapor

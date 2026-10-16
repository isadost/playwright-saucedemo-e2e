# playwright-saucedemo-e2e

![Playwright Tests](https://github.com/isadost/playwright-saucedemo-e2e/actions/workflows/playwright.yml/badge.svg)

[SauceDemo](https://www.saucedemo.com) e-ticaret demo sitesi için **Playwright + TypeScript** ile yazılmış uçtan uca test otomasyonu projesi.

> 🚧 Proje geliştirme aşamasında. Şu an: **3. aşama**, standart kullanıcı akışı tamamlandı

## Teknolojiler

- Playwright Test
- TypeScript
- ESLint + Prettier
- GitHub Actions

## Proje yapısı

```
src/
  data/users.ts          # demo hesapları ve oturum dosyası yolu
  data/products.ts       # ürün kataloğu, vergi oranı, müşteri bilgisi
  fixtures/index.ts      # sayfa nesnelerini testlere enjekte eden fixture'lar
  pages/                 # Page Object Model sınıfları
tests/
  auth.setup.ts          # bir kez giriş yapıp oturumu kaydeder
  login.spec.ts          # giriş senaryoları (pozitif + negatif)
  inventory.spec.ts      # kayıtlı oturumla çalışan ürün listesi testleri
  cart.spec.ts           # sepete ekleme, çıkarma, rozet, kalıcılık
  sorting.spec.ts        # isim ve fiyat sıralamaları
  checkout.spec.ts       # sipariş akışı, tutar hesabı, form doğrulamaları
```

## Mimari kararlar

- **Page Object Model:** Seçiciler sayfa sınıflarında, doğrulamalar testlerde. Bir seçici değişirse tek yerden düzeltilir.
- **Fixture'lar:** Sayfa nesneleri testlere parametre olarak gelir, her testte tekrar oluşturulmaz.
- **`storageState`:** Giriş bir kez `setup` projesinde yapılır ve oturum dosyaya kaydedilir. Diğer testler giriş ekranını atlayarak doğrudan işe başlar. Giriş testleri ise bilerek boş oturumla çalışır.
- **Beklenen değerler hesaplanır:** Checkout testinde toplam tutar ekrandan kopyalanmaz; ürün fiyatlarından ve vergi oranından hesaplanıp ekranla karşılaştırılır.
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
- [x] Sepet, sıralama ve checkout senaryoları
- [ ] `problem_user` hesabındaki bilinen hataların belgelenmesi
- [ ] Görsel regresyon, erişilebilirlik testi, çoklu tarayıcı, GitHub Pages'te rapor

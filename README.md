# playwright-saucedemo-e2e

![Playwright Tests](https://github.com/isadost/playwright-saucedemo-e2e/actions/workflows/playwright.yml/badge.svg)

[SauceDemo](https://www.saucedemo.com) e-ticaret demo sitesi için **Playwright + TypeScript** ile yazılmış uçtan uca test otomasyonu projesi.

> 🚧 Proje geliştirme aşamasında. Şu an: **3. aşama** tamamlandı

## Teknolojiler

- Playwright Test
- TypeScript
- ESLint + Prettier
- GitHub Actions

## Proje yapısı

```
src/
  data/users.ts        # demo hesapları
  data/products.ts     # ürünler, vergi, müşteri
  fixtures/index.ts    # sayfa fixture'ları
  pages/               # Page Object'ler
tests/
  auth.setup.ts        # oturumu kaydeder
  login.spec.ts        # giriş senaryoları
  inventory.spec.ts    # ürün listesi
  cart.spec.ts         # sepet işlemleri
  sorting.spec.ts      # sıralamalar
  checkout.spec.ts     # sipariş akışı
  known-bugs.spec.ts   # problem_user hataları
```

## Mimari kararlar

- **Page Object Model:** Seçiciler sayfa sınıflarında, doğrulamalar testlerde. Bir seçici değişirse tek yerden düzeltilir.
- **Fixture'lar:** Sayfa nesneleri testlere parametre olarak gelir, her testte tekrar oluşturulmaz.
- **`storageState`:** Giriş bir kez `setup` projesinde yapılır ve oturum dosyaya kaydedilir. Diğer testler giriş ekranını atlayarak doğrudan işe başlar. Giriş testleri ise bilerek boş oturumla çalışır.
- **Beklenen değerler hesaplanır:** Checkout testinde toplam tutar ekrandan kopyalanmaz; ürün fiyatlarından ve vergi oranından hesaplanıp ekranla karşılaştırılır.
- **Veri odaklı negatif testler:** Hatalı giriş senaryoları tek bir tablodan üretilir; yeni senaryo eklemek bir satır demektir.
- **Bilinen hatalar `test.fail()` ile belgelenir:** Testler doğru davranışı bekler. Hata sürdükçe rapor yeşil kalır; hata düzeltilirse test kırmızıya döner ve işaretin kaldırılması gerektiğini haber verir.

## Bulunan hatalar

SauceDemo'nun `problem_user` hesabında bulunan hatalar `tests/known-bugs.spec.ts` dosyasında belgelendi.

| Kod    | Alan         | Beklenen                                      | Gözlenen                                       |
| ------ | ------------ | --------------------------------------------- | ---------------------------------------------- |
| BUG-01 | Ürün listesi | Her ürün kendi görselini gösterir             | Ürünler aynı görseli paylaşıyor                |
| BUG-02 | Sıralama     | Z→A seçilince liste tersine sıralanır         | Liste beklenen sıraya girmiyor                 |
| BUG-03 | Sepet        | 6 ürünün hepsi sepete eklenir                 | Bazı ürünlerin "Add to cart" butonu çalışmıyor |
| BUG-04 | Ürün detayı  | Ürün adına tıklayınca o ürünün sayfası açılır | Farklı bir ürünün sayfası açılıyor             |
| BUG-05 | Checkout     | Soyad alanına yazılan metin alanda kalır      | Soyad alanı yazılanı tutmuyor                  |

## Kurulum

```bash
npm install
npx playwright install chromium
```

## Çalıştırma

```bash
npm test              # tüm testler
npm run test:smoke    # sadece @smoke etiketli testler
npm run test:bugs     # sadece bilinen hata testleri
npm run test:ui       # Playwright UI modu
npm run report        # son koşumun HTML raporu
```

## Yol haritası

- [x] Temel kurulum, smoke testleri, CI
- [x] Page Object Model, fixture'lar, `storageState` ile oturum yönetimi
- [x] Sepet, sıralama ve checkout senaryoları
- [x] `problem_user` hesabındaki bilinen hataların belgelenmesi
- [ ] Görsel regresyon, erişilebilirlik testi, çoklu tarayıcı, GitHub Pages'te rapor

# playwright-saucedemo-e2e

![Playwright Tests](https://github.com/isadost/playwright-saucedemo-e2e/actions/workflows/playwright.yml/badge.svg)

[SauceDemo](https://www.saucedemo.com) e-ticaret demo sitesi için **Playwright + TypeScript** ile yazılmış uçtan uca test otomasyonu projesi.

> 🚧 Proje geliştirme aşamasında. Şu an: **4. aşama**, görsel regresyon ve erişilebilirlik testleri tamamlandı

## Teknolojiler

- Playwright Test
- TypeScript
- axe-core (erişilebilirlik taraması)
- ESLint + Prettier
- GitHub Actions

## Proje yapısı

```
src/
  data/users.ts           # demo hesapları
  data/products.ts        # ürünler, vergi, müşteri
  data/a11y-known.ts      # bilinen erişilebilirlik ihlalleri
  fixtures/index.ts       # sayfa fixture'ları
  pages/                  # Page Object'ler
  utils/a11y.ts           # axe tarama yardımcısı
tests/
  auth.setup.ts           # oturumu kaydeder
  login.spec.ts           # giriş senaryoları
  inventory.spec.ts       # ürün listesi
  cart.spec.ts            # sepet işlemleri
  sorting.spec.ts         # sıralamalar
  checkout.spec.ts        # sipariş akışı
  known-bugs.spec.ts      # problem_user hataları
  visual.spec.ts          # görsel regresyon
  accessibility.spec.ts   # erişilebilirlik taraması
  __screenshots__/        # görsel referans görüntüler
```

## Mimari kararlar

- **Page Object Model:** Seçiciler sayfa sınıflarında, doğrulamalar testlerde. Bir seçici değişirse tek yerden düzeltilir.
- **Fixture'lar:** Sayfa nesneleri testlere parametre olarak gelir, her testte tekrar oluşturulmaz.
- **`storageState`:** Giriş bir kez `setup` projesinde yapılır ve oturum dosyaya kaydedilir. Diğer testler giriş ekranını atlayarak doğrudan işe başlar. Giriş testleri ise bilerek boş oturumla çalışır.
- **Beklenen değerler hesaplanır:** Checkout testinde toplam tutar ekrandan kopyalanmaz; ürün fiyatlarından ve vergi oranından hesaplanıp ekranla karşılaştırılır.
- **Veri odaklı negatif testler:** Hatalı giriş senaryoları tek bir tablodan üretilir; yeni senaryo eklemek bir satır demektir.
- **Bilinen hatalar `test.fail()` ile belgelenir:** Testler doğru davranışı bekler. Hata sürdükçe rapor yeşil kalır; hata düzeltilirse test kırmızıya döner ve işaretin kaldırılması gerektiğini haber verir.
- **Görsel referanslar CI'da üretilir:** Ekran görüntüleri işletim sistemine göre piksel farkı içerdiği için referanslar Linux'ta, elle tetiklenen `Update visual baselines` workflow'u ile üretilip commit edilir. Görsel testler yerelde Windows/macOS'ta otomatik olarak atlanır.

## Bulunan hatalar

SauceDemo'nun `problem_user` ve `visual_user` hesaplarında bulunan hatalar `tests/known-bugs.spec.ts` ve `tests/visual.spec.ts` dosyalarında belgelendi.

| Kod    | Alan         | Beklenen                                                      | Gözlenen                                                   |
| ------ | ------------ | ------------------------------------------------------------- | ---------------------------------------------------------- |
| BUG-01 | Ürün listesi | Her ürün kendi görselini gösterir                             | Ürünler aynı görseli paylaşıyor                            |
| BUG-02 | Sıralama     | Z→A seçilince liste tersine sıralanır                         | Liste beklenen sıraya girmiyor                             |
| BUG-03 | Sepet        | 6 ürünün hepsi sepete eklenir                                 | Bazı ürünlerin "Add to cart" butonu çalışmıyor             |
| BUG-04 | Ürün detayı  | Ürün adına tıklayınca o ürünün sayfası açılır                 | Farklı bir ürünün sayfası açılıyor                         |
| BUG-05 | Checkout     | Soyad alanına yazılan metin alanda kalır                      | Soyad alanı yazılanı tutmuyor                              |
| BUG-06 | Görünüm      | `visual_user` ürün listesi standart kullanıcıyla aynı görünür | Ekran görüntüsü standart kullanıcının referansından farklı |

## Erişilebilirlik bulguları

Beş sayfa [axe-core](https://github.com/dequelabs/axe-core) ile WCAG 2.1 A/AA ve axe "best practice" kurallarına göre taranır. **WCAG 2.1 A/AA ihlali bulunmadı.** Best practice kurallarında bulunan ihlaller `src/data/a11y-known.ts` dosyasında belgelendi; testler yalnızca bu listede olmayan yeni bir ihlal çıkarsa başarısız olur.

| Kural                  | Sayfalar     | Etki                                                                    |
| ---------------------- | ------------ | ----------------------------------------------------------------------- |
| `page-has-heading-one` | Tüm sayfalar | Sayfada `<h1>` yok; ekran okuyucu kullanıcıları ana başlığa atlayamıyor |
| `region`               | Giriş        | İçeriğin bir kısmı landmark dışında; bölümler arası gezinme zorlaşıyor  |

Otomatik tarama erişilebilirlik sorunlarının yalnızca bir kısmını yakalar. Klavyeyle gezinme ve ekran okuyucu deneyimi ayrıca elle test edilmelidir.

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
npm run test:visual   # görsel regresyon (yalnızca Linux)
npm run test:a11y     # erişilebilirlik taraması
npm run test:ui       # Playwright UI modu
npm run report        # son koşumun HTML raporu
```

Görsel referansları güncellemek için: **Actions → Update visual baselines → Run workflow**

## Yol haritası

- [x] Temel kurulum, smoke testleri, CI
- [x] Page Object Model, fixture'lar, `storageState` ile oturum yönetimi
- [x] Sepet, sıralama ve checkout senaryoları
- [x] `problem_user` hesabındaki bilinen hataların belgelenmesi
- [x] Görsel regresyon ve erişilebilirlik testi
- [ ] Çoklu tarayıcı (Firefox, WebKit) ve GitHub Pages'te rapor

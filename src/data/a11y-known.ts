// Sitede bulunan ve belgelenen erişilebilirlik ihlalleri (axe kural kimlikleri).
// Testler yalnızca bu listede OLMAYAN yeni ihlallerde başarısız olur.
// Not: Bu ihlallerin hepsi "best-practice" kurallarından; WCAG 2.1 A/AA ihlali bulunmadı.
export const KNOWN_VIOLATIONS: Record<string, string[]> = {
  login: ['page-has-heading-one', 'region'],
  inventory: ['page-has-heading-one'],
  productDetail: ['page-has-heading-one'],
  cart: ['page-has-heading-one'],
  checkoutInfo: ['page-has-heading-one'],
};

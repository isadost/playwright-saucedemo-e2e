import AxeBuilder from '@axe-core/playwright';
import type { Page, TestInfo } from '@playwright/test';

// WCAG 2.1 A ve AA kuralları ile axe'ın "iyi uygulama" önerileri
const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'];

type Violation = Awaited<ReturnType<AxeBuilder['analyze']>>['violations'][number];

// Sayfayı tarar, tüm ihlalleri rapora JSON olarak ekler ve döndürür
export async function scanA11y(page: Page, testInfo: TestInfo) {
  const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();

  await testInfo.attach('axe-ihlalleri', {
    body: JSON.stringify(results.violations, null, 2),
    contentType: 'application/json',
  });

  return results.violations;
}

// "color-contrast (serious): 3 öğe" gibi okunabilir bir özet üretir
export function summarize(violations: Violation[]) {
  return violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.length} öğe - ${v.help}`);
}

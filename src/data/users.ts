// SauceDemo'nun herkese açık demo hesapları.
// Şifre ortam değişkeninden okunabilir; tanımlı değilse demo şifresi kullanılır.
export const PASSWORD = process.env.SAUCE_PASSWORD ?? 'secret_sauce';

export const USERS = {
  standard: 'standard_user',
  lockedOut: 'locked_out_user',
  problem: 'problem_user',
  performanceGlitch: 'performance_glitch_user',
  error: 'error_user',
  visual: 'visual_user',
} as const;

export const AUTH_FILE = 'playwright/.auth/standard_user.json';

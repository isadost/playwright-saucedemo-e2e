import type { Locator, Page } from '@playwright/test';

export class InventoryPage {
  readonly title: Locator;
  readonly items: Locator;
  readonly menuButton: Locator;
  readonly logoutLink: Locator;

  constructor(private readonly page: Page) {
    this.title = page.getByTestId('title');
    this.items = page.getByTestId('inventory-item');
    this.menuButton = page.getByRole('button', { name: 'Open Menu' });
    this.logoutLink = page.getByTestId('logout-sidebar-link');
  }

  async goto() {
    await this.page.goto('/inventory.html');
  }

  async logout() {
    await this.menuButton.click();
    await this.logoutLink.click();
  }
}

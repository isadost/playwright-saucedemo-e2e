import type { Locator, Page } from '@playwright/test';
import type { Product } from '../data/products';

export class CartPage {
  readonly items: Locator;
  readonly itemNames: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(private readonly page: Page) {
    this.items = page.getByTestId('inventory-item');
    this.itemNames = page.getByTestId('inventory-item-name');
    this.checkoutButton = page.getByTestId('checkout');
    this.continueShoppingButton = page.getByTestId('continue-shopping');
  }

  async goto() {
    await this.page.goto('/cart.html');
  }

  async remove(product: Product) {
    await this.page.getByTestId(`remove-${product.slug}`).click();
  }

  async checkout() {
    await this.checkoutButton.click();
  }
}

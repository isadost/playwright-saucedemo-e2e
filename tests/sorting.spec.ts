import { test, expect } from '../src/fixtures';

test.describe('Sıralama', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
  });

  test('varsayılan sıralama isme göre A→Z', async ({ inventoryPage }) => {
    const names = await inventoryPage.getNames();

    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });

  test('isme göre Z→A sıralanır', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('za');
    const names = await inventoryPage.getNames();

    expect(names).toEqual([...names].sort((a, b) => b.localeCompare(a)));
  });

  test('fiyata göre artan sıralanır', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('lohi');
    const prices = await inventoryPage.getPrices();

    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('fiyata göre azalan sıralanır', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('hilo');
    const prices = await inventoryPage.getPrices();

    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });
});

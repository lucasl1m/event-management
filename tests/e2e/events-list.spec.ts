import { test, expect } from '@playwright/test';

test.describe('Events list', () => {
  test('loads and displays events from the API', async ({ page }) => {
    await page.goto('/events');
    await page.waitForLoadState('networkidle');

    // At least one event card should be present
    const cards = page
      .getByRole('link')
      .filter({ hasText: /Tech Summit|Design Week|Startup Pitch|Festival|DevConf/i });
    await expect(cards.first()).toBeVisible();
  });

  test('filters events by "closed" status', async ({ page }) => {
    await page.goto('/events');
    await page.waitForLoadState('networkidle');

    const statusSelect = page.getByRole('combobox');
    await statusSelect.click();
    await page.getByRole('option', { name: 'Encerrados' }).click();

    await expect(page.getByText('Design Week Rio')).toBeVisible();
    await expect(page.getByText('Tech Summit')).not.toBeVisible();
  });

  test('search filters events by name with debounce', async ({ page }) => {
    await page.goto('/events');
    await page.waitForLoadState('networkidle');

    const searchInput = page.getByRole('searchbox');
    await searchInput.fill('DevConf');
    // Wait for debounce (~350ms)
    await page.waitForTimeout(500);

    await expect(page.getByText('DevConf Brasil')).toBeVisible();
    await expect(page.getByText('Tech Summit 2025')).not.toBeVisible();
  });

  test('shows empty state when API returns no events', async ({ page }) => {
    await page.route('**/localhost:3001/events*', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }),
    );

    await page.goto('/events');
    await page.waitForLoadState('networkidle');

    await expect(page.getByText(/nenhum evento/i)).toBeVisible();
  });

  test('shows error state with retry button when API fails', async ({ page }) => {
    await page.route('**/localhost:3001/events*', (route) => route.fulfill({ status: 500 }));

    await page.goto('/events');
    await page.waitForLoadState('networkidle');

    await expect(page.getByText(/não foi possível/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /tentar novamente/i })).toBeVisible();
  });

  test('navigates to event detail on card click', async ({ page }) => {
    await page.goto('/events');
    await page.waitForLoadState('networkidle');

    await page.getByText('Tech Summit 2025').click();
    await expect(page).toHaveURL(/\/events\/EVT-001/);
  });
});

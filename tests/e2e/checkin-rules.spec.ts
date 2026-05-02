import { test, expect } from '@playwright/test';

// Uses page.route() to intercept mutations so db.json is never modified (option C).
// EVT-001 is the primary active test event.
// EVT-002 is the closed event.
// Participant IDs are derived from db.seed.json.

const API = 'http://localhost:3001';

function interceptMutations(page: import('@playwright/test').Page) {
  // Intercept checkin POST
  page.route(`${API}/checkins`, (route) => {
    if (route.request().method() === 'POST') {
      const body = JSON.parse(route.request().postData() ?? '{}');
      route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ id: `CHK-TEST-${Date.now()}`, ...body }),
      });
    } else {
      route.continue();
    }
  });
  // Intercept participant PATCH
  page.route(`${API}/participants/**`, (route) => {
    if (route.request().method() === 'PATCH') {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: route.request().postData() ?? '{}',
      });
    } else {
      route.continue();
    }
  });
  // Intercept event PATCH
  page.route(`${API}/events/**`, (route) => {
    if (route.request().method() === 'PATCH') {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: route.request().postData() ?? '{}',
      });
    } else {
      route.continue();
    }
  });
}

test.describe('Check-in rules', () => {
  test('VIP outside can check in (entry)', async ({ page }) => {
    interceptMutations(page);
    await page.goto('/events/EVT-001');
    await page.waitForLoadState('networkidle');

    // Ana Pereira is a VIP with status outside in EVT-001
    const entryButton = page.getByRole('button', { name: /Entrada para Ana Pereira/i });
    await expect(entryButton).toBeEnabled();
    await entryButton.click();

    // Toast should appear
    await expect(page.getByText(/check-in realizado|entrada registrada/i)).toBeVisible({
      timeout: 5000,
    });
  });

  test('VIP inside can check out (exit)', async ({ page }) => {
    interceptMutations(page);
    await page.goto('/events/EVT-005');
    await page.waitForLoadState('networkidle');

    // Camila Pereira is a VIP with status inside in EVT-005
    const exitButton = page.getByRole('button', { name: /Saída para Camila Pereira/i });
    await expect(exitButton).toBeEnabled();
    await exitButton.click();

    await expect(page.getByText(/saída registrada|check-out realizado/i)).toBeVisible({
      timeout: 5000,
    });
  });

  test('Normal participant can check in once', async ({ page }) => {
    interceptMutations(page);
    await page.goto('/events/EVT-001');
    await page.waitForLoadState('networkidle');

    // Camila Martins is a Normal with 0 checkins (outside) in EVT-001
    const entryButton = page.getByRole('button', { name: /Entrada para Camila Martins/i });
    await expect(entryButton).toBeEnabled();
    await entryButton.click();

    await expect(page.getByText(/check-in realizado|entrada registrada/i)).toBeVisible({
      timeout: 5000,
    });
  });

  test('Normal participant already checked in shows disabled button', async ({ page }) => {
    await page.goto('/events/EVT-001');
    await page.waitForLoadState('networkidle');

    // Natalia Carvalho is Normal with checkin_count=1 (inside) — button must be disabled
    const entryButton = page.getByRole('button', { name: /Entrada para Natalia Carvalho/i });
    await expect(entryButton).toBeDisabled();
  });

  test('Closed event disables all check-in buttons', async ({ page }) => {
    await page.goto('/events/EVT-002');
    await page.waitForLoadState('networkidle');

    // All entry/exit buttons should be disabled
    const buttons = page.getByRole('button', { name: /Entrada para|Saída para/i });
    const count = await buttons.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      await expect(buttons.nth(i)).toBeDisabled();
    }
  });

  test('Closed event shows tooltip on disabled button hover', async ({ page }) => {
    await page.goto('/events/EVT-002');
    await page.waitForLoadState('networkidle');

    const firstDisabledButton = page
      .getByRole('button', { name: /Entrada para|Saída para/i })
      .first();
    await firstDisabledButton.hover();

    await expect(page.getByText(/Evento encerrado/i)).toBeVisible({ timeout: 3000 });
  });
});

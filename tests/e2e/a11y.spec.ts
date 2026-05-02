import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility — axe-core', () => {
  test('home page has no critical/serious violations', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();

    const violations = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious',
    );

    if (violations.length > 0) {
      console.error(
        'Axe violations on /:\n',
        violations.map((v) => `[${v.impact}] ${v.id}: ${v.description}`).join('\n'),
      );
    }

    expect(violations).toHaveLength(0);
  });

  test('events list page has no critical/serious violations', async ({ page }) => {
    await page.goto('/events');
    await page.waitForLoadState('networkidle');

    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();

    const violations = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious',
    );

    if (violations.length > 0) {
      console.error(
        'Axe violations on /events:\n',
        violations.map((v) => `[${v.impact}] ${v.id}: ${v.description}`).join('\n'),
      );
    }

    expect(violations).toHaveLength(0);
  });

  test('event detail page (EVT-001) has no critical/serious violations', async ({ page }) => {
    await page.goto('/events/EVT-001');
    await page.waitForLoadState('networkidle');

    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();

    const violations = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious',
    );

    if (violations.length > 0) {
      console.error(
        'Axe violations on /events/EVT-001:\n',
        violations.map((v) => `[${v.impact}] ${v.id}: ${v.description}`).join('\n'),
      );
    }

    expect(violations).toHaveLength(0);
  });

  test('event cards on events list are keyboard focusable', async ({ page }) => {
    await page.goto('/events');
    await page.waitForLoadState('networkidle');

    // Tab into the page past skip-link and nav
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // At least one interactive element should be focused (search, card, or filter)
    const focusedTag = await page.evaluate(() => document.activeElement?.tagName ?? '');
    expect(['A', 'BUTTON', 'INPUT', 'SELECT']).toContain(focusedTag);
  });
});

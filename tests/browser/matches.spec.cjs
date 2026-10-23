const { test, expect } = require('@playwright/test');
const fixture = require('../../data/matches.json');
const endpoint = 'https://raw.githubusercontent.com/Interlabs22/test-app/main/data/matches.json';
const cards = (page) => page.getByTestId(/^match-/);
const respond = (route, json = fixture) => route.fulfill({ json });

test('real HTTP data, independent favorites, filters, search, and timer reset', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(cards(page)).toHaveCount(8);
  await expect(page.getByTestId('match-m2')).toContainText('0 : 0');
  await expect(page.getByTestId('match-m7')).toContainText('Дата и время уточняются');
  await expect(page.getByTestId('match-m1')).toContainText('18:00');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Обновить', exact: true })).toBeFocused();
  await expect(page.getByRole('tab', { name: 'Все', exact: true })).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('button', { name: 'Добавить в избранное', exact: true })).toHaveCount(8);
  await page.getByTestId('match-m1').getByRole('button').click();
  await page.getByTestId('match-m2').getByRole('button').click();
  await expect(page.getByRole('button', { name: 'Убрать из избранного' })).toHaveCount(2);
  await page.getByTestId('match-m1').getByRole('button').click();
  await expect(page.getByTestId('match-m2').getByRole('button')).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('tab', { name: 'Предстоящие', exact: true }).click();
  await expect(page.getByRole('tab', { name: 'Предстоящие', exact: true })).toHaveAttribute('aria-selected', 'true');
  await expect(cards(page)).toHaveCount(4);
  await expect(page.getByTestId('match-m7')).toBeVisible();
  await page.getByRole('tab', { name: 'Завершённые', exact: true }).click();
  await expect(cards(page)).toHaveCount(3);
  await expect(page.getByTestId('match-m2').getByRole('button')).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('tab', { name: 'Все', exact: true }).click();
  const search = page.getByRole('textbox', { name: 'Поиск по названию клуба' });
  await search.fill('  СПАРТАК ');
  await expect(cards(page)).toHaveCount(1);
  await search.fill('несуществующий клуб');
  await expect(page.getByText('Матчи не найдены', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Сбросить фильтры' }).click();
  await expect(cards(page)).toHaveCount(8);
  await expect(page.getByText(/^Обновлено [2-9]\d* сек назад$/)).toBeVisible({ timeout: 12000 });
  await page.getByRole('button', { name: 'Обновить', exact: true }).click();
  await expect(page.getByText('Обновлено 0 сек назад', { exact: true })).toBeVisible();
  await expect(page.getByText('Обновлено 2 сек назад', { exact: true })).toBeVisible();
  await expect(page.getByTestId('match-m2').getByRole('button')).toHaveAttribute('aria-pressed', 'true');
  expect(errors).toEqual([]);
});

test('loading, failed first load, then successful retry', async ({ page }) => {
  let fail = true;
  let release;
  const gate = new Promise((resolve) => { release = resolve; });
  await page.route(endpoint, async (route) => {
    if (fail) {
      await gate;
      return route.fulfill({ status: 503, body: 'Unavailable' });
    }
    return respond(route);
  });
  await page.goto('/');
  await expect(page.getByText('Загружаем матчи', { exact: true })).toBeVisible();
  release();
  await expect(page.getByRole('alert')).toContainText('Матчи недоступны');
  await expect(page.getByText(/^Обновлено/)).toHaveCount(0);
  fail = false;
  await page.getByRole('button', { name: 'Повторить', exact: true }).click();
  await expect(cards(page)).toHaveCount(8);
  await expect(page.getByRole('alert')).toHaveCount(0);
});

test('empty server response', async ({ page }) => {
  await page.route(endpoint, (route) => respond(route, { round: 12, matches: [] }));
  await page.goto('/');
  await expect(page.getByText('Матчей пока нет', { exact: true })).toBeVisible();
  await expect(cards(page)).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Обновить', exact: true })).toBeEnabled();
});

test('refresh error preserves matches, favorites and last success time', async ({ page }) => {
  let fail = false;
  await page.route(endpoint, (route) => fail ? route.abort() : respond(route));
  await page.goto('/');
  await expect(cards(page)).toHaveCount(8);
  await page.getByTestId('match-m1').getByRole('button').click();
  await expect(page.getByText('Обновлено 2 сек назад', { exact: true })).toBeVisible();
  fail = true;
  await page.getByRole('button', { name: 'Обновить', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Показаны данные последней успешной загрузки');
  await expect(cards(page)).toHaveCount(8);
  await expect(page.getByTestId('match-m1').getByRole('button')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByText('Обновлено 0 сек назад', { exact: true })).toHaveCount(0);
});

test('invalid payload is an error, never a fake empty schedule', async ({ page }) => {
  await page.route(endpoint, (route) => respond(route, { round: 12, matches: [{ id: 'broken' }] }));
  await page.goto('/');
  await expect(page.getByRole('alert')).toContainText('Матчи недоступны');
  await expect(page.getByText('Матчей пока нет', { exact: true })).toHaveCount(0);
});

test('responsive layout and long club names at phone and desktop widths', async ({ page }) => {
  await page.route(endpoint, (route) => respond(route));
  for (const width of [320, 390, 678, 1280]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/');
    await expect(cards(page)).toHaveCount(8);
    await page.getByTestId('match-m5').scrollIntoViewIfNeeded();
    const card = await page.getByTestId('match-m5').boundingBox();
    expect(card.x).toBeGreaterThanOrEqual(0);
    expect(card.x + card.width).toBeLessThanOrEqual(width);
    const overflow = await page.evaluate(() => [...document.querySelectorAll('[data-testid^="match-"]')]
      .some((element) => element.scrollWidth > element.clientWidth + 1));
    expect(overflow).toBe(false);
  }
});

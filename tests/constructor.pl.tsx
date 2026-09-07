import path from 'path';
import { expect, test, type Locator, type Page } from '@playwright/test';

const baseURL = 'http://127.0.0.1:4173';
const apiURL = 'http://127.0.0.1:4174/api';
const harPath = path.resolve(__dirname, 'hars/backend.har');

const mockBun = {
  id: 'mock-bun-id',
  name: 'Тестовая булка'
};

const mockMain = {
  id: 'mock-main-id',
  name: 'Тестовая биокотлета'
};

const mockOrderNumber = 654321;

const getIngredientCard = (page: Page, name: string): Locator =>
  page
    .getByRole('listitem')
    .filter({ hasText: name })
    .filter({ has: page.getByRole('button', { name: 'Добавить' }) })
    .first();

const getConstructor = (page: Page): Locator =>
  page.locator('section').filter({
    has: page.getByRole('button', { name: 'Оформить заказ' })
  });

const openConstructor = async (page: Page) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'Соберите бургер' })
  ).toBeVisible();
  await expect(getIngredientCard(page, mockBun.name)).toBeVisible();
  await expect(getIngredientCard(page, mockMain.name)).toBeVisible();
};

test.describe('Конструктор бургера', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR(harPath, {
      url: `${apiURL}/**`,
      notFound: 'abort',
      update: false
    });
  });

  test('добавляет булку и начинку из списка в конструктор', async ({
    page
  }) => {
    await openConstructor(page);

    await getIngredientCard(page, mockBun.name)
      .getByRole('button', { name: 'Добавить' })
      .click();
    await getIngredientCard(page, mockMain.name)
      .getByRole('button', { name: 'Добавить' })
      .click();

    const constructor = getConstructor(page);
    await expect(
      constructor.getByText(`${mockBun.name} (верх)`, { exact: true })
    ).toBeVisible();
    await expect(
      constructor.getByText(`${mockBun.name} (низ)`, { exact: true })
    ).toBeVisible();
    await expect(
      constructor.getByText(mockMain.name, { exact: true })
    ).toBeVisible();
  });

  test('открывает модалку выбранного ингредиента и закрывает её крестиком', async ({
    page
  }) => {
    await openConstructor(page);

    await getIngredientCard(page, mockBun.name).getByRole('link').click();

    const dialog = page.getByRole('dialog');
    await expect(page).toHaveURL(`${baseURL}/ingredients/${mockBun.id}`);
    await expect(
      dialog.getByRole('heading', { name: 'Детали ингредиента' })
    ).toBeVisible();
    await expect(
      dialog.getByRole('heading', { name: mockBun.name, exact: true })
    ).toBeVisible();
    await expect(dialog.getByText('420', { exact: true })).toBeVisible();
    await expect(dialog.getByText('80', { exact: true })).toBeVisible();
    await expect(dialog.getByText('24', { exact: true })).toBeVisible();
    await expect(dialog.getByText('53', { exact: true })).toBeVisible();

    await dialog.getByRole('button', { name: 'Закрыть' }).click();

    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(page).toHaveURL(`${baseURL}/`);
  });

  test('закрывает модалку ингредиента по клику на оверлей', async ({
    page
  }) => {
    await openConstructor(page);

    await getIngredientCard(page, mockMain.name).getByRole('link').click();
    await expect(page.getByRole('dialog')).toBeVisible();

    await page
      .locator('#modals > div:not([role="dialog"])')
      .click({ position: { x: 5, y: 5 } });

    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(page).toHaveURL(`${baseURL}/`);
  });

  test('создаёт заказ, показывает его номер и очищает конструктор', async ({
    context,
    page
  }) => {
    await context.addCookies([
      {
        name: 'accessToken',
        value: 'Bearer%20mock-access-token',
        url: baseURL
      }
    ]);
    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'mock-refresh-token');
    });

    await openConstructor(page);
    await expect(
      page.getByText('Тестовый пользователь', { exact: true })
    ).toBeVisible();

    await getIngredientCard(page, mockBun.name)
      .getByRole('button', { name: 'Добавить' })
      .click();
    await getIngredientCard(page, mockMain.name)
      .getByRole('button', { name: 'Добавить' })
      .click();

    const orderRequestPromise = page.waitForRequest(
      (request) =>
        request.url() === `${apiURL}/orders` && request.method() === 'POST'
    );

    await getConstructor(page)
      .getByRole('button', { name: 'Оформить заказ' })
      .click();

    const orderRequest = await orderRequestPromise;
    expect(orderRequest.postDataJSON()).toEqual({
      ingredients: [mockBun.id, mockMain.id, mockBun.id]
    });
    expect(orderRequest.headers().authorization).toBe(
      'Bearer mock-access-token'
    );

    const dialog = page.getByRole('dialog');
    await expect(
      dialog.getByRole('heading', {
        name: String(mockOrderNumber),
        exact: true
      })
    ).toBeVisible();

    const constructor = getConstructor(page);
    await expect(
      constructor.getByText('Выберите булки', { exact: true })
    ).toHaveCount(2);
    await expect(
      constructor.getByText('Выберите начинку', { exact: true })
    ).toBeVisible();

    await dialog.getByRole('button', { name: 'Закрыть' }).click();
    await expect(page.getByRole('dialog')).toHaveCount(0);
  });
});

import { TConstructorIngredient, TIngredient } from '@utils-types';

const image =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

export const mockBun: TIngredient = {
  _id: 'mock-bun-id',
  name: 'Тестовая булка',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image,
  image_large: image,
  image_mobile: image
};

export const mockMain: TIngredient = {
  _id: 'mock-main-id',
  name: 'Тестовая биокотлета',
  type: 'main',
  proteins: 20,
  fat: 15,
  carbohydrates: 10,
  calories: 250,
  price: 424,
  image,
  image_large: image,
  image_mobile: image
};

export const mockSecondMain: TIngredient = {
  ...mockMain,
  _id: 'mock-second-main-id',
  name: 'Тестовое филе'
};

export const mockSauce: TIngredient = {
  ...mockMain,
  _id: 'mock-sauce-id',
  name: 'Тестовый соус',
  type: 'sauce'
};

export const withId = (
  ingredient: TIngredient,
  id: string
): TConstructorIngredient => ({
  ...ingredient,
  id
});

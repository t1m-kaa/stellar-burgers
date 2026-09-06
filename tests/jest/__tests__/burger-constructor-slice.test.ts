import { describe, expect, test } from '@jest/globals';
import {
  addIngredient,
  burgerConstructorReducer,
  clearConstructor,
  moveIngredient,
  removeIngredient
} from '../../../src/services/slices/burger-constructor-slice';
import {
  mockBun,
  mockMain,
  mockSauce,
  mockSecondMain,
  withId
} from '../fixtures/ingredients';

describe('Редьюсер конструктора бургера', () => {
  const initialState = {
    bun: null,
    ingredients: []
  };

  test('возвращает начальное состояние для неизвестного экшена', () => {
    expect(burgerConstructorReducer(undefined, { type: 'UNKNOWN' })).toEqual(
      initialState
    );
  });

  test('добавляет начинку с уникальным идентификатором', () => {
    const action = addIngredient(mockMain);
    const secondAction = addIngredient(mockMain);
    const state = burgerConstructorReducer(undefined, action);

    expect(action.payload).toEqual({
      ...mockMain,
      id: expect.any(String)
    });
    expect(action.payload.id).not.toBe(secondAction.payload.id);
    expect(state).toEqual({
      bun: null,
      ingredients: [action.payload]
    });
  });

  test('добавляет булку в конструктор', () => {
    const action = addIngredient(mockBun);

    expect(burgerConstructorReducer(undefined, action)).toEqual({
      bun: action.payload,
      ingredients: []
    });
  });

  test('заменяет выбранную булку и сохраняет начинки', () => {
    const existingMain = withId(mockMain, 'existing-main-id');
    const previousBun = {
      ...mockBun,
      _id: 'previous-bun-id',
      name: 'Предыдущая булка'
    };
    const action = addIngredient(mockBun);

    expect(
      burgerConstructorReducer(
        { bun: previousBun, ingredients: [existingMain] },
        action
      )
    ).toEqual({
      bun: action.payload,
      ingredients: [existingMain]
    });
  });

  test('удаляет начинку по идентификатору конструктора', () => {
    const firstIngredient = withId(mockMain, 'first-id');
    const secondIngredient = withId(mockSauce, 'second-id');
    const thirdIngredient = withId(mockSecondMain, 'third-id');

    expect(
      burgerConstructorReducer(
        {
          bun: mockBun,
          ingredients: [firstIngredient, secondIngredient, thirdIngredient]
        },
        removeIngredient(secondIngredient.id)
      )
    ).toEqual({
      bun: mockBun,
      ingredients: [firstIngredient, thirdIngredient]
    });
  });

  test('перемещает начинку на выбранную позицию', () => {
    const firstIngredient = withId(mockMain, 'first-id');
    const secondIngredient = withId(mockSauce, 'second-id');
    const thirdIngredient = withId(mockSecondMain, 'third-id');

    expect(
      burgerConstructorReducer(
        {
          bun: mockBun,
          ingredients: [firstIngredient, secondIngredient, thirdIngredient]
        },
        moveIngredient({ fromIndex: 0, toIndex: 2 })
      )
    ).toEqual({
      bun: mockBun,
      ingredients: [secondIngredient, thirdIngredient, firstIngredient]
    });
  });

  test('очищает выбранную булку и начинки', () => {
    expect(
      burgerConstructorReducer(
        {
          bun: mockBun,
          ingredients: [withId(mockMain, 'main-id')]
        },
        clearConstructor()
      )
    ).toEqual(initialState);
  });
});

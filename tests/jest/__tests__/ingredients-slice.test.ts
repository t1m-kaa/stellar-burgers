import { describe, expect, test } from '@jest/globals';
import {
  getIngredientsThunk,
  ingredientsReducer
} from '../../../src/services/slices/ingredients-slice';
import { mockBun, mockMain } from '../fixtures/ingredients';

describe('Редьюсер ингредиентов', () => {
  const initialState = {
    ingredients: [],
    isLoading: false,
    error: null
  };

  test('возвращает начальное состояние для неизвестного экшена', () => {
    expect(ingredientsReducer(undefined, { type: 'UNKNOWN' })).toEqual(
      initialState
    );
  });

  test('обрабатывает начало загрузки ингредиентов', () => {
    const state = {
      ingredients: [mockBun],
      isLoading: false,
      error: 'Предыдущая ошибка'
    };

    expect(
      ingredientsReducer(
        state,
        getIngredientsThunk.pending('request-id', undefined)
      )
    ).toEqual({
      ingredients: [mockBun],
      isLoading: true,
      error: null
    });
  });

  test('сохраняет ингредиенты после успешной загрузки', () => {
    const state = {
      ...initialState,
      isLoading: true
    };

    expect(
      ingredientsReducer(
        state,
        getIngredientsThunk.fulfilled(
          [mockBun, mockMain],
          'request-id',
          undefined
        )
      )
    ).toEqual({
      ingredients: [mockBun, mockMain],
      isLoading: false,
      error: null
    });
  });

  test('сохраняет текст ошибки при неудачной загрузке', () => {
    const state = {
      ingredients: [mockBun],
      isLoading: true,
      error: null
    };

    expect(
      ingredientsReducer(
        state,
        getIngredientsThunk.rejected(
          new Error('Ошибка сети'),
          'request-id',
          undefined
        )
      )
    ).toEqual({
      ingredients: [mockBun],
      isLoading: false,
      error: 'Ошибка сети'
    });
  });

  test('использует запасной текст, если сообщение ошибки отсутствует', () => {
    const rejectedWithoutMessage = {
      type: getIngredientsThunk.rejected.type,
      error: {}
    };

    expect(ingredientsReducer(initialState, rejectedWithoutMessage)).toEqual({
      ingredients: [],
      isLoading: false,
      error: 'Не удалось загрузить ингредиенты'
    });
  });
});

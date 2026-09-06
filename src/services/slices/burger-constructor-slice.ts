import {
  createSelector,
  createSlice,
  nanoid,
  PayloadAction
} from '@reduxjs/toolkit';

import {
  TConstructorIngredient,
  TConstructorItems,
  TIngredient
} from '@utils-types';

type TMoveIngredientPayload = {
  fromIndex: number;
  toIndex: number;
};

const initialState: TConstructorItems = {
  bun: null,
  ingredients: []
};

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: {
          ...ingredient,
          id: nanoid()
        }
      })
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.id !== action.payload
      );
    },
    moveIngredient: (state, action: PayloadAction<TMoveIngredientPayload>) => {
      const { fromIndex, toIndex } = action.payload;

      if (
        fromIndex === toIndex ||
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= state.ingredients.length ||
        toIndex >= state.ingredients.length
      ) {
        return;
      }

      const [movedIngredient] = state.ingredients.splice(fromIndex, 1);
      state.ingredients.splice(toIndex, 0, movedIngredient);
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  },
  selectors: {
    selectConstructorItems: (state) => state,
    selectConstructorBun: (state) => state.bun,
    selectConstructorIngredients: (state) => state.ingredients
  }
});

export const burgerConstructorReducer = burgerConstructorSlice.reducer;

export const {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} = burgerConstructorSlice.actions;

export const {
  selectConstructorItems,
  selectConstructorBun,
  selectConstructorIngredients
} = burgerConstructorSlice.selectors;

export const selectConstructorPrice = createSelector(
  [selectConstructorItems],
  ({ bun, ingredients }) =>
    (bun?.price ?? 0) * 2 +
    ingredients.reduce((sum, ingredient) => sum + ingredient.price, 0)
);

export const selectIngredientCounters = createSelector(
  [selectConstructorItems],
  ({ bun, ingredients }) => {
    const counters: Record<string, number> = {};

    ingredients.forEach((ingredient) => {
      counters[ingredient._id] = (counters[ingredient._id] ?? 0) + 1;
    });

    if (bun) {
      counters[bun._id] = 2;
    }

    return counters;
  }
);

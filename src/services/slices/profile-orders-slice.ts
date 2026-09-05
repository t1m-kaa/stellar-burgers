import { getOrdersApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

type TProfileOrdersState = {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
};

const initialState: TProfileOrdersState = {
  orders: [],
  isLoading: false,
  error: null
};

export const getProfileOrdersThunk = createAsyncThunk<TOrder[], void>(
  'profileOrders/getOrders',
  async () => {
    const orders = await getOrdersApi();
    return orders;
  }
);

const profileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {},
  selectors: {
    selectProfileOrders: (state) => state.orders,
    selectProfileOrdersLoading: (state) => state.isLoading,
    selectProfileOrdersError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProfileOrdersThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProfileOrdersThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(getProfileOrdersThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message ?? 'Не удалось загрузить историю заказов';
      });
  }
});

export const profileOrdersReducer = profileOrdersSlice.reducer;

export const {
  selectProfileOrders,
  selectProfileOrdersLoading,
  selectProfileOrdersError
} = profileOrdersSlice.selectors;

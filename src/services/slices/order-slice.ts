import { getOrderByNumberApi, orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TCreatedOrder, TOrder } from '@utils-types';

type TOrderState = {
  orderRequest: boolean;
  orderData: TCreatedOrder | null;
  orderDetailsRequest: boolean;
  orderDetails: TOrder | null;
  orderDetailsError: string | null;
  error: string | null;
};

const initialState: TOrderState = {
  orderRequest: false,
  orderData: null,
  orderDetailsRequest: false,
  orderDetails: null,
  orderDetailsError: null,
  error: null
};

export const createOrderThunk = createAsyncThunk<TCreatedOrder, string[]>(
  'order/create',
  async (ingredientIds) => {
    const response = await orderBurgerApi(ingredientIds);
    return response.order;
  }
);

export const getOrderByNumberThunk = createAsyncThunk<TOrder, number>(
  'order/getByNumber',
  async (number) => {
    const response = await getOrderByNumberApi(number);
    const order = response.orders[0];

    if (!order) {
      throw new Error('Заказ не найден');
    }

    return order;
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderModalData: (state) => {
      state.orderData = null;
      state.error = null;
    },
    clearOrderDetails: (state) => {
      state.orderDetails = null;
      state.orderDetailsError = null;
    }
  },
  selectors: {
    selectOrderModalData: (state) => state.orderData,
    selectOrderRequest: (state) => state.orderRequest,
    selectOrderError: (state) => state.error,
    selectOrderDetails: (state) => state.orderDetails,
    selectOrderDetailsRequest: (state) => state.orderDetailsRequest,
    selectOrderDetailsError: (state) => state.orderDetailsError
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrderThunk.pending, (state) => {
        state.orderRequest = true;
        state.orderData = null;
        state.error = null;
      })
      .addCase(createOrderThunk.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderData = action.payload;
      })
      .addCase(createOrderThunk.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message ?? 'Не удалось создать заказ';
      })
      .addCase(getOrderByNumberThunk.pending, (state) => {
        state.orderDetailsRequest = true;
        state.orderDetails = null;
        state.orderDetailsError = null;
      })
      .addCase(getOrderByNumberThunk.fulfilled, (state, action) => {
        state.orderDetailsRequest = false;
        state.orderDetails = action.payload;
      })
      .addCase(getOrderByNumberThunk.rejected, (state, action) => {
        state.orderDetailsRequest = false;
        state.orderDetailsError =
          action.error.message ?? 'Не удалось загрузить заказ';
      });
  }
});

export const {
  selectOrderModalData,
  selectOrderRequest,
  selectOrderError,
  selectOrderDetails,
  selectOrderDetailsRequest,
  selectOrderDetailsError
} = orderSlice.selectors;

export const orderReducer = orderSlice.reducer;
export const { clearOrderModalData, clearOrderDetails } = orderSlice.actions;

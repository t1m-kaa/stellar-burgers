import { getFeedsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder, TOrdersData } from '@utils-types';

type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
};

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null
};

export const getFeedThunk = createAsyncThunk<TOrdersData, void>(
  'feed/getFeed',
  async () => {
    const { orders, total, totalToday } = await getFeedsApi();
    return {
      orders,
      total,
      totalToday
    };
  }
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  selectors: {
    selectFeed: (state) => state,
    selectFeedTotal: (state) => state.total,
    selectFeedTotalToday: (state) => state.totalToday,
    selectFeedError: (state) => state.error,
    selectFeedOrders: (state) => state.orders,
    selectFeedIsLoading: (state) => state.isLoading
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeedThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFeedThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(getFeedThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Не удалось загрузить ленту';
      });
  }
});

export const feedReducer = feedSlice.reducer;

export const {
  selectFeed,
  selectFeedTotal,
  selectFeedTotalToday,
  selectFeedError,
  selectFeedOrders,
  selectFeedIsLoading
} = feedSlice.selectors;

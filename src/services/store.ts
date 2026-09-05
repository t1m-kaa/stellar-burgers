import { combineReducers, configureStore } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { userReducer } from './slices/user-slice';
import { ingredientsReducer } from './slices/ingredients-slice';
import { burgerConstructorReducer } from './slices/burger-constructor-slice';
import { orderReducer } from './slices/order-slice';
import { feedReducer } from './slices/feed-slice';
import { profileOrdersReducer } from './slices/profile-orders-slice';

const rootReducer = combineReducers({
  burgerConstructor: burgerConstructorReducer,
  ingredients: ingredientsReducer,
  user: userReducer,
  order: orderReducer,
  feed: feedReducer,
  profileOrders: profileOrdersReducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;

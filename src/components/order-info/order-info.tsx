import { FC, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectIngredients,
  selectIngredientsError,
  selectIngredientsLoading
} from '../../services/slices/ingredients-slice';
import {
  clearOrderDetails,
  getOrderByNumberThunk,
  selectOrderDetails,
  selectOrderDetailsError,
  selectOrderDetailsRequest
} from '../../services/slices/order-slice';

export const OrderInfo: FC = () => {
  const dispatch = useDispatch();
  const { number, id } = useParams<{ number?: string; id?: string }>();
  const orderNumber = Number(number ?? id);
  const isValidOrderNumber = Number.isInteger(orderNumber) && orderNumber > 0;

  const orderData = useSelector(selectOrderDetails);
  const isOrderLoading = useSelector(selectOrderDetailsRequest);
  const orderError = useSelector(selectOrderDetailsError);

  const ingredients = useSelector(selectIngredients);
  const isIngredientsLoading = useSelector(selectIngredientsLoading);
  const ingredientsError = useSelector(selectIngredientsError);

  useEffect(() => {
    if (!isValidOrderNumber) {
      dispatch(clearOrderDetails());
      return;
    }

    dispatch(getOrderByNumberThunk(orderNumber));

    return () => {
      dispatch(clearOrderDetails());
    };
  }, [dispatch, isValidOrderNumber, orderNumber]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!isValidOrderNumber) {
    return <p className='text text_type_main-medium'>Неверный номер заказа</p>;
  }

  if (orderError) {
    return <p className='text text_type_main-medium'>{orderError}</p>;
  }

  if (ingredientsError) {
    return <p className='text text_type_main-medium'>{ingredientsError}</p>;
  }

  if (
    isOrderLoading ||
    isIngredientsLoading ||
    !orderData ||
    (!ingredients.length && !ingredientsError) ||
    !orderInfo
  ) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};

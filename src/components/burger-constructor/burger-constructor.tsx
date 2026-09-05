import { FC } from 'react';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  clearConstructor,
  selectConstructorItems,
  selectConstructorPrice
} from '../../services/slices/burger-constructor-slice';
import {
  clearOrderModalData,
  createOrderThunk,
  selectOrderError,
  selectOrderModalData,
  selectOrderRequest
} from '../../services/slices/order-slice';
import { getFeedThunk } from '../../services/slices/feed-slice';
import { getProfileOrdersThunk } from '../../services/slices/profile-orders-slice';
import { selectUser } from '../../services/slices/user-slice';
import { useLocation, useNavigate } from 'react-router-dom';
import { Modal } from '../modal';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const user = useSelector(selectUser);
  const constructorItems = useSelector(selectConstructorItems);
  const price = useSelector(selectConstructorPrice);

  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(selectOrderModalData);
  const orderError = useSelector(selectOrderError);

  const onOrderClick = async () => {
    const { bun, ingredients } = constructorItems;

    if (orderRequest) {
      return;
    }

    if (!user) {
      navigate('/login', {
        state: { from: location }
      });
      return;
    }

    if (!bun) {
      return;
    }

    const ingredientIds = [
      bun._id,
      ...ingredients.map((ingredient) => ingredient._id),
      bun._id
    ];

    try {
      await dispatch(createOrderThunk(ingredientIds)).unwrap();
      dispatch(clearConstructor());
      dispatch(getFeedThunk());
      dispatch(getProfileOrdersThunk());
    } catch {
      // Текст ошибки сохраняется в orderSlice и показывается ниже.
    }
  };

  const closeOrderModal = () => {
    dispatch(clearOrderModalData());
  };

  return (
    <>
      <BurgerConstructorUI
        price={price}
        orderRequest={orderRequest}
        constructorItems={constructorItems}
        orderModalData={orderModalData}
        onOrderClick={onOrderClick}
        closeOrderModal={closeOrderModal}
      />
      {orderError && (
        <Modal title='Не удалось оформить заказ' onClose={closeOrderModal}>
          <p className='text text_type_main-default'>{orderError}</p>
        </Modal>
      )}
    </>
  );
};

import { FC } from 'react';
import { OrderStatusProps } from './type';
import { OrderStatusUI } from '@ui';

const statusText: { [key: string]: string } = {
  pending: 'Готовится',
  created: 'Создан',
  done: 'Выполнен',
  ready: 'Выполнен',
  cancelled: 'Отменён',
  canceled: 'Отменён'
};

export const OrderStatus: FC<OrderStatusProps> = ({ status }) => {
  const textStyle =
    status === 'done' || status === 'ready'
      ? '#00CCCC'
      : status === 'cancelled' || status === 'canceled'
        ? '#E52B1A'
        : '#F2F2F3';

  return (
    <OrderStatusUI textStyle={textStyle} text={statusText[status] ?? status} />
  );
};

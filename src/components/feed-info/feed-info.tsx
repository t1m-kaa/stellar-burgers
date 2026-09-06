import { FC } from 'react';

import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { useSelector } from '../../services/store';
import { selectFeed, selectFeedOrders } from '../../services/slices/feed-slice';

const getOrders = (orders: TOrder[], statuses: string[]): number[] =>
  orders
    .filter((item) => statuses.includes(item.status))
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  const orders: TOrder[] = useSelector(selectFeedOrders);
  const feed = useSelector(selectFeed);

  const readyOrders = getOrders(orders, ['done', 'ready']);

  const pendingOrders = getOrders(orders, ['created', 'pending']);

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};

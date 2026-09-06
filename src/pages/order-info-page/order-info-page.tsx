import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { OrderInfo } from '@components';

import { formatOrderNumber } from '../../utils/format-order-number';
import styles from '../detail-page.module.css';

export const OrderInfoPage: FC = () => {
  const { number } = useParams();

  return (
    <main className={styles.detailPageWrap}>
      <h1
        className={`${styles.detailHeader} text text_type_digits-default mb-5`}
      >
        {formatOrderNumber(number)}
      </h1>
      <OrderInfo />
    </main>
  );
};

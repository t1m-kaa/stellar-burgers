import { FC } from 'react';
import { IngredientDetails } from '@components';

import styles from '../detail-page.module.css';

export const IngredientDetailsPage: FC = () => (
  <main className={styles.detailPageWrap}>
    <h1 className={`${styles.detailHeader} text text_type_main-large mb-5`}>
      Детали ингредиента
    </h1>
    <IngredientDetails />
  </main>
);

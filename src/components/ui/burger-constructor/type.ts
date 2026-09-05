import { TConstructorItems, TCreatedOrder } from '@utils-types';

export type BurgerConstructorUIProps = {
  constructorItems: TConstructorItems;
  orderRequest: boolean;
  price: number;
  orderModalData: TCreatedOrder | null;
  onOrderClick: () => void;
  closeOrderModal: () => void;
};

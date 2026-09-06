import { FC } from 'react';
import { useParams } from 'react-router-dom';

import { formatOrderNumber } from '../../utils/format-order-number';
import { Modal } from '../modal';
import { OrderInfo } from '../order-info';

type TOrderInfoModalProps = {
  onClose: () => void;
};

export const OrderInfoModal: FC<TOrderInfoModalProps> = ({ onClose }) => {
  const { number } = useParams();

  return (
    <Modal title={formatOrderNumber(number)} onClose={onClose}>
      <OrderInfo />
    </Modal>
  );
};

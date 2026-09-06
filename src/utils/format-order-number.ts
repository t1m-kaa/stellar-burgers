const ORDER_NUMBER_LENGTH = 6;

export const formatOrderNumber = (number?: string) =>
  number ? `#${number.padStart(ORDER_NUMBER_LENGTH, '0')}` : '';

export const ORDER_STATUS = {
  PREPARING: 'preparing',
  ON_THE_WAY: 'on_the_way',
  DELIVERED: 'delivered',
  DONE: 'done',
  CANCELLED: 'cancelled',
} as const;

export type OrderStatusType = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

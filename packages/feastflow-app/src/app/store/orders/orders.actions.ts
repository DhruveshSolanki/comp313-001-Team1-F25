import { OrderItem } from "./orders.state";

export class OrdersAction {
  static readonly type = '[Orders] Add item';
  constructor(readonly payload: string) { }
}

export class GetOrdersItems {
  static readonly type = '[Orders] Get items';
}

export class AddOrdersItem {
  static readonly type = '[Orders] Add item';
  constructor(readonly item: OrderItem) { }
}

export class EditOrdersItem {
  static readonly type = '[Orders] Edit item';
  constructor(readonly item: OrderItem) { }
}

export class DeleteOrdersItem {
  static readonly type = '[Orders] Delete item';
  constructor(readonly orderId: number) { }
}

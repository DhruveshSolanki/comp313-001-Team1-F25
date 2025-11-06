import { CartItem } from "./cart.state";

export class CartAction {
  static readonly type = '[Cart] Add item';
  constructor(readonly payload: string) { }
}

export class GetCartItems {
  static readonly type = '[Cart] Get items';
}

export class SetCartItems {
  static readonly type = '[Cart] Set items';
  constructor(readonly items: CartItem[]) { }
}

export class AddCartItem {
  static readonly type = '[Cart] Add item';
  constructor(readonly item: CartItem) { }
}

export class EditCartItem {
  static readonly type = '[Cart] Edit item';
  constructor(readonly item: CartItem) { }
}

export class DeleteCartItem {
  static readonly type = '[Cart] Delete item';
  constructor(readonly cartItemId: number) { }
}

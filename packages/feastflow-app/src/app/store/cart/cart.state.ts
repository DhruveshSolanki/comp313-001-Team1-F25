import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { AddCartItem, DeleteCartItem, EditCartItem, GetCartItems, SetCartItems } from './cart.actions';
import { CommonHttpRequestService } from 'src/app/services/common-http-request.service';
import { CartApiService } from '../../services/api/cart-api.service';
import { tap } from 'rxjs/operators';

export interface CartItem {
  itemId: number; // display index
  cartItemId?: string; // backend cart item id
  menuItemId?: string; // backend menu item id
  itemName: string;
  price: number;
  quantity: number;
  note?: string;
}

export interface CartStateModel {
  items: CartItem[];
}

@State<CartStateModel>({
  name: 'cart',
  defaults: {
    items: []
  }
})
@Injectable()
export class CartState {

  constructor(private commonService: CommonHttpRequestService, private cartApi: CartApiService) { }

  @Selector()
  static getState(state: CartStateModel) {
    return state.items;
  }

  @Action(GetCartItems)
  getCartItems(ctx: StateContext<CartStateModel>) {
    return this.cartApi.getMyCart().pipe(
      tap(cart => {
        const mapped = (cart.items || []).map((i: any, idx: number) => ({
          itemId: idx + 1,
          cartItemId: i.id,
          menuItemId: i.menuItemId,
          itemName: i.name || i.menuItemId,
          price: i.price ?? 0,
          quantity: i.quantity ?? 1,
          note: i.note
        }));
        ctx.patchState({ items: mapped });
      })
    );
  }

  @Action(SetCartItems)
  setCartItems(ctx: StateContext<CartStateModel>, { items }: SetCartItems) {
    ctx.patchState({ items });
  }

  @Action(AddCartItem)
  addCartItem(ctx: StateContext<CartStateModel>, { item }: AddCartItem) {
    const state = ctx.getState();
    ctx.patchState({ items: [...state.items, item] });
  }

  @Action(EditCartItem)
  editCartItem(ctx: StateContext<CartStateModel>, { item }: EditCartItem) {
    const state = ctx.getState();
    const items = state.items.map(i => i.itemId === item.itemId ? item : i);
    ctx.patchState({ items });    
  }

  @Action(DeleteCartItem)
  deleteCartItem(ctx: StateContext<CartStateModel>, { cartItemId }: DeleteCartItem) {
    const state = ctx.getState();
    const filteredItems = state.items.filter((item) => item?.itemId  !== cartItemId);
    ctx.patchState({ items: filteredItems });
  }
}

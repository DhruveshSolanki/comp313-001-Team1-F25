import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { AddCartItem, DeleteCartItem, EditCartItem, GetCartItems, SetCartItems } from './cart.actions';
import { CommonHttpRequestService } from 'src/app/services/common-http-request.service';
import { tap } from 'rxjs/operators';

export interface CartItem {
  itemId: number;
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

  constructor(private commonService: CommonHttpRequestService) { }

  @Selector()
  static getState(state: CartStateModel) {
    return state.items;
  }

  @Action(GetCartItems)
  getCartItems(ctx: StateContext<CartStateModel>) {
    return this.commonService.getDataFromAssets('restaurant-cart.json').pipe(
      tap((response: any) => {
        const cartItems = response.data || [];
        ctx.patchState({ items: cartItems });
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

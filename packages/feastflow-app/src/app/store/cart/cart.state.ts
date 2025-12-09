import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { AddCartItem, DeleteCartItem, EditCartItem, GetCartItems, SetCartItems } from './cart.actions';
import { CommonHttpRequestService } from 'src/app/services/common-http-request.service';
import { tap } from 'rxjs/operators';

export interface CartItem {
  // Backend cart item identifier (needed for PUT/DELETE)
  cartItemId?: string;
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
    return this.commonService.getMyCart().pipe(
      tap((response: any) => {
        const cartItems = (response?.cartItems || []).map((ci: any) => ({
          cartItemId: ci?.id ?? ci?._id ?? ci?.cartItemId ?? undefined,
          itemId: ci.menuItem?.itemId ?? ci.menuItem?.id ?? ci.menuItem,
          itemName: ci.menuItem?.itemName ?? '',
          price: ci.menuItem?.price ?? 0,
          quantity: ci.quantity ?? 1,
          note: ci.note ?? null,
        }));
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
    // Optimistic update
    ctx.patchState({ items: [...state.items, item] });
    // Backend add
    this.commonService.addCartItem({ menuItemId: String(item.itemId), quantity: item.quantity, note: item.note }).subscribe({
      next: () => this.getCartItems(ctx).subscribe(),
      error: (err) => console.error('Error adding cart item', err)
    });
  }

  @Action(EditCartItem)
  editCartItem(ctx: StateContext<CartStateModel>, { item }: EditCartItem) {
    const state = ctx.getState();
    const items = state.items.map(i => i.itemId === item.itemId ? item : i);
    ctx.patchState({ items });
    // Backend update: requires cartItemId and full payload shape
    const cartItemId = item.cartItemId ?? String(item.itemId);
    const payload = {
      cartItemId,
      menuItem: {
        itemId: String(item.itemId),
        itemName: item.itemName,
        price: item.price,
        // Optional fields if available in UI state; backend can ignore missing ones
      },
      quantity: item.quantity,
      note: item.note ?? ''
    };
    this.commonService.updateCartItem(String(cartItemId), payload).subscribe({
      next: () => this.getCartItems(ctx).subscribe(),
      error: (err) => console.error('Error updating cart item', err)
    });
  }

  @Action(DeleteCartItem)
  deleteCartItem(ctx: StateContext<CartStateModel>, { cartItemId }: DeleteCartItem) {
    const state = ctx.getState();
    const filteredItems = state.items.filter((item) => String(item?.cartItemId ?? item?.itemId) !== String(cartItemId));
    ctx.patchState({ items: filteredItems });
    this.commonService.deleteCartItem(String(cartItemId)).subscribe({
      next: () => this.getCartItems(ctx).subscribe(),
      error: (err) => console.error('Error deleting cart item', err)
    });
  }
}

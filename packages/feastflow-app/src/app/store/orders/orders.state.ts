import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { CommonHttpRequestService } from 'src/app/services/common-http-request.service';
import { tap } from 'rxjs/operators';
import { AddOrdersItem, DeleteOrdersItem, EditOrdersItem, GetOrdersItems } from './orders.actions';
import { OrdersApiService } from '../../services/api/orders-api.service';

export interface OrderItem {
  orderId: number;
  itemName: string;
  table: number;
  category: string;
  quantity: number;
  servedAt: string;
  status: string;
  note: string;
}

export interface OrdersStateModel {
  items: OrderItem[];
}

@State<OrdersStateModel>({
  name: 'orders',
  defaults: {
    items: []
  }
})
@Injectable()
export class OrdersState {

  constructor(private commonService: CommonHttpRequestService, private ordersApi: OrdersApiService) { }

  @Selector()
  static getState(state: OrdersStateModel) {
    return state?.items;
  }

  @Selector()
  static byCategory(state: OrdersStateModel) {
    return (category: string) => (state?.items ?? []).filter(i => i.category === category);
  }

  @Action(GetOrdersItems)
  getOrdersItems(ctx: StateContext<OrdersStateModel>) {
    return this.commonService.getDataFromAssets('restaurant-orders.json').pipe(
      tap((response: any) => {
        const ordersItems = response.orders || [];
        ctx.patchState({ items: ordersItems });
      })
    );
  }

  @Action(AddOrdersItem)
  addOrdersItem(ctx: StateContext<OrdersStateModel>, { item }: AddOrdersItem) {
    const state = ctx.getState();
    ctx.patchState({ items: [...state.items, item] });
  }

  @Action(EditOrdersItem)
  editOrdersItem(ctx: StateContext<OrdersStateModel>, { item }: EditOrdersItem) {
    const state = ctx.getState();
    const items = state.items.map(i => i.orderId === item.orderId ? item : i);
    ctx.patchState({ items });
  }

  @Action(DeleteOrdersItem)
  deleteOrdersItem(ctx: StateContext<OrdersStateModel>, { orderId }: DeleteOrdersItem) {
    const state = ctx.getState();
    const filteredItems = state.items.filter((item) => item?.orderId !== orderId);
    ctx.patchState({ items: filteredItems });
  }
}

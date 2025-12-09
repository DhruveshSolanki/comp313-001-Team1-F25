import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { CommonHttpRequestService } from 'src/app/services/common-http-request.service';
import { tap } from 'rxjs/operators';
import { AddOrdersItem, DeleteOrdersItem, EditOrdersItem, GetOrdersItems } from './orders.actions';

export interface OrderItem {
  // Backend order item identifier (needed for item-level updates)
  orderItemId?: string;
  orderId: number;
  itemName: string;
  table: number;
  category: string;
  quantity: number;
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

  constructor(private commonService: CommonHttpRequestService) { }

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
    // Switch from static assets to backend API while retaining the same coding pattern
    return this.commonService.getOrders().pipe(
      tap((response: any) => {
        // Map backend Order[] into UI OrderItem[] shape expected by staff view
        const orders = Array.isArray(response) ? response : (response?.orders || []);
        const items: OrderItem[] = [];
        orders.forEach((o: any) => {
          const orderId = o?.orderId ?? o?.id ?? o?._id ?? 0;
          const tableNumber = o?.table?.tableNumber ?? null;

          (o?.orderItems ?? []).forEach((oi: any) => {
            // Backend now passes enum in `itemStatus` (e.g., 'PENDING', 'IN_QUEUE')
            const rawStatus = String(oi?.itemStatus || '').toUpperCase();
            // Keep status as the exact enum string for consistency across the app
            const status = rawStatus || 'PENDING';
            // Derive category for grouping views based on enum
            const category = status === 'SERVED' ? 'Orders Served' : 'Orders in Progress';
            items.push({
              orderItemId: oi?.orderItemId ?? oi?.id ?? oi?._id ?? undefined,
              orderId,
              table: tableNumber,
              itemName: oi?.menuItem?.itemName ?? '',
              quantity: oi?.quantity ?? 0,
              category,
              status,
              note: oi?.note ?? ''
            });
          });
        });
        ctx.patchState({ items });
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
    // Persist status change to backend, then patch state
    const orderId = item.orderId;
    const itemId = item.orderItemId; // expect backend to provide unique orderItemId
    const newStatus = item.status;
    // If we don't have an itemId, just patch state locally
    if (!itemId) {
      const state = ctx.getState();
      const items = state.items.map(i => (i.orderId === orderId ? { ...i, ...item } : i));
      ctx.patchState({ items });
      return;
    }
    return this.commonService.updateOrderItemStatus(orderId, itemId, newStatus).pipe(
      tap(() => {
        const state = ctx.getState();
        const items = state.items.map(i => {
          const sameItem = (item.orderItemId && i.orderItemId && String(i.orderItemId) === String(item.orderItemId))
            || (!item.orderItemId && i.orderId === item.orderId);
          return sameItem ? { ...i, ...item } : i;
        });
        ctx.patchState({ items });
      })
    );
  }

  @Action(DeleteOrdersItem)
  deleteOrdersItem(ctx: StateContext<OrdersStateModel>, { orderId }: DeleteOrdersItem) {
    const state = ctx.getState();
    const filteredItems = state.items.filter((item) => item?.orderId !== orderId);
    ctx.patchState({ items: filteredItems });
  }
}

import { Injectable } from '@angular/core';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { AddMenuItem, DeleteMenuItem, EditMenuItem, GetMenuItems, MenuAction } from './menu.actions';
import { CommonHttpRequestService } from 'src/app/services/common-http-request.service';
import { tap } from 'rxjs/operators';

export interface MenuItem {
  itemId: string; // backend Mongo _id
  itemName: string;
  category: string;
  price: number;
  description?: string;
  allergens?: string[];
  ingredients?: string[];
}

export interface MenuStateModel {
  items: MenuItem[];
}

@State<MenuStateModel>({
  name: 'menu',
  defaults: {
    items: []
  }
})
@Injectable()
export class MenuState {

  constructor(private commonService: CommonHttpRequestService) { }

  @Selector()
  static getState(state: MenuStateModel) {
    return state.items;
  }

  @Selector()
  static byCategory(state: MenuStateModel) {
    return (category: string) => (state?.items ?? []).filter(i => i.category === category);
  }

  @Action(GetMenuItems)
  getMenuItems(ctx: StateContext<MenuStateModel>) {
    // Debug: trace menu fetch action firing
    console.debug('[MenuState] Dispatch GetMenuItems');
    return this.commonService.getRestaurantMenu().pipe(
      tap((response: any) => {
        // Debug: log raw response length & sample
        const menuItems = response || [];
        console.debug('[MenuState] Fetched menu items count:', menuItems.length, menuItems[0]);
        ctx.patchState({ items: menuItems });
      })
    );
  }

  @Action(AddMenuItem)
  addMenuItem(ctx: StateContext<MenuStateModel>, { item }: AddMenuItem) {
    this.commonService.addRestaurantMenu(item).subscribe({
      next: (response: any) => {
        if (response && response.success) {
          const state = ctx.getState();
          ctx.patchState({ items: [...state.items, item] });
          this.getMenuItems(ctx).subscribe(); // Refresh the menu items after adding
        }
      },
      error: (error) => {
        console.error('Error adding menu item:', error);
        // Handle error appropriately, e.g., show a notification
      }
    });
  }

  @Action(EditMenuItem)
  editMenuItem(ctx: StateContext<MenuStateModel>, { item }: EditMenuItem) {
    this.commonService.updateRestaurantMenu(item).subscribe({
      next: (response: any) => {
        if (response && response.success) {
          const state = ctx.getState();
          const items = state.items.map(i => i.itemId === item.itemId ? item : i);
          ctx.patchState({ items });
        }
      },
      error: (error) => {
        console.error('Error updating menu item:', error);
        // Handle error appropriately, e.g., show a notification
      }
    });
  }

  @Action(DeleteMenuItem)
  deleteMenuItem(ctx: StateContext<MenuStateModel>, { menuId }: DeleteMenuItem) {
    this.commonService.deleteRestaurantMenu(menuId).subscribe({
      next: (response: any) => {
        if (response && response.success) {
          const state = ctx.getState();
          const filteredItems = state.items.filter((item) => String(item?.itemId) !== String(menuId));
          ctx.patchState({ items: filteredItems });
          this.getMenuItems(ctx).subscribe(); // Refresh the menu items after deletion
        }
      },
      error: (error) => {
        console.error('Error deleting menu item:', error);
        // Handle error appropriately, e.g., show a notification
      }
    });
  }
}

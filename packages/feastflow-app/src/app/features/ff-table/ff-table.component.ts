import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Store } from '@ngxs/store';
import { AddCartItem, EditCartItem, DeleteCartItem } from '../../store/cart/cart.actions';
import { FormControl } from '@angular/forms';
import { EditOrdersItem } from 'src/app/store/orders/orders.actions';

@Component({
  selector: 'ff-table',
  templateUrl: './ff-table.component.html',
  styleUrls: ['./ff-table.component.css']
})
export class FfTableComponent implements OnInit {
  @Input() userRole: string = '';
  @Input() title: string = '';
  @Input() columns: string[] = [];
  @Input() data: any[] = [];
  @Input() cartData: any[] = [];
  @Output() onEditItem = new EventEmitter<any>();
  @Output() onDeleteItem = new EventEmitter<any>();
  @Output() onCartDataChange = new EventEmitter<any[]>();
  tableDataKeys?: any[];
  constructor(private store: Store) {}

  ngOnInit() {
    this.setTableDataKeys();
    this.setStatusDropdownOptions();
    if (this.userRole === 'viewCart') {
      this.cartData = this.data;
    }
  }

  setTableDataKeys() {
    switch (this.userRole) {
      case 'restaurantManager':
        this.tableDataKeys = ['itemName', 'category', 'price'];
        break;
      case 'customer':
        this.tableDataKeys = ['itemName', 'price', 'allergens', 'ingredients'];
        break;
      case 'viewCart':
        this.tableDataKeys = ['itemName', 'price', 'note'];
        break;
      case 'restaurantStaff':
        this.tableDataKeys = ['table', 'itemName', 'quantity'];
        break;
      case 'orderStatus':
        // Use statusLabel for enum-aware, user-friendly display
        this.tableDataKeys = ['table', 'itemName', 'statusLabel', 'note'];
        break;
      case 'systemManager':
        this.tableDataKeys = ['userId', 'userName', 'userRole', 'userStatus'];
        break;
      default:
        this.tableDataKeys = [];
    }
  }

  setStatusDropdownOptions() {
  if (this.userRole === 'restaurantStaff' || this.userRole === 'orderStatus') {
      // Central maps: enum -> user-friendly label, and next step progression
      const LABELS: Record<string, string> = {
        PENDING: 'Pending',
        IN_QUEUE: 'In Queue',
        PREPARING: 'Preparing',
        READY: 'Ready',
        SERVED: 'Served',
        CANCELLED: 'Cancelled',
        NOT_AVAILABLE: 'Not Available'
      };
      // We no longer compute next status; dropdown will always offer all options.

      this.data.forEach(item => {
        const statusEnum = String(item.status || '').toUpperCase();
        item.statusLabel = LABELS[statusEnum] ?? statusEnum;
        // Do not set item.statusOption anymore
        delete item.statusOption;
      });
    }
  }


  onEdit(item: any) {
    this.onEditItem.emit(item);
  }
  onDelete(item: any) {
    switch (this.userRole) {
      case 'restaurantManager':
        this.onDeleteItem.emit(item.itemId);
        break;
      case 'restaurantStaff':
        this.onDeleteItem.emit(item.orderId);
        break;
      case 'systemManager':
        this.onDeleteItem.emit(item.userId);
        break;
      default:
        break;
    }
  }

  onAddToCart(item: any) {
    // Optimistically update local cartData
    const existing = this.cartData.find(ci => String(ci.itemId) === String(item.itemId));
    if (existing) {
      existing.quantity = (existing.quantity || 0) + 1;
    } else {
      this.cartData.push({ itemId: item.itemId, itemName: item.itemName, price: item.price, note: null, quantity: 1 });
    }
    this.emitCartDataChange();
    // Dispatch backend add (will refresh cart via state)
  this.store.dispatch(new AddCartItem({ itemId: item.itemId, itemName: item.itemName, price: item.price, quantity: 1, note: '' }));
  }

  getCartItemQuantity(item: any): number {
    const cartItem = this.cartData.find(cartItem => cartItem.itemId === item.itemId);
    return cartItem ? cartItem.quantity : 0;
  }

  // Add method to increase quantity
  increaseQuantity(item: any) {
    // For customer view, item is a menu item; find corresponding cart entry first
    const keyId = item.itemId ?? item.id;
    const cartItem = this.cartData.find(ci => String(ci.itemId) === String(keyId));
    if (cartItem) {
      cartItem.quantity = (cartItem.quantity || 0) + 1;
      this.emitCartDataChange();
      this.store.dispatch(new EditCartItem({ ...cartItem }));
    } else {
      // If not in cart yet, treat as add
      this.onAddToCart(item);
    }
  }

  // Add method to decrease quantity
  decreaseQuantity(item: any) {
    const keyId = item.itemId ?? item.id;
    const cartItemIndex = this.cartData.findIndex(ci => String(ci.itemId) === String(keyId));
    if (cartItemIndex !== -1) {
      const cartItem = this.cartData[cartItemIndex];
      if ((cartItem.quantity || 0) > 1) {
        cartItem.quantity -= 1;
        this.emitCartDataChange();
        this.store.dispatch(new EditCartItem({ ...cartItem }));
      } else {
        // Remove item from cart if quantity becomes 0
        this.cartData.splice(cartItemIndex, 1);
        this.emitCartDataChange();
        this.store.dispatch(new DeleteCartItem(cartItem.cartItemId || cartItem.itemId));
      }
    }
  }

  // Emit cartData changes to parent
  private emitCartDataChange() {
    this.onCartDataChange.emit(this.cartData);
  }

  onStatusChange(item: any, status: string) {
    // Convert UI label back to enum if needed, and update locally
    const LABEL_TO_ENUM: Record<string, string> = {
      'Pending': 'PENDING',
      'In Queue': 'IN_QUEUE',
      'Preparing': 'PREPARING',
      'Ready': 'READY',
      'Served': 'SERVED',
      'Cancelled': 'CANCELLED',
      'Not Available': 'NOT_AVAILABLE'
    };
    const newEnum = LABEL_TO_ENUM[status] || String(status).toUpperCase();
    item.status = newEnum;
  // Recompute label for the changed item
    const LABELS: Record<string, string> = {
      PENDING: 'Pending',
      IN_QUEUE: 'In Queue',
      PREPARING: 'Preparing',
      READY: 'Ready',
      SERVED: 'Served',
      CANCELLED: 'Cancelled',
      NOT_AVAILABLE: 'Not Available'
    };
    item.statusLabel = LABELS[newEnum] ?? newEnum;
    // Do not set item.statusOption anymore
    delete item.statusOption;

    // Update local list for immediate UI feedback
    this.data = this.data.map(i => i.orderItemId === item.orderItemId ? { ...i, status: newEnum, statusLabel: item.statusLabel } : i);
    // Dispatch to NGXS so state reflects the change
    // If you have the action wired, uncomment the next line and ensure import
    this.store.dispatch(new EditOrdersItem({ ...item }));

  }
}

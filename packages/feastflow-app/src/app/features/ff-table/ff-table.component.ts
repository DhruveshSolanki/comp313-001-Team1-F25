import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngxs/store';
import { CartApiService } from 'src/app/services/api/cart-api.service';
import { GetCartItems } from 'src/app/store/cart/cart.actions';

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
        this.tableDataKeys = ['table', 'itemName', 'status', 'note'];
        break;
      case 'systemManager':
        this.tableDataKeys = ['userId', 'userName', 'userRole', 'userStatus'];
        break;
      default:
        this.tableDataKeys = [];
    }
  }

  setStatusDropdownOptions() {
    if (this.userRole === 'restaurantStaff') {
      this.data.forEach(item => {
        switch (item.status) {
          case 'In Queue':
            item.statusOption = 'Preparing';
            break;
          case 'Preparing':
            item.statusOption = 'Ready';
            break;
          case 'Ready':
            item.statusOption = 'Served';
            break;
          default:
            item.statusOption = 'Cancelled';
            break;
        }
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

  constructor(private cartApi: CartApiService, private store: Store) {}

  onAddToCart(item: any) {
    // Use backend so checkout has items; then refresh store cart state
    this.cartApi.addItem(String(item.itemId), 1).subscribe({
      next: () => {
        this.store.dispatch(new GetCartItems());
      },
      error: err => {
        console.error('[Table] Add to cart failed; falling back to local state', err);
        this.cartData.push({ itemId: item.itemId, itemName: item.itemName, price: item.price, note: null, quantity: 1 });
        this.emitCartDataChange();
      }
    });
  }

  getCartItemQuantity(item: any): number {
    const cartItem = this.cartData.find(cartItem => cartItem.itemId === item.itemId);
    return cartItem ? cartItem.quantity : 0;
  }

  // Add method to increase quantity
  increaseQuantity(item: any) {
    const cartItem = this.cartData.find(ci => ci.itemId === item.itemId);
    if (!cartItem) return;
    const newQty = (cartItem.quantity ?? 0) + 1;
    if (cartItem.cartItemId) {
      this.cartApi.updateItem(cartItem.cartItemId, newQty, cartItem.note).subscribe({
        next: () => this.store.dispatch(new GetCartItems()),
        error: () => {
          cartItem.quantity = newQty; // fallback local
          this.emitCartDataChange();
        }
      });
    } else {
      cartItem.quantity = newQty;
      this.emitCartDataChange();
    }
  }

  // Add method to decrease quantity
  decreaseQuantity(item: any) {
    const idx = this.cartData.findIndex(ci => ci.itemId === item.itemId);
    if (idx === -1) return;
    const cartItem = this.cartData[idx];
    const newQty = (cartItem.quantity ?? 0) - 1;
    if (cartItem.cartItemId) {
      if (newQty <= 0) {
        this.cartApi.removeItem(cartItem.cartItemId).subscribe({
          next: () => this.store.dispatch(new GetCartItems()),
          error: () => {
            this.cartData.splice(idx, 1); // fallback local
            this.emitCartDataChange();
          }
        });
      } else {
        this.cartApi.updateItem(cartItem.cartItemId, newQty, cartItem.note).subscribe({
          next: () => this.store.dispatch(new GetCartItems()),
          error: () => {
            cartItem.quantity = newQty; // fallback local
            this.emitCartDataChange();
          }
        });
      }
    } else {
      if (newQty <= 0) {
        this.cartData.splice(idx, 1);
      } else {
        cartItem.quantity = newQty;
      }
      this.emitCartDataChange();
    }
  }

  // Emit cartData changes to parent
  private emitCartDataChange() {
    this.onCartDataChange.emit(this.cartData);
  }

  onStatusChange(item: any, status: string) {
    // Update the item locally
    item.status = status;

    this.data = this.data.map(i => i.orderId === item.orderId ? item : i);

  }
}

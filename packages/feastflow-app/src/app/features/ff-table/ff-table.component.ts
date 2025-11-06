import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';

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

  onAddToCart(item: any) {
    this.cartData.push({ itemId: item.itemId, itemName: item.itemName, price: item.price, note: null, quantity: 1 });
    this.emitCartDataChange();
  }

  getCartItemQuantity(item: any): number {
    const cartItem = this.cartData.find(cartItem => cartItem.itemId === item.itemId);
    return cartItem ? cartItem.quantity : 0;
  }

  // Add method to increase quantity
  increaseQuantity(item: any) {
    const cartItem = this.cartData.find(cartItem => cartItem.itemID === item.id);
    if (cartItem) {
      cartItem.quantity++;
    }
    this.emitCartDataChange();
  }

  // Add method to decrease quantity
  decreaseQuantity(item: any) {
    const cartItemIndex = this.cartData.findIndex(cartItem => cartItem.itemID === item.id);
    if (cartItemIndex !== -1) {
      const cartItem = this.cartData[cartItemIndex];
      if (cartItem.quantity > 1) {
        cartItem.quantity--;
      } else {
        // Remove item from cart if quantity becomes 0
        this.cartData.splice(cartItemIndex, 1);
      }
    }
    this.emitCartDataChange();
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

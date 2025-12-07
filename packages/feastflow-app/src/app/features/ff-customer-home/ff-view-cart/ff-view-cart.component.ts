import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { SideBarTitleService } from 'src/app/services/side-bar-title.service';
import { CartState } from '../../../store/cart/cart.state';
import { GetCartItems } from '../../../store/cart/cart.actions';

@Component({
  selector: 'ff-view-cart',
  templateUrl: './ff-view-cart.component.html',
  styleUrls: ['./ff-view-cart.component.css']
})
export class FfViewCartComponent {
  cartItems: any[] = [];
  columns: string[] = ['Item Name', 'Price', 'Note'];

  constructor(private store: Store, private sideBarTitleService: SideBarTitleService) {
    this.store.select(CartState.getState).subscribe(items => {
      this.cartItems = items || [];
    });
  }

  onBack() {
    this.sideBarTitleService.changeCustomerSideBarTitle("Explore Menu");
  }

  placeOrder() {
    if (window.confirm('Are you sure you want to place the order?')) {
      window.alert('Order placed successfully!');
      this.sideBarTitleService.changeCustomerSideBarTitle("Explore Menu");
    }
  }
}

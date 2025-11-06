import { Component, Input } from '@angular/core';
import { Store } from '@ngxs/store';
import { SideBarTitleService } from 'src/app/services/side-bar-title.service';

@Component({
  selector: 'ff-view-cart',
  templateUrl: './ff-view-cart.component.html',
  styleUrls: ['./ff-view-cart.component.css']
})
export class FfViewCartComponent {
  cartItems: any[] = [];

  constructor(private store: Store, private sideBarTitleService: SideBarTitleService) {
    this.store.select(state => state.cart.items).subscribe(items => {
      this.cartItems = items || [];
    });
   }

  columns: string[] = ['Item Name', 'Price', 'Note', 'Actions'];

  onBack(){
    this.sideBarTitleService.changeCustomerSideBarTitle("Explore Menu");
  }

  placeOrder() {
    if (window.confirm('Are you sure you want to place the order?')) {
      // You can dispatch an action here to place the order if needed
      window.alert('Order placed successfully!');
      this.sideBarTitleService.changeCustomerSideBarTitle("Explore Menu");
    }
  }
}

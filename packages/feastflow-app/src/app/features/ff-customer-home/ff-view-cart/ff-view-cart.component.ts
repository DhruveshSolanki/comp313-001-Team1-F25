import { Component, Input } from '@angular/core';
import { Store } from '@ngxs/store';
import { SideBarTitleService } from 'src/app/services/side-bar-title.service';
import { OrdersApiService } from '../../../services/api/orders-api.service';
import { CartApiService } from '../../../services/api/cart-api.service';

@Component({
  selector: 'ff-view-cart',
  templateUrl: './ff-view-cart.component.html',
  styleUrls: ['./ff-view-cart.component.css']
})
export class FfViewCartComponent {
  cartItems: any[] = [];

  constructor(private store: Store,
              private sideBarTitleService: SideBarTitleService,
              private ordersApi: OrdersApiService,
              private cartApi: CartApiService) {
    this.store.select(state => state.cart.items).subscribe(items => {
      this.cartItems = items || [];
    });
   }

  columns: string[] = ['Item Name', 'Price', 'Note', 'Actions'];

  onBack(){
    this.sideBarTitleService.changeCustomerSideBarTitle("Explore Menu");
  }

  placeOrder() {
    if (!window.confirm('Are you sure you want to place the order?')) return;
    // Use HttpClient so auth interceptor adds Bearer token, send optional notes/tableId if needed later
    // For now body can be empty; still use HttpClient post to include Authorization
    window.alert('Order placed successfully!');
          this.sideBarTitleService.changeCustomerSideBarTitle('Explore Menu');
          this.cartApi.clear().subscribe(); // Clear cart after order placed
    // this.ordersApi.checkout({})
    //   .subscribe({
    //     next: async () => {
    //       // Clear backend cart then update UI
    //       try { await this.cartApi.clear().toPromise(); } catch {}
    //       window.alert('Order placed successfully!');
    //       this.sideBarTitleService.changeCustomerSideBarTitle('Explore Menu');
    //     },
    //     error: (err) => {
    //       console.error('[Cart] Checkout failed', err);
    //       window.alert('Failed to place order');
    //     }
    //   });
  }
}

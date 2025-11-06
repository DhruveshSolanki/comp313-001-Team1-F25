import { Component } from '@angular/core';
import { Store } from '@ngxs/store';

@Component({
  selector: 'ff-order-status',
  templateUrl: './ff-order-status.component.html',
  styleUrls: ['./ff-order-status.component.css']
})
export class FfOrderStatusComponent {
  orderItems: any[] = [];
  columns: string[] = ['Table#', 'Item Name', 'Status','Note', 'Actions'];

  constructor(private store: Store) {
    this.store.select(state => state?.orders?.items).subscribe(items => {  
      this.orderItems = items || [];
    });
   }
}

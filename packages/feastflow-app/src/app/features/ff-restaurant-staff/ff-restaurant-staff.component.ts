import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { SideBarTitleService } from 'src/app/services/side-bar-title.service';
import { SideBarService } from 'src/app/services/side-bar.service';
import { DeleteOrdersItem, GetOrdersItems } from 'src/app/store/orders/orders.actions';
import { OrdersApiService } from '../../services/api/orders-api.service';
import { OrderItem, OrdersState } from 'src/app/store/orders/orders.state';

@Component({
  selector: 'ff-restaurant-staff',
  templateUrl: './ff-restaurant-staff.component.html',
  styleUrls: ['./ff-restaurant-staff.component.css']
})
export class FfRestaurantStaffComponent implements OnInit, OnDestroy {

  sidebarOpen: boolean = false;
  byCategorySelector$ = this.store.select(OrdersState.getState);
  sidebar: boolean = false;

  columns: string[] = ['Table#', 'Item', 'Quantity', 'Actions'];
  homeTitle!: string;
  cartItems: any[] = [];

  constructor(private store: Store,
    private sidebarService: SideBarService,
    private sideBarTitleService: SideBarTitleService,
    private ordersApi: OrdersApiService) { }

  categories: { [category: string]: OrderItem[] } = {};

  ngOnInit() {

    const homeTitleSubject = this.sideBarTitleService.getFirstRestaurantStaffSideBarTitle();
    homeTitleSubject.subscribe(title => {
      this.homeTitle = title;
    });

  // Dispatch NGXS action to load from backend via OrdersState (now wired to API)
  this.store.dispatch(new GetOrdersItems());

    // Always listen to store updates
    this.store
      .select(OrdersState.getState)
      .subscribe(orderItems => {
        const items = orderItems || [];
        this.categories = items.reduce((acc: { [key: string]: OrderItem[] }, item: OrderItem) => {
          if (!acc[item.category]) {
            acc[item.category] = [];
          }
          acc[item.category].push(item);
          return acc;
        }, {});
      });
  }

  ngOnDestroy() {
    // Unsubscribe from the title subject to prevent memory leaks
    this.sideBarTitleService.getFirstCustomerSideBarTitle().unsubscribe();
  }

  noSort = () => 0;

  onSidebarToggle() {
    this.sidebarService.toggleSidebar();
  }

  onHomeTitleChange($event: string) {
    this.homeTitle = $event;
  }


  getKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  onDelete(orderItemId: any) {
    this.store.dispatch(new DeleteOrdersItem(orderItemId));
  }
}


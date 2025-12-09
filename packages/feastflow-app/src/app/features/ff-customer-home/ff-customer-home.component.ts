import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngxs/store';
import { SideBarTitleService } from 'src/app/services/side-bar-title.service';
import { SideBarService } from 'src/app/services/side-bar.service';
import { GetCartItems, SetCartItems } from 'src/app/store/cart/cart.actions';
import { CartState } from 'src/app/store/cart/cart.state';
import { GetMenuItems } from 'src/app/store/menu/menu.actions';
import { MenuState, MenuItem } from 'src/app/store/menu/menu.state';

@Component({
  selector: 'app-ff-customer-home',
  templateUrl: './ff-customer-home.component.html',
  styleUrls: ['./ff-customer-home.component.css']
})
export class FfCustomerHomeComponent implements OnInit, OnDestroy {

  sidebarOpen: boolean = false;
  byCategorySelector$ = this.store.select(MenuState.getState);
  sidebar: boolean = false;

  columns: string[] = ['Item Name', 'Price', 'Restrictions', 'Ingredients', 'Actions'];
  homeTitle!: string;
  cartItems: any[] = [];
  // Live search query used by ffSearch pipe
  searchQuery: string = '';

  constructor(private store: Store,
    private sidebarService: SideBarService,
    private sideBarTitleService: SideBarTitleService) { }

  categories: { [category: string]: MenuItem[] } = {};

  ngOnInit() {

    const homeTitleSubject = this.sideBarTitleService.getFirstCustomerSideBarTitle();
    homeTitleSubject.subscribe(title => {
      this.homeTitle = title;
    });

    this.store.dispatch(new GetMenuItems());

    // Always listen to store updates
    this.store
      .select(MenuState.getState)
      .subscribe(menuItems => {
        const items = menuItems || [];
        this.categories = items.reduce((acc: { [key: string]: MenuItem[] }, item: MenuItem) => {
          if (!acc[item.category]) {
            acc[item.category] = [];
          }
          acc[item.category].push(item);
          return acc;
        }, {});
      });
      
    this.store.dispatch(new GetCartItems()).subscribe(() => {
      this.store.select(CartState.getState).subscribe(items => {
        this.cartItems = items || [];
      });
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

  onCartDataChange(cartData: any[]) {
    this.store.dispatch(new SetCartItems(cartData));
  }

  getKeys(obj: any): string[] {
    return Object.keys(obj);
  }
}

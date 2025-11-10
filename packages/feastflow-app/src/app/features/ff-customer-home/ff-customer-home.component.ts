import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { SideBarTitleService } from 'src/app/services/side-bar-title.service';
import { SideBarService } from 'src/app/services/side-bar.service';
import { SetCartItems } from 'src/app/store/cart/cart.actions';
import { CartState } from 'src/app/store/cart/cart.state';
import { GetMenuItems } from 'src/app/store/menu/menu.actions';
import { MenuState, MenuItem } from 'src/app/store/menu/menu.state';
import { MenuApiService, ApiMenuItem } from 'src/app/services/api/menu-api.service';

@Component({
  selector: 'app-ff-customer-home',
  templateUrl: './ff-customer-home.component.html',
  styleUrls: ['./ff-customer-home.component.css']
})
export class FfCustomerHomeComponent implements OnInit, OnDestroy {

  sidebarOpen: boolean = false;
  byCategorySelector$ = this.store.select(MenuState.getState);
  sidebar: boolean = false;

  columns: string[] = ['Item Name', 'Price', 'Restrictions','Ingredients', 'Actions'];
  homeTitle!: string;
  cartItems: any[] = []; 

  constructor(private store: Store,
    private sidebarService: SideBarService,
    private sideBarTitleService: SideBarTitleService,
    private menuApi: MenuApiService) { }

  categories: { [category: string]: MenuItem[] } = {};

  loading = false;
  loadError: string | null = null;

  ngOnInit() {

    const homeTitleSubject = this.sideBarTitleService.getFirstCustomerSideBarTitle();
    homeTitleSubject.subscribe(title => {
      this.homeTitle = title;
    });

    // Primary: use NGXS action (will hit backend)
    this.loading = true;
    this.store.dispatch(new GetMenuItems()).subscribe({
      next: () => {
        this.loading = false;
        this.loadError = null;
      },
      error: (err) => {
        console.error('[CustomerHome] Store dispatch GetMenuItems failed, falling back to direct API.', err);
        this.fallbackDirectLoad();
      }
    });

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

    this.store.select(CartState.getState).subscribe(items => {
      this.cartItems = items || [];
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

  /**
   * Fallback direct load if NGXS action fails (extra diagnostics for missing network call).
   */
  private fallbackDirectLoad() {
    this.loading = true;
    this.menuApi.list().subscribe({
      next: (items: ApiMenuItem[]) => {
        console.debug('[CustomerHome] Fallback direct API menu items count:', items.length);
        // Map ApiMenuItem -> MenuItem (minimal fields used by template)
        const mapped: MenuItem[] = (items || []).map(i => ({
          itemId: typeof i.itemId === 'string' ? i.itemId : String(i.itemId ?? Date.now()),
          itemName: i.itemName,
          category: (i as any).category || 'Uncategorized',
          price: i.price || 0,
          description: (i as any).itemDescription,
          allergens: (i as any).warnings,
          ingredients: (i as any).ingredients
        }));
        this.categories = mapped.reduce((acc: { [key: string]: MenuItem[] }, item: MenuItem) => {
          if (!acc[item.category]) acc[item.category] = [];
          acc[item.category].push(item);
          return acc;
        }, {});
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.loadError = 'Failed to load menu.';
        console.error('[CustomerHome] Fallback API load failed:', err);
      }
    });
  }
}

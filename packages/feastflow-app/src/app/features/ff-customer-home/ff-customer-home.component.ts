import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { Store } from '@ngxs/store';
import { SideBarTitleService } from 'src/app/services/side-bar-title.service';
import { SideBarService } from 'src/app/services/side-bar.service';
import { GetCartItems, SetCartItems } from 'src/app/store/cart/cart.actions';
import { CartState } from 'src/app/store/cart/cart.state';
import { GetMenuItems } from 'src/app/store/menu/menu.actions';
import { MenuState, MenuItem } from 'src/app/store/menu/menu.state';
import { DialogService } from 'src/app/share/ff-dialog/dialog.service';

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
  // Advanced filters model
  filters = {
    category: '',
    ingredients: '',
    restrictions: '',
    allergen: ''
  };

  constructor(private store: Store,
    private sidebarService: SideBarService,
    private sideBarTitleService: SideBarTitleService,
    private dialog: DialogService) { }

  categories: { [category: string]: MenuItem[] } = {};
  filteredCategories: { [category: string]: MenuItem[] } = {};

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
        // initialize filtered to all categories on load/update
        this.applyAdvancedFilters();
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

  // Advanced filter dialog
  openAdvancedFilters(tpl: TemplateRef<any>) {
    const ref = this.dialog.open(tpl, { title: 'Advanced Filters', width: '520px' });
    ref.afterClosed().subscribe();
  }

  onFiltersClear() {
    // reset filters
    this.filters = { category: '', ingredients: '', restrictions: '', allergen: '' };
    this.applyAdvancedFilters();
    this.dialog.close();
  }

  onFiltersSave() {
    this.applyAdvancedFilters();
    this.dialog.close();
  }

  private applyAdvancedFilters() {
    const catKey = this.filters.category?.trim();
    const ingQ = (this.filters.ingredients || '').trim().toLowerCase();
    const resQ = (this.filters.restrictions || '').trim().toLowerCase();
    const allQ = (this.filters.allergen || '').trim().toLowerCase();

    const source = this.categories;
    const target: { [k: string]: MenuItem[] } = {};

    const keys = catKey ? [catKey] : Object.keys(source);
    keys.forEach(k => {
      const list = (source[k] || []).filter(item => {
        const ingredients = (item as any).ingredients?.toString().toLowerCase() || '';
        const restrictions = (item as any).allergens?.toString().toLowerCase() || '';
        const allergen = (item as any).allergen?.toString().toLowerCase() || '';
        const ingOk = !ingQ || ingredients.includes(ingQ);
        const resOk = !resQ || restrictions.includes(resQ);
        const allOk = !allQ || allergen.includes(allQ);
        return ingOk && resOk && allOk;
      });
      if (list.length) target[k] = list;
    });

    this.filteredCategories = target;
  }
}

import { Component, EventEmitter, OnInit, OnDestroy, Output, ViewChild } from '@angular/core';
import { Store } from '@ngxs/store';
import { SideBarTitleService } from 'src/app/services/side-bar-title.service';
import { SideBarService } from 'src/app/services/side-bar.service';
import { GetMenuItems, DeleteMenuItem } from 'src/app/store/menu/menu.actions';
import { MenuState, MenuItem } from 'src/app/store/menu/menu.state';
import { FfEditMenuComponent } from './ff-edit-menu/ff-edit-menu.component';

@Component({
  selector: 'ff-home',
  templateUrl: './ff-home.component.html',
  styleUrls: ['./ff-home.component.css'],
})
export class FfHomeComponent implements OnInit, OnDestroy {

  @ViewChild('editComponent') editComponent!: FfEditMenuComponent;

  sidebarOpen: boolean = false;
  byCategorySelector$ = this.store.select(MenuState.getState);
  sidebar: boolean = false;

  columns: string[] = ['Item Name', 'Category', 'Price', 'Actions'];
  homeTitle!: string;
  editData: any;

  constructor(private store: Store,
    private sidebarService: SideBarService,
    private sideBarTitleService: SideBarTitleService) { }

  categories: { [category: string]: MenuItem[] } = {};

  ngOnInit() {

    const homeTitleSubject = this.sideBarTitleService.getFirstRestaurantManagerSideBarTitle();
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
  }

  ngOnDestroy() {
    // Unsubscribe from the title subject to prevent memory leaks
    this.sideBarTitleService.getFirstRestaurantManagerSideBarTitle().unsubscribe();
  }

  noSort = () => 0;

  onSidebarToggle() {
    this.sidebarService.toggleSidebar();
  }

  onHomeTitleChange($event: string) {
    this.homeTitle = $event;
  }

  onEdit(menu: any) {
    this.editData = menu;
    this.homeTitle = "Edit Item";
  }
  onDelete(menuId: any) {
    this.store.dispatch(new DeleteMenuItem(menuId));
  }

  getKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  onSave() {
    this.editComponent.submitForm();
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SideBarTitleService {

  private restaurantManagerSideBarTitle: any[] = ['Menu', 'Add Item'];
  private rmTitle: BehaviorSubject<string> = new BehaviorSubject<string>(this.restaurantManagerSideBarTitle[0]);

  private customerSideBarTitle: any[] = ['Explore Menu', 'View Cart'];
  private cmTitle: BehaviorSubject<string> = new BehaviorSubject<string>(this.customerSideBarTitle[0]);

  private restaurantStaffSideBarTitle: any[] = ['Orders', 'Order Status'];
  private rsTitle: BehaviorSubject<string> = new BehaviorSubject<string>(this.restaurantStaffSideBarTitle[0]);

  private systemManagerSideBarTitle: any[] = ['Staff', 'Activity Logs'];
  private smTitle: BehaviorSubject<string> = new BehaviorSubject<string>(this.systemManagerSideBarTitle[0]);

  constructor() { }

  getSideBarTitle(userRole?: string) {
    switch (userRole) {
      case 'restaurantManager':
        return this.restaurantManagerSideBarTitle;
      case 'customer':
        return this.customerSideBarTitle;
      case 'restaurantStaff':
        return this.restaurantStaffSideBarTitle;
      case 'systemManager':
        return this.systemManagerSideBarTitle;
      default:
        return [];
    }
  }

  getFirstRestaurantManagerSideBarTitle() {
    return this.rmTitle;
  }

  changeRestaurantManagerSideBarTitle(title: string) {
    this.rmTitle.next(title);
  }

  getFirstCustomerSideBarTitle() {
    return this.cmTitle;
  }

  changeCustomerSideBarTitle(title: string) {
    this.cmTitle.next(title);
  }

  getFirstRestaurantStaffSideBarTitle() {
    return this.rsTitle;
  }

  changeRestaurantStaffSideBarTitle(title: string) {
    this.rsTitle.next(title);
  }

  getFirstSystemManagerSideBarTitle() {
    return this.smTitle;
  }

  changeSystemManagerSideBarTitle(title: string) {
    this.smTitle.next(title);
  }
}

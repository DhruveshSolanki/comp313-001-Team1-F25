import { Component, Input } from '@angular/core';
import { SideBarTitleService } from 'src/app/services/side-bar-title.service';

@Component({
  selector: 'ff-floating-btn',
  templateUrl: './ff-floating-btn.component.html',
  styleUrls: ['./ff-floating-btn.component.css']
})
export class FfFloatingBtnComponent {
  @Input() userRole?: string ;

  constructor(private sideBarTitleService: SideBarTitleService) { }

  addWarning() {
   this.sideBarTitleService.changeRestaurantManagerSideBarTitle('Add Item');
  }

  addToCart() {
    this.sideBarTitleService.changeCustomerSideBarTitle('View Cart');
  }
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FfRestaurantStaffComponent } from './ff-restaurant-staff.component';
import { FfOrderStatusComponent } from './ff-order-status/ff-order-status.component';
import { ShareModule } from 'src/app/share/share.module';



@NgModule({
  declarations: [
    FfRestaurantStaffComponent,
    FfOrderStatusComponent
  ],
  imports: [
    CommonModule,
    ShareModule
  ],
  exports: [
    FfRestaurantStaffComponent,
    FfOrderStatusComponent
  ],
})
export class FfRestaurantStaffModule { }

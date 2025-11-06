import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FfCustomerHomeComponent } from './ff-customer-home.component';
import { ShareModule } from 'src/app/share/share.module';
import { FfViewCartComponent } from './ff-view-cart/ff-view-cart.component';



@NgModule({
  declarations: [
  FfCustomerHomeComponent,
  FfViewCartComponent
  ],
  imports: [
    CommonModule,
    ShareModule
  ],
  exports: [
  FfCustomerHomeComponent
  ],
})
export class FfCustomerHomeModule { }

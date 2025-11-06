import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FfLoginComponent } from './features/ff-login/ff-login.component';
import { FfHomeComponent } from './features/ff-home/ff-home.component';
import { FfCustomerHomeComponent } from './features/ff-customer-home/ff-customer-home.component';
import { FfRestaurantStaffComponent } from './features/ff-restaurant-staff/ff-restaurant-staff.component';
import { FfSystemManagerComponent } from './features/ff-system-manager/ff-system-manager.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: FfLoginComponent },
  { path: 'home', component: FfHomeComponent },
  { path: 'customer-home', component: FfCustomerHomeComponent },
  { path: 'restaurant-staff', component: FfRestaurantStaffComponent },
  { path: 'system-manager', component: FfSystemManagerComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

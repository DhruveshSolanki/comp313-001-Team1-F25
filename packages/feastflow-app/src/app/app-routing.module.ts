import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FfLoginComponent } from './features/ff-login/ff-login.component';
import { FfHomeComponent } from './features/ff-home/ff-home.component';
import { FfCustomerHomeComponent } from './features/ff-customer-home/ff-customer-home.component';
import { FfRestaurantStaffComponent } from './features/ff-restaurant-staff/ff-restaurant-staff.component';
import { FfSystemManagerComponent } from './features/ff-system-manager/ff-system-manager.component';
import { AuthGuard } from './services/auth/auth.guard';
import { RoleGuard } from './services/auth/role.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: FfLoginComponent },
  { path: 'home', component: FfHomeComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['ADMIN','MANAGER'] } },
  { path: 'customer-home', component: FfCustomerHomeComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['CUSTOMER'] } },
  { path: 'restaurant-staff', component: FfRestaurantStaffComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['CHEF','SERVER','MANAGER','ADMIN'] } },
  { path: 'system-manager', component: FfSystemManagerComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['ADMIN','MANAGER'] } },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

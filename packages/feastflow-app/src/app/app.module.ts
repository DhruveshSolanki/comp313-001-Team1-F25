import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './services/auth/auth.interceptor';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgxsModule } from '@ngxs/store';
import { ShareModule } from './share/share.module';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { MenuState } from './store/menu/menu.state';
import { FfHomeModule } from './features/ff-home/ff-home.module';
import { FfCustomerHomeModule } from './features/ff-customer-home/ff-customer-home.module';
import { CartState } from './store/cart/cart.state';
import { OrdersState } from './store/orders/orders.state';
import { FfRestaurantStaffModule } from './features/ff-restaurant-staff/ff-restaurant-staff.module';
import { UserState } from './store/user/user.state';
import { FfSystemManagerModule } from './features/ff-system-manager/ff-system-manager.module';
import { AuthState } from './store/auth/auth.state';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    FfHomeModule,
    FfCustomerHomeModule,
    FfRestaurantStaffModule,
    FfSystemManagerModule,
    ShareModule,
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
    NgxsModule.forRoot([MenuState, CartState, OrdersState, UserState, AuthState], { developmentMode: /** !environment.production */ false }),
    NgxsReduxDevtoolsPluginModule.forRoot()
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

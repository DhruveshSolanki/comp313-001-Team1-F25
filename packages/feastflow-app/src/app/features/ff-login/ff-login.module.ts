import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FfLoginComponent } from './ff-login.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    FfLoginComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    FfLoginComponent
  ]
})
export class FfLoginModule { }

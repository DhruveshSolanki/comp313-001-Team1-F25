import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FfSidebarComponent } from './ff-sidebar.component';



@NgModule({
  declarations: [
    FfSidebarComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    FfSidebarComponent
  ]
})
export class FfSidebarModule { }

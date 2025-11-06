import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FfHeaderModule } from '../features/ff-header/ff-header.module';
import { FfTableModule } from '../features/ff-table/ff-table.module';
import { FfLoginModule } from '../features/ff-login/ff-login.module';
import { FfSidebarModule } from '../features/ff-sidebar/ff-sidebar.module';
import { FfFloatingBtnModule } from '../features/ff-floating-btn/ff-floating-btn.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FfHeaderModule,
    FfTableModule,
    FfSidebarModule,
    FfLoginModule,
    FfFloatingBtnModule
  ],
  exports: [
    FfHeaderModule,
    FfTableModule,
    FfSidebarModule,
    FfLoginModule,
    FfFloatingBtnModule
  ]
})
export class ShareModule { }

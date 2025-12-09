import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FfToastContainerComponent } from './ff-toast/ff-toast-container.component';
import { FfHeaderModule } from '../features/ff-header/ff-header.module';
import { FfTableModule } from '../features/ff-table/ff-table.module';
import { FfLoginModule } from '../features/ff-login/ff-login.module';
import { FfSidebarModule } from '../features/ff-sidebar/ff-sidebar.module';
import { FfFloatingBtnModule } from '../features/ff-floating-btn/ff-floating-btn.module';
import { FfSearchPipe } from './ff-search.pipe';
import { FfDialogContainerComponent } from './ff-dialog/ff-dialog-container.component';



@NgModule({
  declarations: [FfToastContainerComponent, FfSearchPipe, FfDialogContainerComponent],
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
    FfFloatingBtnModule,
    FfToastContainerComponent,
    FfDialogContainerComponent,
    FfSearchPipe
  ]
})
export class ShareModule { }

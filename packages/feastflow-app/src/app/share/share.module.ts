import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FfToastContainerComponent } from './ff-toast/ff-toast-container.component';
import { FfHeaderModule } from '../features/ff-header/ff-header.module';
import { FfTableModule } from '../features/ff-table/ff-table.module';
import { FfLoginModule } from '../features/ff-login/ff-login.module';
import { FfSidebarModule } from '../features/ff-sidebar/ff-sidebar.module';
import { FfFloatingBtnModule } from '../features/ff-floating-btn/ff-floating-btn.module';
import { FfSearchPipe } from './ff-search.pipe';



@NgModule({
  declarations: [FfToastContainerComponent, FfSearchPipe],
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
    FfSearchPipe
  ]
})
export class ShareModule { }

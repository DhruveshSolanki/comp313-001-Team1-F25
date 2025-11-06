import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideBarService } from 'src/app/services/side-bar.service';
import { FfEditMenuComponent } from './ff-edit-menu/ff-edit-menu.component';
import { ShareModule } from 'src/app/share/share.module';
import { FfHomeComponent } from './ff-home.component';
import { SideBarTitleService } from 'src/app/services/side-bar-title.service';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    FfHomeComponent,
    FfEditMenuComponent
  ],
  imports: [
    CommonModule,
    ShareModule,
    ReactiveFormsModule
  ],
  providers: [
    SideBarService,
    SideBarTitleService
  ]
})
export class FfHomeModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FfSystemManagerComponent } from './ff-system-manager.component';
import { ShareModule } from 'src/app/share/share.module';



@NgModule({
  declarations: [
    FfSystemManagerComponent
  ],
  imports: [
    CommonModule,
    ShareModule
  ]
})
export class FfSystemManagerModule { }

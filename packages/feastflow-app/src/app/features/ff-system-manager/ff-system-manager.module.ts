import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FfSystemManagerComponent } from './ff-system-manager.component';
import { ShareModule } from 'src/app/share/share.module';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    FfSystemManagerComponent
  ],
  imports: [
    CommonModule,
    ShareModule,
    ReactiveFormsModule
  ]
})
export class FfSystemManagerModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FfTableComponent } from './ff-table.component';
import { StaffIdPipe } from 'src/app/share/staff-id.pipe';



@NgModule({
  declarations: [
    FfTableComponent,
    StaffIdPipe
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    FfTableComponent
  ]
})
export class FfTableModule { }

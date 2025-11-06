import { Component, Input } from '@angular/core';

@Component({
  selector: 'ff-header',
  templateUrl: './ff-header.component.html',
  styleUrls: ['./ff-header.component.css']
})
export class FfHeaderComponent {
  @Input() userName?: string;
  userImg: any;

}

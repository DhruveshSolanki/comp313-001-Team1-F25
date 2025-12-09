import { Component } from '@angular/core';
import { DialogService, DialogState } from './dialog.service';

@Component({
  selector: 'ff-dialog-container',
  templateUrl: './ff-dialog-container.component.html',
  styleUrls: ['./ff-dialog-container.component.css']
})
export class FfDialogContainerComponent {
  state: DialogState = { open: false };

  constructor(private dialog: DialogService) {
    this.dialog.state$.subscribe(s => this.state = s);
  }

  onBackdrop() {
    if (this.state.closeOnBackdrop) {
      this.dialog.close();
    }
  }

  close() { this.dialog.close(); }
}

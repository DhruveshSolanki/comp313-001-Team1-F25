import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SideBarTitleService } from 'src/app/services/side-bar-title.service';
import { SideBarService } from 'src/app/services/side-bar.service';

@Component({
  selector: 'ff-sidebar',
  templateUrl: './ff-sidebar.component.html',
  styleUrls: ['./ff-sidebar.component.css']
})
export class FfSidebarComponent {
  @Input() userRole?: string ;
  @Output() homeTitle = new EventEmitter<string>();
  sidebarOpen: boolean = false;
  sidebarItems?: any[];

  constructor(private sidebarService: SideBarService, private sideBarTitleService: SideBarTitleService) { }

  ngOnInit(): void {
    this.sidebarItems = this.sideBarTitleService.getSideBarTitle(this.userRole);
    this.sidebarService.sidebarOpen$.subscribe(open => {
      this.sidebarOpen = open;
    });
  }

  navigateTo(label: string) {
    this.homeTitle.emit(label);
    this.sidebarOpen = !this.sidebarOpen; 
    this.sidebarService.setSidebar(this.sidebarOpen);
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { SideBarTitleService } from 'src/app/services/side-bar-title.service';
import { SideBarService } from 'src/app/services/side-bar.service';
import { DeleteUser, GetUsers } from 'src/app/store/user/user.actions';
import { UserState } from 'src/app/store/user/user.state';

@Component({
  selector: 'app-ff-system-manager',
  templateUrl: './ff-system-manager.component.html',
  styleUrls: ['./ff-system-manager.component.css']
})
export class FfSystemManagerComponent implements OnInit, OnDestroy {
  sidebarOpen: boolean = false;
  sidebar: boolean = false;

  columns: string[] = ['Id', 'Name', 'Role', 'Status', 'Actions'];
  userData: any[] = [];
  homeTitle!: string;

  constructor(private store: Store,
    private sidebarService: SideBarService,
    private sideBarTitleService: SideBarTitleService) { }

  ngOnInit() {

    const homeTitleSubject = this.sideBarTitleService.getFirstSystemManagerSideBarTitle();
    homeTitleSubject.subscribe(title => {
      this.homeTitle = title;
    });

    this.store.dispatch(new GetUsers());

    this.store
      .select(UserState.getState)
      .subscribe(userState => {
        this.userData = userState?.items || [];
      });
  }

  ngOnDestroy() {
    // Unsubscribe from the title subject to prevent memory leaks
    this.sideBarTitleService.getFirstSystemManagerSideBarTitle().unsubscribe();
  }

  noSort = () => 0;

  onSidebarToggle() {
    this.sidebarService.toggleSidebar();
  }

  onHomeTitleChange($event: string) {
    this.homeTitle = $event;
  }


  getKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  onDelete(userId: any) {
    this.store.dispatch(new DeleteUser(userId));
  }
}

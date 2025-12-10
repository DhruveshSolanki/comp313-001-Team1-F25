import { Component, Input } from '@angular/core';
import { Store } from '@ngxs/store';
import { Router } from '@angular/router';
import { Logout } from '../../store/auth/auth.action';

@Component({
  selector: 'ff-header',
  templateUrl: './ff-header.component.html',
  styleUrls: ['./ff-header.component.css']
})
export class FfHeaderComponent {
  @Input() userName: string = '';
  userImg: any;

  showProfileMenu = false;

  constructor(private store: Store, private router: Router) {}

  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
  }

  logout() {
    this.store.dispatch(new Logout()).subscribe(() => {
      this.router.navigate(['/login']);
      this.showProfileMenu = false;
    });
  }

}

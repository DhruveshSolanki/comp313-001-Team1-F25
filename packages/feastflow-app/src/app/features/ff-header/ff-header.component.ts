import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'ff-header',
  templateUrl: './ff-header.component.html',
  styleUrls: ['./ff-header.component.css']
})
export class FfHeaderComponent {
  @Input() userName?: string;
  userImg: any;
  constructor(private auth: AuthService, private router: Router) {}

  onLogout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

}

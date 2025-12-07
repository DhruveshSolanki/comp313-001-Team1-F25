import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { Store } from '@ngxs/store';
import { AuthState } from '../../store/auth/auth.state';
import { Login } from '../../store/auth/auth.action';

@Component({
  selector: 'ff-login',
  templateUrl: './ff-login.component.html',
  styleUrls: ['./ff-login.component.css']
})
export class FfLoginComponent implements OnInit {
  
  loginForm!: FormGroup;
  constructor(private router: Router, private route: ActivatedRoute, private auth: AuthService, private store: Store) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6)
      ])
    });
  }

  ngOnInit() {}

  onSubmit() {
    if (!this.loginForm.valid) {
      this.markFormGroupTouched();
      return;
    }

    const email = String(this.email?.value || '');
    const password = String(this.password?.value || '');
    // Dispatch NGXS auth login action; navigate based on stored role
    this.store.dispatch(new Login(email, password)).subscribe({
      next: () => this.navigatePostLogin(),
      error: err => {
        console.log('Login failed', err);
      }
    });
  }

  private markFormGroupTouched() {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  // Getter methods for easy access to form controls
  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  private navigatePostLogin() {
    const redirectUrl = this.route.snapshot.queryParamMap.get('redirectUrl');
    if (redirectUrl) {
      this.router.navigateByUrl(redirectUrl);
      return;
    }
    // Prefer role from NGXS state; fallback to service/localStorage
    const role = (this.store.selectSnapshot(AuthState.role) || this.auth.getRole() || '').toUpperCase();
    if (role === 'CUSTOMER') this.router.navigate(['/customer-home']);
    else if (role === 'SERVER' || role === 'CHEF') this.router.navigate(['/restaurant-staff']);
    else if (role === 'ADMIN' || role === 'MANAGER') this.router.navigate(['/home']);
    else this.router.navigate(['/login']);// Default fallback
  }
}

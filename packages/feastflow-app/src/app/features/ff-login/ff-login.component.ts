import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'ff-login',
  templateUrl: './ff-login.component.html',
  styleUrls: ['./ff-login.component.css']
})
export class FfLoginComponent implements OnInit {
  
  loginForm!: FormGroup;
  constructor(private router: Router, private auth: AuthService) {
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
    const payload = { email: this.email?.value, password: this.password?.value };
    this.auth.login(payload).subscribe({
      next: res => {
        const role = res.role?.toUpperCase();
        switch (role) {
          case 'CUSTOMER':
            this.router.navigate(['/customer-home']); break;
          case 'MANAGER':
          case 'ADMIN':
            this.router.navigate(['/home']); break;
          case 'CHEF':
          case 'SERVER':
            this.router.navigate(['/restaurant-staff']); break;
          default:
            this.router.navigate(['/login']);
        }
      },
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
}

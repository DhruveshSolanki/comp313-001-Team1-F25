import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'ff-login',
  templateUrl: './ff-login.component.html',
  styleUrls: ['./ff-login.component.css']
})
export class FfLoginComponent implements OnInit {
  
  loginForm!: FormGroup;
  constructor(private router: Router) {
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
    if (this.loginForm.valid) {
      const formData = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      };
      // Hardcoded login logic
      if (formData.email === 'manager@example.com' && formData.password === 'manager123') {
        // Navigate to manager component
        this.router.navigate(['/home']);
        console.log('Navigating to Manager Component');
      } else if (formData.email === 'staff@example.com' && formData.password === 'staff123') {
        // Navigate to staff component
        // Example: this.router.navigate(['/staff']);
       this.router.navigate(['/restaurant-staff']);
      } else if (formData.email === 'customer@example.com' && formData.password === 'customer123') {
        // Navigate to customer component
        // Example: this.router.navigate(['/customer']);
        this.router.navigate(['/customer-home']);
      } else if (formData.email === 'admin@example.com' && formData.password === 'admin123') {
        // Navigate to admin component
        this.router.navigate(['/system-manager']);
      } else {
        console.log('Invalid credentials');
      }
      // Handle login logic here
    } else {
      console.log('Form is invalid');
      this.markFormGroupTouched();
    }
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

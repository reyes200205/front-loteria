import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  error = '';
  fieldErrors: { [key: string]: string } = {};

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      fullName: [''],
      email: [''],
      password: ['']
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loading = true;
      this.error = '';
      this.fieldErrors = {};

      console.log(this.registerForm.value);
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.router.navigate(['/app/home']);
        },
        error: (err) => {
          this.loading = false;
        }
      })
    }
  }

  getFieldError(fieldName: string): string | null {
    return this.fieldErrors[fieldName] || null;
  }

  hasFieldError(fieldName: string): boolean {
    return !!this.getFieldError(fieldName);
  }
}

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

interface ForgotPasswordRequest {
  email: string;
}

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h3 class="text-center">Forgot Password</h3>
            </div>
            <div class="card-body">
              <p class="text-muted text-center mb-4">
                Enter your email address and we'll send you a link to reset your password.
              </p>

              <form [formGroup]="forgotPasswordForm" (ngSubmit)="onSubmit()" *ngIf="!emailSent">
                <div class="mb-3">
                  <label for="email" class="form-label">Email Address</label>
                  <input
                    type="email"
                    class="form-control"
                    id="email"
                    formControlName="email"
                    placeholder="Enter your email address">
                  <div *ngIf="forgotPasswordForm.get('email')?.invalid && forgotPasswordForm.get('email')?.touched"
                       class="text-danger mt-1">
                    Please enter a valid email address
                  </div>
                </div>

                <button type="submit" class="btn btn-primary w-100" [disabled]="forgotPasswordForm.invalid || isLoading">
                  <span *ngIf="isLoading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                  {{ isLoading ? 'Sending...' : 'Send Reset Link' }}
                </button>
              </form>

              <div *ngIf="emailSent" class="text-center">
                <div class="alert alert-success" role="alert">
                  <i class="fas fa-check-circle me-2"></i>
                  Password reset link has been sent to your email address.
                </div>
                <button type="button" class="btn btn-outline-primary" (click)="resetForm()">
                  Send Another Link
                </button>
              </div>

              <div class="text-center mt-3">
                <a routerLink="/login" class="text-decoration-none">Back to Login</a>
              </div>

              <div *ngIf="errorMessage" class="alert alert-danger mt-3" role="alert">
                {{ errorMessage }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  isLoading = false;
  emailSent = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const forgotPasswordRequest: ForgotPasswordRequest = {
        email: this.forgotPasswordForm.value.email
      };

      // For now, simulate API call
      this.isLoading = false;
      this.emailSent = true;
    } else {
      this.forgotPasswordForm.get('email')?.markAsTouched();
    }
  }

  resetForm(): void {
    this.emailSent = false;
    this.errorMessage = '';
    this.forgotPasswordForm.reset();
  }
}

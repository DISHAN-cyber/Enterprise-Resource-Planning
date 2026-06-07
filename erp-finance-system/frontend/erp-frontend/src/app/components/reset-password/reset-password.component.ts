import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h3 class="text-center">Reset Password</h3>
            </div>
            <div class="card-body">
              <form [formGroup]="resetPasswordForm" (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label for="newPassword" class="form-label">New Password</label>
                  <input
                    type="password"
                    class="form-control"
                    id="newPassword"
                    formControlName="newPassword"
                    placeholder="Enter new password">
                  <div *ngIf="resetPasswordForm.get('newPassword')?.invalid && resetPasswordForm.get('newPassword')?.touched"
                       class="text-danger mt-1">
                    <div *ngIf="resetPasswordForm.get('newPassword')?.errors?.['required']">Password is required</div>
                    <div *ngIf="resetPasswordForm.get('newPassword')?.errors?.['minlength']">Password must be at least 8 characters</div>
                  </div>
                </div>

                <div class="mb-3">
                  <label for="confirmPassword" class="form-label">Confirm New Password</label>
                  <input
                    type="password"
                    class="form-control"
                    id="confirmPassword"
                    formControlName="confirmPassword"
                    placeholder="Confirm new password">
                  <div *ngIf="resetPasswordForm.get('confirmPassword')?.invalid && resetPasswordForm.get('confirmPassword')?.touched"
                       class="text-danger mt-1">
                    <div *ngIf="resetPasswordForm.get('confirmPassword')?.errors?.['required']">Please confirm your password</div>
                  </div>
                  <div *ngIf="resetPasswordForm.errors?.['passwordMismatch'] && resetPasswordForm.get('confirmPassword')?.touched"
                       class="text-danger mt-1">
                    Passwords do not match
                  </div>
                </div>

                <button type="submit" class="btn btn-primary w-100" [disabled]="resetPasswordForm.invalid || isLoading">
                  <span *ngIf="isLoading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                  {{ isLoading ? 'Resetting...' : 'Reset Password' }}
                </button>
              </form>

              <div class="text-center mt-3">
                <a routerLink="/login" class="text-decoration-none">Back to Login</a>
              </div>

              <div *ngIf="errorMessage" class="alert alert-danger mt-3" role="alert">
                {{ errorMessage }}
              </div>

              <div *ngIf="successMessage" class="alert alert-success mt-3" role="alert">
                {{ successMessage }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  token = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.resetPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParams['token'];
    if (!this.token) {
      this.errorMessage = 'Invalid reset token. Please request a new password reset link.';
    }
  }

  passwordMatchValidator(group: FormGroup): any {
    const newPassword = group.get('newPassword');
    const confirmPassword = group.get('confirmPassword');

    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.resetPasswordForm.valid && this.token) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const resetPasswordRequest: ResetPasswordRequest = {
        token: this.token,
        newPassword: this.resetPasswordForm.value.newPassword,
        confirmPassword: this.resetPasswordForm.value.confirmPassword
      };

      this.isLoading = false;
      this.successMessage = 'Password reset successfully! You can now login with your new password.';
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 3000);
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.resetPasswordForm.controls).forEach(key => {
      const control = this.resetPasswordForm.get(key);
      control?.markAsTouched();
    });
  }
}

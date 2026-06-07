import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { AuthService, UserProfile, ChangePasswordRequest } from '../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DatePipe],
  template: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card" *ngIf="userProfile">
            <div class="card-header">
              <h3 class="text-center">User Profile</h3>
            </div>
            <div class="card-body">
              <!-- Profile Information -->
              <div class="row mb-4">
                <div class="col-md-6">
                  <h5>Profile Information</h5>
                  <div class="mb-3">
                    <strong>Full Name:</strong> {{ userProfile.displayName || (userProfile.firstName + ' ' + userProfile.lastName) }}
                  </div>
                  <div class="mb-3">
                    <strong>Email:</strong> {{ userProfile.email }}
                  </div>
                  <div class="mb-3">
                    <strong>Role:</strong> {{ userProfile.role }}
                  </div>
                  <div class="mb-3" *ngIf="userProfile.phone">
                    <strong>Phone:</strong> {{ userProfile.phone }}
                  </div>
                  <div class="mb-3" *ngIf="userProfile.lastLogin">
                    <strong>Last Login:</strong> {{ userProfile.lastLogin | date:'medium' }}
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="text-center">
                    <div class="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center"
                         style="width: 80px; height: 80px;">
                      <i class="fas fa-user fa-2x text-white"></i>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Change Password Form -->
              <div class="row">
                <div class="col-12">
                  <h5>Change Password</h5>
                  <form [formGroup]="passwordForm" (ngSubmit)="onChangePassword()">
                    <div class="mb-3">
                      <label for="currentPassword" class="form-label">Current Password</label>
                      <input
                        type="password"
                        class="form-control"
                        id="currentPassword"
                        formControlName="currentPassword"
                        placeholder="Enter current password">
                      <div *ngIf="passwordForm.get('currentPassword')?.invalid && passwordForm.get('currentPassword')?.touched"
                           class="text-danger mt-1">
                        Current password is required
                      </div>
                    </div>

                    <div class="mb-3">
                      <label for="newPassword" class="form-label">New Password</label>
                      <input
                        type="password"
                        class="form-control"
                        id="newPassword"
                        formControlName="newPassword"
                        placeholder="Enter new password">
                      <div *ngIf="passwordForm.get('newPassword')?.invalid && passwordForm.get('newPassword')?.touched"
                           class="text-danger mt-1">
                        <div *ngIf="passwordForm.get('newPassword')?.errors?.['required']">New password is required</div>
                        <div *ngIf="passwordForm.get('newPassword')?.errors?.['minlength']">Password must be at least 8 characters</div>
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
                      <div *ngIf="passwordForm.get('confirmPassword')?.invalid && passwordForm.get('confirmPassword')?.touched"
                           class="text-danger mt-1">
                        Please confirm your new password
                      </div>
                      <div *ngIf="passwordForm.errors?.['passwordMismatch'] && passwordForm.get('confirmPassword')?.touched"
                           class="text-danger mt-1">
                        Passwords do not match
                      </div>
                    </div>

                    <button type="submit" class="btn btn-primary" [disabled]="passwordForm.invalid || isChangingPassword">
                      <span *ngIf="isChangingPassword" class="spinner-border spinner-border-sm me-2" role="status"></span>
                      {{ isChangingPassword ? 'Changing...' : 'Change Password' }}
                    </button>
                  </form>
                </div>
              </div>

              <!-- Success/Error Messages -->
              <div *ngIf="message" [class.alert-success]="success" [class.alert-danger]="!success"
                   class="alert mt-3" role="alert">
                {{ message }}
              </div>
            </div>
          </div>

          <!-- Loading State -->
          <div *ngIf="!userProfile" class="text-center">
            <div class="spinner-border" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  userProfile: UserProfile | null = null;
  passwordForm: FormGroup;
  isChangingPassword = false;
  message = '';
  success = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    if (this.isBrowser()) {
      this.loadProfile();
    }
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.document !== 'undefined';
  }

  loadProfile(): void {
    this.authService.getProfile().subscribe({
      next: (profile: any) => this.userProfile = profile,
      error: (err: any) => console.error('Failed to load profile:', err)
    });
  }

  passwordMatchValidator(group: FormGroup): any {
    const newPassword = group.get('newPassword');
    const confirmPassword = group.get('confirmPassword');

    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onChangePassword(): void {
    if (this.passwordForm.valid) {
      this.isChangingPassword = true;
      this.message = '';

      const changePasswordRequest: ChangePasswordRequest = {
        currentPassword: this.passwordForm.value.currentPassword,
        newPassword: this.passwordForm.value.newPassword,
        confirmPassword: this.passwordForm.value.confirmPassword
      };

      this.authService.changePassword(changePasswordRequest).subscribe({
        next: (response: any) => {
          this.isChangingPassword = false;
          this.success = true;
          this.message = response.message || 'Password changed successfully!';
          this.passwordForm.reset();
        },
        error: (err: any) => {
          this.isChangingPassword = false;
          this.success = false;
          this.message = err.error?.message || 'Failed to change password. Please try again.';
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.passwordForm.controls).forEach(key => {
      const control = this.passwordForm.get(key);
      control?.markAsTouched();
    });
  }
}

// filepath: frontend/erp-frontend/src/app/core/services/auth.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of } from 'rxjs';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  user: AuthUser;
  message?: string;
}

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  phone?: string;
  role: string;
  avatarUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  phone?: string;
  role: string;
  avatarUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdateProfileRequest {
  email?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  phone?: string;
  avatarUrl?: string;
}

export interface UserSettings {
  theme?: 'light' | 'dark' | 'system';
  language?: string;
  notificationsEnabled?: boolean;
  emailNotifications?: boolean;
  [key: string]: string | boolean | undefined;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiBase = '/api';
  private readonly tokenKey = 'erp_auth_token';
  private readonly userKey = 'erp_user';

  // Signals for reactive state management
  private _currentUser = signal<AuthUser | null>(null);
  private _isAuthenticated = signal<boolean>(false);
  private _isLoading = signal<boolean>(false);

  // Computed values
  readonly currentUser = computed(() => this._currentUser());
  readonly isAuthenticated = computed(() => this._isAuthenticated());
  readonly isLoading = computed(() => this._isLoading());

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadStoredUser();
  }

  private loadStoredUser(): void {
    if (this.isBrowser()) {
      const storedUser = localStorage.getItem(this.userKey);
      const token = localStorage.getItem(this.tokenKey);
      
      if (storedUser && token) {
        try {
          const user = JSON.parse(storedUser);
          this._currentUser.set(user);
          this._isAuthenticated.set(true);
        } catch {
          this.clearStorage();
        }
      }
    }
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.document !== 'undefined';
  }

  login(username: string, password: string): Observable<LoginResponse> {
    this._isLoading.set(true);
    
    return this.http.post<LoginResponse>(`${this.apiBase}/auth/login`, { username, password })
      .pipe(
        tap(response => {
          this._isLoading.set(false);
          if (response.success && response.user) {
            this._currentUser.set(response.user);
            this._isAuthenticated.set(true);
            
            if (response.token) {
              this.storeToken(response.token);
            }
            this.storeUser(response.user);
          }
        }),
        catchError(error => {
          this._isLoading.set(false);
          throw error;
        })
      );
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.apiBase}/auth/logout`, {})
      .pipe(
        tap(() => {
          this.clearSession();
        }),
        catchError(() => {
          this.clearSession();
          return of(undefined);
        })
      );
  }

  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiBase}/auth/profile`, { withCredentials: true });
  }

  updateProfile(request: UpdateProfileRequest): Observable<ApiResponse<UserProfile>> {
    return this.http.put<ApiResponse<UserProfile>>(`${this.apiBase}/auth/profile`, request, { withCredentials: true })
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this._currentUser.set(this.mapToAuthUser(response.data));
            this.storeUser(this._currentUser()!);
          }
        })
      );
  }

  changePassword(request: ChangePasswordRequest): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.apiBase}/auth/change-password`, request, { withCredentials: true });
  }

  getSettings(): Observable<ApiResponse<UserSettings>> {
    return this.http.get<ApiResponse<UserSettings>>(`${this.apiBase}/auth/settings`, { withCredentials: true });
  }

  updateSettings(settings: UserSettings): Observable<ApiResponse<UserSettings>> {
    return this.http.put<ApiResponse<UserSettings>>(`${this.apiBase}/auth/settings`, settings, { withCredentials: true });
  }

  refreshToken(): Observable<ApiResponse<{ token: string }>> {
    return this.http.post<ApiResponse<{ token: string }>>(`${this.apiBase}/auth/refresh`, {}, { withCredentials: true })
      .pipe(
        tap(response => {
          if (response.success && response.data?.token) {
            this.storeToken(response.data.token);
          }
        })
      );
  }

  isLoggedIn(): boolean {
    return this._isAuthenticated();
  }

  getToken(): string | null {
    if (this.isBrowser()) {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  private storeToken(token: string): void {
    if (this.isBrowser()) {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  private storeUser(user: AuthUser): void {
    if (this.isBrowser()) {
      localStorage.setItem(this.userKey, JSON.stringify(user));
    }
  }

  private clearStorage(): void {
    if (this.isBrowser()) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userKey);
    }
  }

  private clearSession(): void {
    this._currentUser.set(null);
    this._isAuthenticated.set(false);
    this.clearStorage();
    this.router.navigate(['/dashboard']);
  }

  private mapToAuthUser(profile: UserProfile): AuthUser {
    return {
      id: profile.id,
      username: profile.username,
      email: profile.email,
      firstName: profile.firstName,
      lastName: profile.lastName,
      displayName: profile.displayName,
      phone: profile.phone,
      role: profile.role,
      avatarUrl: profile.avatarUrl
    };
  }

  getFullName(): string {
    const user = this._currentUser();
    if (!user) return 'Guest';
    
    if (user.displayName) return user.displayName;
    if (user.firstName || user.lastName) {
      return `${user.firstName || ''} ${user.lastName || ''}`.trim();
    }
    return user.username;
  }

  hasRole(role: string): boolean {
    const user = this._currentUser();
    return user?.role === role;
  }

  hasAnyRole(roles: string[]): boolean {
    const user = this._currentUser();
    return user ? roles.includes(user.role) : false;
  }
}
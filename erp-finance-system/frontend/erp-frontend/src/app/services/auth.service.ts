import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, retry, catchError } from 'rxjs';
import { tap } from 'rxjs/operators';

// ============ Interfaces ============
export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phoneNumber?: string;
  role: string;
  lastLoginAt?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  userProfile: UserProfile;
}

export interface RefreshTokenResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordResponse {
  message: string;
}

// Password Reset Interfaces
export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface MessageResponse {
  message: string;
  success: boolean;
}

export interface AuditLog {
  id: string;
  eventType: string;
  description: string;
  userEmail: string;
  ipAddress: string;
  success: boolean;
  failureReason?: string;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  enabled: boolean;
}

// ============ Service ============
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api/auth';
  
  private currentUserSubject = new BehaviorSubject<UserProfile | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  // ============ Public Methods ============

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, request).pipe(
      tap(response => this.handleAuthResponse(response)),
      catchError(this.handleError)
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(() => this.clearAuthStorage()),
      catchError(err => {
        this.clearAuthStorage();
        return throwError(() => err);
      })
    );
  }

  refreshToken(): Observable<RefreshTokenResponse> {
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<RefreshTokenResponse>(`${this.apiUrl}/refresh`, { refreshToken })
      .pipe(
        tap(response => {
          localStorage.setItem('access_token', response.accessToken);
        }),
        catchError(this.handleError)
      );
  }

  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/profile`, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(profile => {
        this.currentUserSubject.next(profile);
        localStorage.setItem('user_profile', JSON.stringify(profile));
      }),
      catchError(this.handleError)
    );
  }

  changePassword(request: ChangePasswordRequest): Observable<ChangePasswordResponse> {
    if (request.newPassword !== request.confirmPassword) {
      return throwError(() => new Error('New password and confirm password do not match'));
    }

    return this.http.post<ChangePasswordResponse>(`${this.apiUrl}/change-password`, request, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  // ============ Password Reset Methods ============

  forgotPassword(request: ForgotPasswordRequest): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(`${this.apiUrl}/forgot-password`, request)
      .pipe(catchError(this.handleError));
  }

  resetPassword(request: ResetPasswordRequest): Observable<MessageResponse> {
    if (request.newPassword !== request.confirmPassword) {
      return throwError(() => new Error('New password and confirm password do not match'));
    }

    return this.http.post<MessageResponse>(`${this.apiUrl}/reset-password`, request)
      .pipe(catchError(this.handleError));
  }

  verifyResetToken(token: string): Observable<MessageResponse> {
    return this.http.get<MessageResponse>(`${this.apiUrl}/verify-reset-token/${token}`)
      .pipe(catchError(this.handleError));
  }

  // ============ Admin Methods (Role-Based) ============

  getAuditLogs(params?: { userId?: string; eventType?: string; limit?: number }): Observable<AuditLog[]> {
    let httpParams = new HttpParams();
    if (params?.userId) httpParams = httpParams.set('userId', params.userId);
    if (params?.eventType) httpParams = httpParams.set('eventType', params.eventType);
    if (params?.limit) httpParams = httpParams.set('limit', params.limit.toString());

    return this.http.get<AuditLog[]>('/api/admin/audit-logs', {
      headers: this.getAuthHeaders(),
      params: httpParams
    }).pipe(catchError(this.handleError));
  }

  getAllUsers(): Observable<AdminUser[]> {
    return this.http.get<AdminUser[]>('/api/admin/users', {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  updateUserRole(userId: string, newRole: string): Observable<MessageResponse> {
    return this.http.put<MessageResponse>(`/api/admin/users/${userId}/role?newRole=${newRole}`, {}, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  deleteUser(userId: string): Observable<MessageResponse> {
    return this.http.delete<MessageResponse>(`/api/admin/users/${userId}`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  // ============ Helper Methods ============

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getUserProfile(): UserProfile | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getUserProfile();
  }

  hasRole(requiredRole: string): boolean {
    const profile = this.getUserProfile();
    return profile?.role === requiredRole;
  }

  hasAnyRole(roles: string[]): boolean {
    const profile = this.getUserProfile();
    return profile ? roles.includes(profile.role) : false;
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  // ============ Private Methods ============

  private handleAuthResponse(response: LoginResponse): void {
    localStorage.setItem('access_token', response.accessToken);
    localStorage.setItem('refresh_token', response.refreshToken);
    localStorage.setItem('user_profile', JSON.stringify(response.userProfile));
    this.currentUserSubject.next(response.userProfile);
  }

  private clearAuthStorage(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_profile');
    this.currentUserSubject.next(null);
  }

  private loadUserFromStorage(): void {
    const profile = localStorage.getItem('user_profile');
    if (profile && this.getToken()) {
      try {
        this.currentUserSubject.next(JSON.parse(profile));
      } catch {
        this.clearAuthStorage();
      }
    }
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 400:
          errorMessage = error.error?.message || 'Bad request';
          break;
        case 401:
          errorMessage = 'Unauthorized: Please login again';
          localStorage.removeItem('access_token');
          break;
        case 403:
          errorMessage = 'Forbidden: You do not have permission';
          break;
        case 404:
          errorMessage = 'Resource not found';
          break;
        case 409:
          errorMessage = error.error?.message || 'Conflict';
          break;
        case 500:
          errorMessage = 'Server error: Please try again later';
          break;
        default:
          errorMessage = error.error?.message || `Error ${error.status}: ${error.statusText}`;
      }
    }
    
    console.error('AuthService Error:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }
}
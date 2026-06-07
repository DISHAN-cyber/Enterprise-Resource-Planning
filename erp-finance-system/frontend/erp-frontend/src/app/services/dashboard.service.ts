import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DashboardSummary {
  revenue: {
    amount: number;
    percentageChange: number;
    isPositive: boolean;
  };
  accountsReceivable: {
    amount: number;
    overduePercentage: number;
    isOverdue: boolean;
  };
  accountsPayable: {
    amount: number;
    percentageChange: number;
    isDecrease: boolean;
  };
  cashBalance: {
    amount: number;
    percentageChange: number;
    isIncrease: boolean;
  };
}

export interface FinancialOverview {
  period: string;
  dataPoints: MonthlyDataPoint[];
}

export interface MonthlyDataPoint {
  month: string;
  date: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export interface PendingAction {
  id: string;
  action: string;
  module: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  dueDate: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  assignedTo: string;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = '/api/dashboard';

  constructor(private http: HttpClient) {}

  getDashboardSummary(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(`${this.apiUrl}/summary`);
  }

  getFinancialOverview(period: string = 'Last Year'): Observable<FinancialOverview> {
    const params = new HttpParams().set('period', period);
    return this.http.get<FinancialOverview>(`${this.apiUrl}/financial-overview`, { params });
  }

  getPendingActions(): Observable<PendingAction[]> {
    return this.http.get<PendingAction[]>(`${this.apiUrl}/pending-actions`);
  }

  markActionComplete(actionId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/pending-actions/${actionId}/complete`, {});
  }

  markAllActionsComplete(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/pending-actions/mark-all-complete`, {});
  }
}
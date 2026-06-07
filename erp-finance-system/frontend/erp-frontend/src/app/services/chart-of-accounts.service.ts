import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Account {
  id: string;
  accountCode: string;
  accountName: string;
  type: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';
  subType?: string;
  balance: number;
  debitBalance: number;
  creditBalance: number;
  parentAccountId?: string;
  parentAccountCode?: string;
  parentAccountName?: string;
  description?: string;
  isActive: boolean;
  isSystemAccount: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AccountRequest {
  accountCode: string;
  accountName: string;
  type: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';
  subType?: string;
  balance?: number;
  parentAccountId?: string;
  description?: string;
  isActive?: boolean;
}

export interface AccountHierarchy {
  id: string;
  accountCode: string;
  accountName: string;
  balance: number;
  children: AccountHierarchy[];
}

@Injectable({
  providedIn: 'root'
})
export class ChartOfAccountsService {
  private apiUrl = '/api/chart-of-accounts';

  constructor(private http: HttpClient) {}

  getAllAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>(this.apiUrl);
  }

  getTopLevelAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>(`${this.apiUrl}/top-level`);
  }

  getAccountHierarchy(): Observable<AccountHierarchy[]> {
    return this.http.get<AccountHierarchy[]>(`${this.apiUrl}/hierarchy`);
  }

  getAccountById(id: string): Observable<Account> {
    return this.http.get<Account>(`${this.apiUrl}/${id}`);
  }

  getAccountByCode(code: string): Observable<Account> {
    return this.http.get<Account>(`${this.apiUrl}/code/${code}`);
  }

  searchAccounts(query: string): Observable<Account[]> {
    const params = new HttpParams().set('q', query);
    return this.http.get<Account[]>(`${this.apiUrl}/search`, { params });
  }

  getAccountsByType(type: string): Observable<Account[]> {
    return this.http.get<Account[]>(`${this.apiUrl}/type/${type}`);
  }

  getTotalBalanceByType(type: string): Observable<{ totalBalance: number }> {
    return this.http.get<{ totalBalance: number }>(`${this.apiUrl}/balance/by-type/${type}`);
  }

  createAccount(account: AccountRequest): Observable<Account> {
    return this.http.post<Account>(this.apiUrl, account);
  }

  updateAccount(id: string, account: AccountRequest): Observable<Account> {
    return this.http.put<Account>(`${this.apiUrl}/${id}`, account);
  }

  deleteAccount(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
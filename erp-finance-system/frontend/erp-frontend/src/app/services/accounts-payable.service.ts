import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Vendor {
  id: string;
  vendorCode: string;
  vendorName: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  taxId?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  createdAt: string;
  updatedAt: string;
}

export interface VendorRequest {
  vendorCode: string;
  vendorName: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  taxId?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}

export interface APInvoice {
  id: string;
  invoiceNumber: string;
  vendorId: string;
  vendorName: string;
  amount: number;
  taxAmount?: number;
  totalAmount: number;
  invoiceDate: string;
  dueDate: string;
  description?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAID' | 'CANCELLED';
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  approvedBy?: string;
  approvedAt?: string;
  lines?: APInvoiceLine[];
  createdAt: string;
  updatedAt: string;
  isOverdue: boolean;
}

export interface APInvoiceRequest {
  invoiceNumber: string;
  vendorId: string;
  amount: number;
  taxAmount?: number;
  totalAmount?: number;
  invoiceDate: string;
  dueDate: string;
  description?: string;
  lines?: APInvoiceLineRequest[];
}

export interface APInvoiceLine {
  id: string;
  description: string;
  amount: number;
  quantity: number;
  unitPrice?: number;
}

export interface APInvoiceLineRequest {
  description: string;
  amount: number;
  quantity: number;
  unitPrice?: number;
}

export interface APPayment {
  id: string;
  paymentNumber: string;
  invoiceId: string;
  invoiceNumber: string;
  vendorId: string;
  vendorName: string;
  amount: number;
  paymentDate: string;
  paymentMethod: 'CHECK' | 'BANK_TRANSFER' | 'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'ONLINE_PAYMENT';
  referenceNumber?: string;
  notes?: string;
  createdAt: string;
}

export interface APPaymentRequest {
  invoiceId: string;
  vendorId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: 'CHECK' | 'BANK_TRANSFER' | 'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'ONLINE_PAYMENT';
  referenceNumber?: string;
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AccountsPayableService {
  private apiUrl = '/api/ap';

  constructor(private http: HttpClient) {}

  // Vendor APIs
  getVendors(): Observable<Vendor[]> {
    return this.http.get<Vendor[]>(`${this.apiUrl}/vendors`);
  }

  getVendorById(id: string): Observable<Vendor> {
    return this.http.get<Vendor>(`${this.apiUrl}/vendors/${id}`);
  }

  getVendorByCode(code: string): Observable<Vendor> {
    return this.http.get<Vendor>(`${this.apiUrl}/vendors/code/${code}`);
  }

  createVendor(vendor: VendorRequest): Observable<Vendor> {
    return this.http.post<Vendor>(`${this.apiUrl}/vendors`, vendor);
  }

  updateVendor(id: string, vendor: VendorRequest): Observable<Vendor> {
    return this.http.put<Vendor>(`${this.apiUrl}/vendors/${id}`, vendor);
  }

  deleteVendor(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/vendors/${id}`);
  }

  // Invoice APIs
  getInvoices(): Observable<APInvoice[]> {
    return this.http.get<APInvoice[]>(`${this.apiUrl}/invoices`);
  }

  getInvoiceById(id: string): Observable<APInvoice> {
    return this.http.get<APInvoice>(`${this.apiUrl}/invoices/${id}`);
  }

  getInvoiceByNumber(number: string): Observable<APInvoice> {
    return this.http.get<APInvoice>(`${this.apiUrl}/invoices/number/${number}`);
  }

  getInvoicesByVendor(vendorId: string): Observable<APInvoice[]> {
    return this.http.get<APInvoice[]>(`${this.apiUrl}/invoices/vendor/${vendorId}`);
  }

  getInvoicesByStatus(status: string): Observable<APInvoice[]> {
    return this.http.get<APInvoice[]>(`${this.apiUrl}/invoices/status/${status}`);
  }

  getOverdueInvoices(): Observable<APInvoice[]> {
    return this.http.get<APInvoice[]>(`${this.apiUrl}/invoices/overdue`);
  }

  createInvoice(invoice: APInvoiceRequest): Observable<APInvoice> {
    return this.http.post<APInvoice>(`${this.apiUrl}/invoices`, invoice);
  }

  approveInvoice(id: string): Observable<APInvoice> {
    return this.http.post<APInvoice>(`${this.apiUrl}/invoices/${id}/approve`, {});
  }

  rejectInvoice(id: string): Observable<APInvoice> {
    return this.http.post<APInvoice>(`${this.apiUrl}/invoices/${id}/reject`, {});
  }

  markInvoiceAsPaid(id: string): Observable<APInvoice> {
    return this.http.post<APInvoice>(`${this.apiUrl}/invoices/${id}/mark-paid`, {});
  }

  cancelInvoice(id: string): Observable<APInvoice> {
    return this.http.post<APInvoice>(`${this.apiUrl}/invoices/${id}/cancel`, {});
  }

  // Payment APIs
  getPayments(): Observable<APPayment[]> {
    return this.http.get<APPayment[]>(`${this.apiUrl}/payments`);
  }

  getPaymentById(id: string): Observable<APPayment> {
    return this.http.get<APPayment>(`${this.apiUrl}/payments/${id}`);
  }

  getPaymentsByInvoice(invoiceId: string): Observable<APPayment[]> {
    return this.http.get<APPayment[]>(`${this.apiUrl}/payments/invoice/${invoiceId}`);
  }

  getPaymentsByVendor(vendorId: string): Observable<APPayment[]> {
    return this.http.get<APPayment[]>(`${this.apiUrl}/payments/vendor/${vendorId}`);
  }

  createPayment(payment: APPaymentRequest): Observable<APPayment> {
    return this.http.post<APPayment>(`${this.apiUrl}/payments`, payment);
  }
}
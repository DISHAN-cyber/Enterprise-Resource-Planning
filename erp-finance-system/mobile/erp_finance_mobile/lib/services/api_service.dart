import 'dart:convert';

import 'package:http/http.dart' as http;

import '../models/ap_invoice.dart';
import '../models/dashboard_summary.dart';
import '../models/expense_claim_request.dart';
import '../models/login_response.dart';
import '../models/pending_action.dart';
import '../models/vendor.dart';

class ApiService {
  static const String baseUrl = 'http://10.0.2.2:8080';
  static String? token;

  static Map<String, String> headers({bool auth = false}) {
    final headers = <String, String>{
      'Content-Type': 'application/json',
    };
    if (auth && token != null && token!.isNotEmpty) {
      headers['Authorization'] = 'Bearer $token';
    }
    return headers;
  }

  static void clearToken() {
    token = null;
  }

  Future<LoginResponse> login(String username, String password) async {
    final uri = Uri.parse('$baseUrl/api/auth/login');
    final response = await http.post(
      uri,
      headers: headers(),
      body: jsonEncode({'username': username, 'password': password}),
    );

    if (response.statusCode != 200) {
      throw Exception('Login failed: ${response.body}');
    }

    return LoginResponse.fromJson(jsonDecode(response.body) as Map<String, dynamic>);
  }

  Future<DashboardSummary> getDashboardSummary() async {
    final uri = Uri.parse('$baseUrl/api/dashboard/summary');
    final response = await http.get(uri, headers: headers(auth: true));

    if (response.statusCode != 200) {
      throw Exception('Failed to load dashboard summary: ${response.body}');
    }

    return DashboardSummary.fromJson(jsonDecode(response.body) as Map<String, dynamic>);
  }

  Future<List<PendingAction>> getPendingActions() async {
    final uri = Uri.parse('$baseUrl/api/dashboard/pending-actions');
    final response = await http.get(uri, headers: headers(auth: true));

    if (response.statusCode != 200) {
      throw Exception('Failed to load pending actions: ${response.body}');
    }

    return (jsonDecode(response.body) as List<dynamic>)
        .map((item) => PendingAction.fromJson(item as Map<String, dynamic>))
        .toList();
  }

  Future<void> completePendingAction(String actionId) async {
    final uri = Uri.parse('$baseUrl/api/dashboard/pending-actions/$actionId/complete');
    final response = await http.post(uri, headers: headers(auth: true));

    if (response.statusCode != 200) {
      throw Exception('Failed to complete action: ${response.body}');
    }
  }

  Future<List<Vendor>> getVendors() async {
    final uri = Uri.parse('$baseUrl/api/ap/vendors');
    final response = await http.get(uri, headers: headers(auth: true));

    if (response.statusCode != 200) {
      throw Exception('Failed to load vendors: ${response.body}');
    }

    return (jsonDecode(response.body) as List<dynamic>)
        .map((item) => Vendor.fromJson(item as Map<String, dynamic>))
        .toList();
  }

  Future<List<APInvoice>> getPendingInvoices() async {
    final uri = Uri.parse('$baseUrl/api/ap/invoices/status/PENDING');
    final response = await http.get(uri, headers: headers(auth: true));

    if (response.statusCode != 200) {
      throw Exception('Failed to load invoices: ${response.body}');
    }

    return (jsonDecode(response.body) as List<dynamic>)
        .map((item) => APInvoice.fromJson(item as Map<String, dynamic>))
        .toList();
  }

  Future<APInvoice> approveInvoice(String invoiceId) async {
    final uri = Uri.parse('$baseUrl/api/ap/invoices/$invoiceId/approve');
    final response = await http.post(uri, headers: headers(auth: true));

    if (response.statusCode != 200) {
      throw Exception('Failed to approve invoice: ${response.body}');
    }

    return APInvoice.fromJson(jsonDecode(response.body) as Map<String, dynamic>);
  }

  Future<APInvoice> rejectInvoice(String invoiceId) async {
    final uri = Uri.parse('$baseUrl/api/ap/invoices/$invoiceId/reject');
    final response = await http.post(uri, headers: headers(auth: true));

    if (response.statusCode != 200) {
      throw Exception('Failed to reject invoice: ${response.body}');
    }

    return APInvoice.fromJson(jsonDecode(response.body) as Map<String, dynamic>);
  }

  Future<APInvoice> submitExpenseClaim(ExpenseClaimRequest request) async {
    final uri = Uri.parse('$baseUrl/api/ap/invoices');
    final response = await http.post(
      uri,
      headers: headers(auth: true),
      body: jsonEncode(request.toJson()),
    );

    if (response.statusCode != 201) {
      throw Exception('Failed to submit expense claim: ${response.body}');
    }

    return APInvoice.fromJson(jsonDecode(response.body) as Map<String, dynamic>);
  }
}

import 'dart:convert';

import 'package:http/http.dart' as http;

import '../models/cashflow_request.dart';
import '../models/cashflow_response.dart';
import '../models/fraud_models.dart';

class AiService {
  static const String baseUrl = 'http://10.0.2.2:8000';

  Future<CashflowResponse> fetchCashflowForecast(CashflowRequest request) async {
    final uri = Uri.parse('${baseUrl}/forecast/cashflow');
    final response = await http.post(
      uri,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(request.toJson()),
    );

    if (response.statusCode != 200) {
      throw Exception('Failed to fetch forecast: $response');
    }

    return CashflowResponse.fromJson(jsonDecode(response.body) as Map<String, dynamic>);
  }

  Future<FraudDetectionResponse> detectFraud(FraudDetectionRequest request) async {
    final uri = Uri.parse('${baseUrl}/fraud/detect');
    final response = await http.post(
      uri,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(request.toJson()),
    );

    if (response.statusCode != 200) {
      throw Exception('Failed to detect fraud: $response');
    }

    return FraudDetectionResponse.fromJson(jsonDecode(response.body) as Map<String, dynamic>);
  }
}

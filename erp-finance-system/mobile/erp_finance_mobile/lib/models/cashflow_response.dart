class CashflowProjection {
  final int month;
  final double projectedBalance;
  final double revenue;
  final double expense;

  CashflowProjection({
    required this.month,
    required this.projectedBalance,
    required this.revenue,
    required this.expense,
  });

  factory CashflowProjection.fromJson(Map<String, dynamic> json) {
    return CashflowProjection(
      month: json['month'] as int,
      projectedBalance: (json['projected_balance'] as num).toDouble(),
      revenue: (json['revenue'] as num).toDouble(),
      expense: (json['expense'] as num).toDouble(),
    );
  }
}

class CashflowResponse {
  final List<CashflowProjection> forecast;
  final String recommendation;

  CashflowResponse({
    required this.forecast,
    required this.recommendation,
  });

  factory CashflowResponse.fromJson(Map<String, dynamic> json) {
    return CashflowResponse(
      forecast: (json['forecast'] as List<dynamic>)
          .map((item) => CashflowProjection.fromJson(item as Map<String, dynamic>))
          .toList(),
      recommendation: json['recommendation'] as String,
    );
  }
}

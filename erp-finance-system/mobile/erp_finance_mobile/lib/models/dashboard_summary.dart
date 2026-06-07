class DashboardSummary {
  final SummaryBlock revenue;
  final SummaryBlock accountsReceivable;
  final SummaryBlock accountsPayable;
  final SummaryBlock cashBalance;

  DashboardSummary({
    required this.revenue,
    required this.accountsReceivable,
    required this.accountsPayable,
    required this.cashBalance,
  });

  factory DashboardSummary.fromJson(Map<String, dynamic> json) {
    Map<String, dynamic> parseBlock(String camel, String snake) {
      final block = json[camel] ?? json[snake];
      if (block is Map<String, dynamic>) return block;
      return <String, dynamic>{};
    }

    return DashboardSummary(
      revenue: SummaryBlock.fromJson(parseBlock('revenue', 'revenue')),
      accountsReceivable: SummaryBlock.fromJson(parseBlock('accountsReceivable', 'accounts_receivable')),
      accountsPayable: SummaryBlock.fromJson(parseBlock('accountsPayable', 'accounts_payable')),
      cashBalance: SummaryBlock.fromJson(parseBlock('cashBalance', 'cash_balance')),
    );
  }
}

class SummaryBlock {
  final double amount;
  final double percentageChange;
  final bool statusFlag;

  SummaryBlock({
    required this.amount,
    required this.percentageChange,
    required this.statusFlag,
  });

  factory SummaryBlock.fromJson(Map<String, dynamic> json) {
    double parseDouble(dynamic value) {
      if (value == null) return 0.0;
      if (value is num) return value.toDouble();
      return double.tryParse(value.toString()) ?? 0.0;
    }

    bool parseBool(dynamic value) {
      if (value is bool) return value;
      if (value is String) {
        return value.toLowerCase() == 'true';
      }
      return false;
    }

    return SummaryBlock(
      amount: parseDouble(json['amount'] ?? json['amount'] ?? 0.0),
      percentageChange: parseDouble(json['percentageChange'] ?? json['percentage_change'] ?? 0.0),
      statusFlag: parseBool(json['isPositive'] ?? json['isIncrease'] ?? json['isDecrease'] ?? json['isOverdue'] ?? false),
    );
  }
}

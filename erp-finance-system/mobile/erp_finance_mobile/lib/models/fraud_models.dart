class TransactionItem {
  final String id;
  final double amount;
  final String? vendor;

  TransactionItem({
    required this.id,
    required this.amount,
    this.vendor,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'amount': amount,
      'vendor': vendor,
      'category': null,
    };
  }
}

class FraudDetectionRequest {
  final List<TransactionItem> transactions;

  FraudDetectionRequest({required this.transactions});

  Map<String, dynamic> toJson() {
    return {
      'transactions': transactions.map((transaction) => transaction.toJson()).toList(),
    };
  }
}

class FraudAlert {
  final String transactionId;
  final double amount;
  final double score;
  final String reason;

  FraudAlert({
    required this.transactionId,
    required this.amount,
    required this.score,
    required this.reason,
  });

  factory FraudAlert.fromJson(Map<String, dynamic> json) {
    return FraudAlert(
      transactionId: json['transaction_id'] as String,
      amount: (json['amount'] as num).toDouble(),
      score: (json['score'] as num).toDouble(),
      reason: json['reason'] as String,
    );
  }
}

class FraudDetectionResponse {
  final List<FraudAlert> flagged;
  final String summary;

  FraudDetectionResponse({
    required this.flagged,
    required this.summary,
  });

  factory FraudDetectionResponse.fromJson(Map<String, dynamic> json) {
    return FraudDetectionResponse(
      flagged: (json['flagged'] as List<dynamic>)
          .map((item) => FraudAlert.fromJson(item as Map<String, dynamic>))
          .toList(),
      summary: json['summary'] as String,
    );
  }
}

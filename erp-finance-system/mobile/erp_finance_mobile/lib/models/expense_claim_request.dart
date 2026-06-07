class ExpenseClaimRequest {
  final String invoiceNumber;
  final String vendorId;
  final double amount;
  final double taxAmount;
  final double totalAmount;
  final String invoiceDate;
  final String dueDate;
  final String description;

  ExpenseClaimRequest({
    required this.invoiceNumber,
    required this.vendorId,
    required this.amount,
    required this.taxAmount,
    required this.totalAmount,
    required this.invoiceDate,
    required this.dueDate,
    required this.description,
  });

  Map<String, dynamic> toJson() {
    return {
      'invoiceNumber': invoiceNumber,
      'vendorId': vendorId,
      'amount': amount,
      'taxAmount': taxAmount,
      'totalAmount': totalAmount,
      'invoiceDate': invoiceDate,
      'dueDate': dueDate,
      'description': description,
    };
  }
}

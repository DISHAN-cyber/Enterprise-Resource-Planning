class APInvoice {
  final String id;
  final String invoiceNumber;
  final String vendorName;
  final double amount;
  final double totalAmount;
  final String status;
  final String approvalStatus;
  final DateTime? dueDate;
  final String? description;

  APInvoice({
    required this.id,
    required this.invoiceNumber,
    required this.vendorName,
    required this.amount,
    required this.totalAmount,
    required this.status,
    required this.approvalStatus,
    this.dueDate,
    this.description,
  });

  factory APInvoice.fromJson(Map<String, dynamic> json) {
    return APInvoice(
      id: json['id']?.toString() ?? '',
      invoiceNumber: (json['invoiceNumber'] ?? json['invoice_number']) as String,
      vendorName: (json['vendorName'] ?? json['vendor_name']) as String,
      amount: (json['amount'] as num).toDouble(),
      totalAmount: json['totalAmount'] != null
          ? (json['totalAmount'] as num).toDouble()
          : (json['total_amount'] as num?)?.toDouble() ?? (json['amount'] as num).toDouble(),
      status: json['status']?.toString() ?? '',
      approvalStatus: (json['approvalStatus'] ?? json['approval_status'])?.toString() ?? '',
      dueDate: json['dueDate'] != null
          ? DateTime.parse(json['dueDate'] as String)
          : json['due_date'] != null
              ? DateTime.parse(json['due_date'] as String)
              : null,
      description: json['description'] as String?,
    );
  }
}

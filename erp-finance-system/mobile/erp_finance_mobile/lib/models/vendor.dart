class Vendor {
  final String id;
  final String vendorCode;
  final String vendorName;

  Vendor({
    required this.id,
    required this.vendorCode,
    required this.vendorName,
  });

  factory Vendor.fromJson(Map<String, dynamic> json) {
    return Vendor(
      id: json['id']?.toString() ?? '',
      vendorCode: (json['vendorCode'] ?? json['vendor_code']) as String,
      vendorName: (json['vendorName'] ?? json['vendor_name']) as String,
    );
  }
}

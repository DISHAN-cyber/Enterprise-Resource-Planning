class PendingAction {
  final String id;
  final String action;
  final String module;
  final String priority;
  final DateTime? dueDate;
  final String status;
  final String assignedTo;

  PendingAction({
    required this.id,
    required this.action,
    required this.module,
    required this.priority,
    this.dueDate,
    required this.status,
    required this.assignedTo,
  });

  factory PendingAction.fromJson(Map<String, dynamic> json) {
    return PendingAction(
      id: json['id']?.toString() ?? '',
      action: json['action'] as String,
      module: json['module'] as String,
      priority: json['priority']?.toString() ?? 'LOW',
      dueDate: json['dueDate'] != null ? DateTime.parse(json['dueDate'] as String) : null,
      status: json['status']?.toString() ?? 'PENDING',
      assignedTo: json['assignedTo'] as String,
    );
  }
}

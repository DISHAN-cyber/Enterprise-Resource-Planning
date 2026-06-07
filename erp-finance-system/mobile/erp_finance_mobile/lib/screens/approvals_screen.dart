import 'package:flutter/material.dart';

import '../models/ap_invoice.dart';
import '../services/api_service.dart';

class ApprovalsScreen extends StatefulWidget {
  const ApprovalsScreen({super.key});

  @override
  State<ApprovalsScreen> createState() => _ApprovalsScreenState();
}

class _ApprovalsScreenState extends State<ApprovalsScreen> {
  final ApiService _api = ApiService();
  List<APInvoice> _invoices = [];
  String? _error;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadInvoices();
  }

  Future<void> _loadInvoices() async {
    setState(() {
      _loading = true;
      _error = null;
    });

    try {
      final invoices = await _api.getPendingInvoices();
      setState(() {
        _invoices = invoices;
      });
    } catch (error) {
      setState(() {
        _error = error.toString();
      });
    } finally {
      setState(() {
        _loading = false;
      });
    }
  }

  Future<void> _handleAction(String id, bool approve) async {
    try {
      if (approve) {
        await _api.approveInvoice(id);
      } else {
        await _api.rejectInvoice(id);
      }
      await _loadInvoices();
    } catch (error) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(error.toString())));
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (_error != null) {
      return Center(child: Text(_error!));
    }

    if (_invoices.isEmpty) {
      return const Center(child: Text('No pending invoice approvals currently.'));
    }

    return RefreshIndicator(
      onRefresh: _loadInvoices,
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: _invoices.length,
        itemBuilder: (context, index) {
          final invoice = _invoices[index];
          return Card(
            margin: const EdgeInsets.only(bottom: 12),
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(invoice.invoiceNumber, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  Text('Vendor: ${invoice.vendorName}'),
                  Text('Amount: \$${invoice.amount.toStringAsFixed(2)}'),
                  Text('Total: \$${invoice.totalAmount.toStringAsFixed(2)}'),
                  Text('Status: ${invoice.status} • Approval: ${invoice.approvalStatus}'),
                  if (invoice.dueDate != null) Text('Due: ${invoice.dueDate!.toLocal().toString().split(' ').first}'),
                  if (invoice.description != null && invoice.description!.isNotEmpty) ...[
                    const SizedBox(height: 8),
                    Text(invoice.description!),
                  ],
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: ElevatedButton(
                          onPressed: () => _handleAction(invoice.id, true),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Theme.of(context).colorScheme.primary,
                          ),
                          child: const Text('Approve'),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: OutlinedButton(
                          onPressed: () => _handleAction(invoice.id, false),
                          child: const Text('Reject'),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}

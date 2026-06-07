import 'package:flutter/material.dart';

import '../services/api_service.dart';
import '../models/dashboard_summary.dart';
import '../models/pending_action.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  final ApiService _api = ApiService();
  DashboardSummary? _summary;
  List<PendingAction> _pendingActions = [];
  String? _error;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadDashboard();
  }

  Future<void> _loadDashboard() async {
    setState(() {
      _loading = true;
      _error = null;
    });

    try {
      final summary = await _api.getDashboardSummary();
      final pendingActions = await _api.getPendingActions();
      setState(() {
        _summary = summary;
        _pendingActions = pendingActions;
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

  Future<void> _completeAction(String actionId) async {
    try {
      await _api.completePendingAction(actionId);
      await _loadDashboard();
    } catch (error) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(error.toString())),
      );
    }
  }

  Widget _buildSummaryCard(String title, SummaryBlock block) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Text('\$${block.amount.toStringAsFixed(2)}', style: const TextStyle(fontSize: 18)),
            const SizedBox(height: 4),
            Text(
              'Change: ${block.percentageChange.toStringAsFixed(1)}%',
              style: TextStyle(
                color: block.statusFlag ? Colors.green : Colors.red,
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (_error != null) {
      return Center(child: Text(_error!));
    }

    return RefreshIndicator(
      onRefresh: _loadDashboard,
      child: SingleChildScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text('Financial summary', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            _buildSummaryCard('Revenue', _summary!.revenue),
            _buildSummaryCard('Receivables', _summary!.accountsReceivable),
            _buildSummaryCard('Payables', _summary!.accountsPayable),
            _buildSummaryCard('Cash Balance', _summary!.cashBalance),
            const SizedBox(height: 24),
            const Text('Pending Actions', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            if (_pendingActions.isEmpty)
              const Text('No pending actions at the moment.')
            else ..._pendingActions.map((action) {
              return Card(
                child: ListTile(
                  title: Text(action.action),
                  subtitle: Text('${action.module} • ${action.priority} • ${action.status}'),
                  trailing: ElevatedButton(
                    onPressed: action.status == 'COMPLETED'
                        ? null
                        : () => _completeAction(action.id),
                    child: const Text('Complete'),
                  ),
                ),
              );
            }).toList(),
          ],
        ),
      ),
    );
  }
}

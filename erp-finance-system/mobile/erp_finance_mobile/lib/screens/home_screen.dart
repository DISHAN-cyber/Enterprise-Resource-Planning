import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../models/cashflow_request.dart';
import '../models/cashflow_response.dart';
import '../models/fraud_models.dart';
import '../services/ai_service.dart';

class AiHomeScreen extends StatefulWidget {
  const AiHomeScreen({super.key});

  @override
  State<AiHomeScreen> createState() => _AiHomeScreenState();
}

class _AiHomeScreenState extends State<AiHomeScreen> {
  final _forecastFormKey = GlobalKey<FormState>();
  final _transactionFormKey = GlobalKey<FormState>();

  final _balanceController = TextEditingController();
  final _revenueController = TextEditingController();
  final _expenseController = TextEditingController();
  final _monthsController = TextEditingController(text: '6');

  final _transactionIdController = TextEditingController();
  final _transactionAmountController = TextEditingController();
  final _transactionVendorController = TextEditingController();

  bool _forecastLoading = false;
  bool _fraudLoading = false;

  CashflowResponse? _forecast;
  String? _recommendation;
  String? _forecastError;

  List<TransactionItem> _transactions = [];
  List<FraudAlert> _fraudAlerts = [];
  String? _fraudSummary;
  String? _fraudError;

  @override
  void initState() {
    super.initState();
    _loadPreferences();
  }

  @override
  void dispose() {
    _balanceController.dispose();
    _revenueController.dispose();
    _expenseController.dispose();
    _monthsController.dispose();
    _transactionIdController.dispose();
    _transactionAmountController.dispose();
    _transactionVendorController.dispose();
    super.dispose();
  }

  Future<void> _loadPreferences() async {
    final prefs = await SharedPreferences.getInstance();
    _balanceController.text = prefs.getDouble('last_balance')?.toStringAsFixed(2) ?? '';
    _revenueController.text = prefs.getDouble('last_revenue')?.toStringAsFixed(2) ?? '';
    _expenseController.text = prefs.getDouble('last_expense')?.toStringAsFixed(2) ?? '';
  }

  Future<void> _savePreferences() async {
    final prefs = await SharedPreferences.getInstance();
    prefs.setDouble('last_balance', double.tryParse(_balanceController.text) ?? 0.0);
    prefs.setDouble('last_revenue', double.tryParse(_revenueController.text) ?? 0.0);
    prefs.setDouble('last_expense', double.tryParse(_expenseController.text) ?? 0.0);
  }

  Future<void> _runForecast() async {
    if (!_forecastFormKey.currentState!.validate()) {
      return;
    }

    setState(() {
      _forecastLoading = true;
      _forecastError = null;
      _forecast = null;
      _recommendation = null;
    });

    try {
      final request = CashflowRequest(
        months: int.tryParse(_monthsController.text) ?? 6,
        currentBalance: double.parse(_balanceController.text),
        monthlyRevenue: double.parse(_revenueController.text),
        monthlyExpense: double.parse(_expenseController.text),
      );

      final response = await AiService().fetchCashflowForecast(request);
      await _savePreferences();

      setState(() {
        _forecast = response;
        _recommendation = response.recommendation;
      });
    } catch (error) {
      setState(() {
        _forecastError = error.toString();
      });
    } finally {
      setState(() {
        _forecastLoading = false;
      });
    }
  }

  Future<void> _runFraudDetection() async {
    if (_transactions.isEmpty) {
      setState(() {
        _fraudError = 'Add at least one transaction before running fraud detection.';
      });
      return;
    }

    setState(() {
      _fraudLoading = true;
      _fraudError = null;
      _fraudAlerts = [];
      _fraudSummary = null;
    });

    try {
      final request = FraudDetectionRequest(transactions: _transactions);
      final response = await AiService().detectFraud(request);

      setState(() {
        _fraudAlerts = response.flagged;
        _fraudSummary = response.summary;
      });
    } catch (error) {
      setState(() {
        _fraudError = error.toString();
      });
    } finally {
      setState(() {
        _fraudLoading = false;
      });
    }
  }

  void _addTransaction() {
    if (_transactionFormKey.currentState!.validate()) {
      setState(() {
        _transactions.add(TransactionItem(
          id: _transactionIdController.text.trim(),
          amount: double.parse(_transactionAmountController.text),
          vendor: _transactionVendorController.text.trim().isEmpty ? null : _transactionVendorController.text.trim(),
        ));
        _transactionIdController.clear();
        _transactionAmountController.clear();
        _transactionVendorController.clear();
      });
    }
  }

  void _removeTransaction(int index) {
    setState(() {
      _transactions.removeAt(index);
    });
  }

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('ERP Finance Mobile'),
          centerTitle: true,
          bottom: const TabBar(
            tabs: [
              Tab(text: 'Forecast'),
              Tab(text: 'Fraud'),
            ],
          ),
        ),
        body: TabBarView(
          children: [
            _buildForecastTab(context),
            _buildFraudTab(context),
          ],
        ),
      ),
    );
  }

  Widget _buildForecastTab(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        children: [
          Expanded(
            child: SingleChildScrollView(
              child: Form(
                key: _forecastFormKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    const Text(
                      'Cashflow Forecast',
                      style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 16),
                    _buildNumberField(
                      controller: _balanceController,
                      label: 'Current Balance',
                      hint: 'e.g. 12500',
                    ),
                    const SizedBox(height: 12),
                    _buildNumberField(
                      controller: _revenueController,
                      label: 'Monthly Revenue',
                      hint: 'e.g. 42000',
                    ),
                    const SizedBox(height: 12),
                    _buildNumberField(
                      controller: _expenseController,
                      label: 'Monthly Expense',
                      hint: 'e.g. 31000',
                    ),
                    const SizedBox(height: 12),
                    _buildNumberField(
                      controller: _monthsController,
                      label: 'Forecast Months',
                      hint: 'e.g. 6',
                      integerOnly: true,
                    ),
                    const SizedBox(height: 20),
                    ElevatedButton(
                      onPressed: _forecastLoading ? null : _runForecast,
                      child: _forecastLoading
                          ? const SizedBox(
                              height: 20,
                              width: 20,
                              child: CircularProgressIndicator(strokeWidth: 2),
                            )
                          : const Text('Run Forecast'),
                    ),
                    const SizedBox(height: 16),
                    if (_forecastError != null) ...[
                      Text(
                        _forecastError!,
                        style: const TextStyle(color: Colors.red),
                      ),
                      const SizedBox(height: 16),
                    ],
                    if (_recommendation != null) ...[
                      Card(
                        color: Colors.indigo.shade50,
                        child: Padding(
                          padding: const EdgeInsets.all(12.0),
                          child: Text(
                            _recommendation!,
                            style: const TextStyle(fontSize: 16),
                          ),
                        ),
                      ),
                      const SizedBox(height: 16),
                    ],
                    if (_forecast != null) ...[
                      const Text(
                        'Forecast Results',
                        style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 10),
                      ..._forecast!.forecast.map(_buildForecastRow),
                    ],
                  ],
                ),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 8.0),
            child: Text(
              'Backend host: 10.0.2.2:8000 when running on Android emulator',
              style: TextStyle(color: Colors.grey.shade600),
              textAlign: TextAlign.center,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFraudTab(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        children: [
          Expanded(
            child: SingleChildScrollView(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  const Text(
                    'Fraud Detection',
                    style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 16),
                  Form(
                    key: _transactionFormKey,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        _buildTextField(
                          controller: _transactionIdController,
                          label: 'Transaction ID',
                          hint: 'e.g. TXN-1001',
                        ),
                        const SizedBox(height: 12),
                        _buildNumberField(
                          controller: _transactionAmountController,
                          label: 'Amount',
                          hint: 'e.g. 1250.75',
                        ),
                        const SizedBox(height: 12),
                        _buildTextField(
                          controller: _transactionVendorController,
                          label: 'Vendor',
                          hint: 'e.g. Supply Co.',
                        ),
                        const SizedBox(height: 16),
                        Row(
                          children: [
                            Expanded(
                              child: ElevatedButton(
                                onPressed: _addTransaction,
                                child: const Text('Add Transaction'),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),
                  if (_transactions.isNotEmpty) ...[
                    const Text(
                      'Transactions',
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 10),
                    ..._transactions.asMap().entries.map((entry) {
                      final index = entry.key;
                      final transaction = entry.value;
                      return Card(
                        margin: const EdgeInsets.only(bottom: 10),
                        child: ListTile(
                          title: Text(transaction.id),
                          subtitle: Text('Vendor: ${transaction.vendor ?? 'Unknown'} • Amount: \$${transaction.amount.toStringAsFixed(2)}'),
                          trailing: IconButton(
                            icon: const Icon(Icons.delete_outline),
                            onPressed: () => _removeTransaction(index),
                          ),
                        ),
                      );
                    }),
                    const SizedBox(height: 12),
                    ElevatedButton(
                      onPressed: _fraudLoading ? null : _runFraudDetection,
                      child: _fraudLoading
                          ? const SizedBox(
                              height: 20,
                              width: 20,
                              child: CircularProgressIndicator(strokeWidth: 2),
                            )
                          : const Text('Run Fraud Detection'),
                    ),
                  ],
                  if (_fraudError != null) ...[
                    const SizedBox(height: 16),
                    Text(
                      _fraudError!,
                      style: const TextStyle(color: Colors.red),
                    ),
                  ],
                  if (_fraudSummary != null) ...[
                    const SizedBox(height: 16),
                    Card(
                      color: Colors.grey.shade100,
                      child: Padding(
                        padding: const EdgeInsets.all(12.0),
                        child: Text(_fraudSummary!),
                      ),
                    ),
                  ],
                  if (_fraudAlerts.isNotEmpty) ...[
                    const SizedBox(height: 16),
                    const Text(
                      'Flagged Transactions',
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 10),
                    ..._fraudAlerts.map((alert) {
                      return Card(
                        margin: const EdgeInsets.only(bottom: 10),
                        child: ListTile(
                          title: Text(alert.transactionId),
                          subtitle: Text(alert.reason),
                          trailing: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            crossAxisAlignment: CrossAxisAlignment.end,
                            children: [
                              Text('Amount: \$${alert.amount.toStringAsFixed(2)}'),
                              const SizedBox(height: 4),
                              Text('Score: ${alert.score.toStringAsFixed(2)}'),
                            ],
                          ),
                        ),
                      );
                    }),
                  ],
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String label,
    String? hint,
  }) {
    return TextFormField(
      controller: controller,
      decoration: InputDecoration(
        labelText: label,
        hintText: hint,
        border: const OutlineInputBorder(),
      ),
      validator: (value) {
        if (value == null || value.isEmpty) {
          return 'Enter $label';
        }
        return null;
      },
    );
  }

  Widget _buildNumberField({
    required TextEditingController controller,
    required String label,
    String? hint,
    bool integerOnly = false,
  }) {
    return TextFormField(
      controller: controller,
      keyboardType: TextInputType.numberWithOptions(decimal: !integerOnly),
      decoration: InputDecoration(
        labelText: label,
        hintText: hint,
        border: const OutlineInputBorder(),
      ),
      validator: (value) {
        if (value == null || value.isEmpty) {
          return 'Enter $label';
        }
        final number = num.tryParse(value);
        if (number == null) {
          return 'Enter a valid number';
        }
        return null;
      },
    );
  }

  Widget _buildForecastRow(CashflowProjection projection) {
    return Card(
      elevation: 1,
      margin: const EdgeInsets.symmetric(vertical: 6),
      child: ListTile(
        title: Text('Month ${projection.month}'),
        subtitle: Text('Revenue: \$${projection.revenue.toStringAsFixed(2)} • Expense: \$${projection.expense.toStringAsFixed(2)}'),
        trailing: Text(
          '\$${projection.projectedBalance.toStringAsFixed(2)}',
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
      ),
    );
  }
}

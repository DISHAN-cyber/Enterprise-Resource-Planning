import 'package:flutter/material.dart';

import '../models/expense_claim_request.dart';
import '../models/vendor.dart';
import '../services/api_service.dart';

class ExpenseClaimScreen extends StatefulWidget {
  const ExpenseClaimScreen({super.key});

  @override
  State<ExpenseClaimScreen> createState() => _ExpenseClaimScreenState();
}

class _ExpenseClaimScreenState extends State<ExpenseClaimScreen> {
  final _formKey = GlobalKey<FormState>();
  final _invoiceNumberController = TextEditingController();
  final _amountController = TextEditingController();
  final _taxController = TextEditingController(text: '0.00');
  final _descriptionController = TextEditingController();
  final ApiService _api = ApiService();

  List<Vendor> _vendors = [];
  Vendor? _selectedVendor;
  bool _loading = true;
  bool _submitting = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadVendors();
  }

  @override
  void dispose() {
    _invoiceNumberController.dispose();
    _amountController.dispose();
    _taxController.dispose();
    _descriptionController.dispose();
    super.dispose();
  }

  Future<void> _loadVendors() async {
    setState(() {
      _loading = true;
      _error = null;
    });

    try {
      final vendors = await _api.getVendors();
      setState(() {
        _vendors = vendors;
        if (_vendors.isNotEmpty) {
          _selectedVendor = _vendors.first;
        }
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

  Future<void> _submitClaim() async {
    if (!_formKey.currentState!.validate()) return;
    if (_selectedVendor == null) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Select a vendor to submit the claim.')));
      return;
    }

    setState(() {
      _submitting = true;
    });

    try {
      final amount = double.parse(_amountController.text);
      final taxAmount = double.tryParse(_taxController.text) ?? 0.0;
      final totalAmount = amount + taxAmount;
      final now = DateTime.now();
      final dueDate = now.add(const Duration(days: 30));
      final request = ExpenseClaimRequest(
        invoiceNumber: _invoiceNumberController.text.trim().isEmpty
            ? 'CLM-${DateTime.now().millisecondsSinceEpoch}'
            : _invoiceNumberController.text.trim(),
        vendorId: _selectedVendor!.id,
        amount: amount,
        taxAmount: taxAmount,
        totalAmount: totalAmount,
        invoiceDate: now.toIso8601String().split('T').first,
        dueDate: dueDate.toIso8601String().split('T').first,
        description: _descriptionController.text.trim(),
      );

      await _api.submitExpenseClaim(request);
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Expense claim submitted successfully.')));
      _formKey.currentState!.reset();
      _taxController.text = '0.00';
    } catch (error) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(error.toString())));
    } finally {
      if (mounted) {
        setState(() {
          _submitting = false;
        });
      }
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

    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: SingleChildScrollView(
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Text('Submit Expense Claim', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
              const SizedBox(height: 16),
              DropdownButtonFormField<Vendor>(
                value: _selectedVendor,
                decoration: const InputDecoration(labelText: 'Vendor', border: OutlineInputBorder()),
                items: _vendors.map((vendor) {
                  return DropdownMenuItem(value: vendor, child: Text(vendor.vendorName));
                }).toList(),
                onChanged: (value) {
                  setState(() {
                    _selectedVendor = value;
                  });
                },
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _invoiceNumberController,
                decoration: const InputDecoration(labelText: 'Invoice number', border: OutlineInputBorder()),
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _amountController,
                keyboardType: const TextInputType.numberWithOptions(decimal: true),
                decoration: const InputDecoration(labelText: 'Amount', border: OutlineInputBorder()),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Enter claim amount';
                  }
                  if (double.tryParse(value) == null) {
                    return 'Enter a valid number';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _taxController,
                keyboardType: const TextInputType.numberWithOptions(decimal: true),
                decoration: const InputDecoration(labelText: 'Tax amount', border: OutlineInputBorder()),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Enter a tax amount';
                  }
                  if (double.tryParse(value) == null) {
                    return 'Enter a valid number';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _descriptionController,
                decoration: const InputDecoration(labelText: 'Description', border: OutlineInputBorder()),
                maxLines: 3,
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: _submitting ? null : _submitClaim,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Theme.of(context).colorScheme.primary,
                ),
                child: _submitting
                    ? const SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                      )
                    : const Text('Submit Claim'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class CashflowRequest {
  final int months;
  final double currentBalance;
  final double monthlyRevenue;
  final double monthlyExpense;
  final double revenueGrowthRate;
  final double expenseGrowthRate;

  CashflowRequest({
    required this.months,
    required this.currentBalance,
    required this.monthlyRevenue,
    required this.monthlyExpense,
    this.revenueGrowthRate = 0.0,
    this.expenseGrowthRate = 0.0,
  });

  Map<String, dynamic> toJson() {
    return {
      'months': months,
      'current_balance': currentBalance,
      'monthly_revenue': monthlyRevenue,
      'monthly_expense': monthlyExpense,
      'revenue_growth_rate': revenueGrowthRate,
      'expense_growth_rate': expenseGrowthRate,
      'seasonality': [],
    };
  }
}

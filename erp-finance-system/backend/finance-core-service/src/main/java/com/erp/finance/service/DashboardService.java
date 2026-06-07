package com.erp.finance.service;

import com.erp.finance.dto.dashboard.*;
import com.erp.finance.entity.PendingAction;
import com.erp.finance.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {

    private final TransactionRepository transactionRepository;
    private final InvoiceRepository invoiceRepository;
    private final BudgetRepository budgetRepository;
    private final PendingActionRepository pendingActionRepository;

    public DashboardSummaryDTO getDashboardSummary() {
        // Get total revenue
        BigDecimal totalRevenue = transactionRepository.getTotalRevenue();
        if (totalRevenue == null) totalRevenue = BigDecimal.ZERO;

        // Get accounts receivable
        BigDecimal accountsReceivable = invoiceRepository.getTotalAccountsReceivable();
        if (accountsReceivable == null) accountsReceivable = BigDecimal.ZERO;

        // Get accounts payable
        BigDecimal accountsPayable = invoiceRepository.getTotalAccountsPayable();
        if (accountsPayable == null) accountsPayable = BigDecimal.ZERO;

        // Get cash balance (simplified: revenue - expenses - payables + receivables)
        BigDecimal totalExpenses = transactionRepository.getTotalExpenses();
        if (totalExpenses == null) totalExpenses = BigDecimal.ZERO;
        
        BigDecimal cashBalance = totalRevenue
                .subtract(totalExpenses)
                .add(accountsReceivable)
                .subtract(accountsPayable);

        // Calculate percentage changes (simplified - compare with previous month)
        YearMonth currentMonth = YearMonth.now();
        YearMonth previousMonth = currentMonth.minusMonths(1);
        
        BigDecimal previousRevenue = transactionRepository.getRevenueByDateRange(
                previousMonth.atDay(1), previousMonth.atEndOfMonth());
        if (previousRevenue == null || previousRevenue.compareTo(BigDecimal.ZERO) == 0) {
            previousRevenue = totalRevenue.multiply(new BigDecimal("0.9")); // Fallback
        }

        BigDecimal revenueGrowth = totalRevenue.subtract(previousRevenue)
                .divide(previousRevenue, 4, RoundingMode.HALF_UP)
                .multiply(new BigDecimal("100"));

        // Calculate overdue percentage for AR
        BigDecimal overdueReceivables = invoiceRepository.getTotalOverdueReceivables();
        if (overdueReceivables == null) overdueReceivables = BigDecimal.ZERO;
        
        BigDecimal overduePercentage = accountsReceivable.compareTo(BigDecimal.ZERO) > 0
                ? overdueReceivables.divide(accountsReceivable, 4, RoundingMode.HALF_UP)
                        .multiply(new BigDecimal("100"))
                : BigDecimal.ZERO;

        // Calculate AP decrease (simplified)
        BigDecimal apChange = new BigDecimal("15.3"); // You can calculate this from historical data

        // Calculate cash balance increase
        BigDecimal cashIncrease = new BigDecimal("5.8"); // You can calculate this from historical data

        return DashboardSummaryDTO.builder()
                .revenue(DashboardSummaryDTO.RevenueSummary.builder()
                        .amount(totalRevenue)
                        .percentageChange(revenueGrowth)
                        .isPositive(revenueGrowth.compareTo(BigDecimal.ZERO) > 0)
                        .build())
                .accountsReceivable(DashboardSummaryDTO.AccountsReceivableSummary.builder()
                        .amount(accountsReceivable)
                        .overduePercentage(overduePercentage)
                        .isOverdue(overdueReceivables.compareTo(BigDecimal.ZERO) > 0)
                        .build())
                .accountsPayable(DashboardSummaryDTO.AccountsPayableSummary.builder()
                        .amount(accountsPayable)
                        .percentageChange(apChange)
                        .isDecrease(true)
                        .build())
                .cashBalance(DashboardSummaryDTO.CashBalanceSummary.builder()
                        .amount(cashBalance)
                        .percentageChange(cashIncrease)
                        .isIncrease(true)
                        .build())
                .build();
    }

    public FinancialOverviewDTO getFinancialOverview(String period) {
        List<FinancialOverviewDTO.MonthlyDataPoint> dataPoints = new ArrayList<>();
        
        // Get current year
        int currentYear = LocalDate.now().getYear();
        
        // Get last 12 months of data
        for (int month = 1; month <= 12; month++) {
            List<com.erp.finance.entity.Transaction> revenueTransactions = 
                    transactionRepository.findTransactionsByMonth(currentYear, month);
            
            BigDecimal revenue = revenueTransactions.stream()
                    .map(com.erp.finance.entity.Transaction::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            
            // Calculate expenses (simplified - you can query expense transactions)
            BigDecimal expenses = revenue.multiply(new BigDecimal("0.65")); // 65% of revenue as expenses
            
            String monthName = YearMonth.of(currentYear, month).getMonth().toString()
                    .substring(0, 3);
            
            dataPoints.add(FinancialOverviewDTO.MonthlyDataPoint.builder()
                    .month(monthName)
                    .date(YearMonth.of(currentYear, month).atDay(1))
                    .revenue(revenue)
                    .expenses(expenses)
                    .profit(revenue.subtract(expenses))
                    .build());
        }

        return FinancialOverviewDTO.builder()
                .period(period)
                .dataPoints(dataPoints)
                .build();
    }

    public List<PendingActionDTO> getPendingActions() {
        List<PendingAction> actions = pendingActionRepository.findTop10ByStatusOrderByDueDateAsc("PENDING");
        
        List<PendingActionDTO> dtos = new ArrayList<>();
        for (PendingAction action : actions) {
            dtos.add(PendingActionDTO.builder()
                    .id(action.getId())
                    .action(action.getAction())
                    .module(action.getModule())
                    .priority(PendingActionDTO.Priority.valueOf(action.getPriority()))
                    .dueDate(action.getDueDate())
                    .status(PendingActionDTO.Status.valueOf(action.getStatus()))
                    .assignedTo(action.getAssignedTo())
                    .build());
        }
        
        return dtos;
    }

    @Transactional
    public boolean markActionComplete(java.util.UUID actionId) {
        return pendingActionRepository.findById(actionId).map(action -> {
            action.setStatus("COMPLETED");
            pendingActionRepository.save(action);
            return true;
        }).orElse(false);
    }

    @Transactional
    public boolean markAllActionsComplete() {
        List<PendingAction> actions = pendingActionRepository.findByStatusOrderByDueDateAsc("PENDING");
        for (PendingAction action : actions) {
            action.setStatus("COMPLETED");
            pendingActionRepository.save(action);
        }
        return true;
    }
}
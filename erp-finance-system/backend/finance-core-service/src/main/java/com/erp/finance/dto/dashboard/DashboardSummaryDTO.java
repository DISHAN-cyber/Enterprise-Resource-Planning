package com.erp.finance.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummaryDTO {
    private RevenueSummary revenue;
    private AccountsReceivableSummary accountsReceivable;
    private AccountsPayableSummary accountsPayable;
    private CashBalanceSummary cashBalance;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RevenueSummary {
        private BigDecimal amount;
        private BigDecimal percentageChange;
        private boolean isPositive;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AccountsReceivableSummary {
        private BigDecimal amount;
        private BigDecimal overduePercentage;
        private boolean isOverdue;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AccountsPayableSummary {
        private BigDecimal amount;
        private BigDecimal percentageChange;
        private boolean isDecrease;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CashBalanceSummary {
        private BigDecimal amount;
        private BigDecimal percentageChange;
        private boolean isIncrease;
    }
}
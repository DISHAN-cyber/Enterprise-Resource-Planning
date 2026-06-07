package com.erp.finance.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FinancialOverviewDTO {
    private String period;
    private List<MonthlyDataPoint> dataPoints;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MonthlyDataPoint {
        private String month;
        private LocalDate date;
        private BigDecimal revenue;
        private BigDecimal expenses;
        private BigDecimal profit;
    }
}
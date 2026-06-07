package com.erp.finance_service.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardResponse {
    private String welcomeMessage;
    private String companyName;
    private String totalRevenue;
    private String accountsReceivable;
    private String accountsPayable;
    private int openTasks;
    private String userName;
}

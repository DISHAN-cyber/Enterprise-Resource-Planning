package com.erp.finance.dto;

import com.erp.finance.entity.AccountType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccountDTO {
    private UUID id;
    private String accountCode;
    private String accountName;
    private AccountType type;
    private String subType;
    private BigDecimal balance;
    private BigDecimal debitBalance;
    private BigDecimal creditBalance;
    private UUID parentAccountId;
    private String parentAccountCode;
    private String parentAccountName;
    private String description;
    private Boolean isActive;
    private Boolean isSystemAccount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
package com.erp.finance.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccountHierarchyDTO {
    private UUID id;
    private String accountCode;
    private String accountName;
    private BigDecimal balance;
    private List<AccountHierarchyDTO> children;
}
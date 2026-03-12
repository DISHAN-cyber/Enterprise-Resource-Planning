package com.erp.finance.dto;

import com.erp.finance.model.AccountType;
import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
public class ChartOfAccountDTO {

    private Long id;

    @NotBlank(message = "Account code is required")
    private String accountCode;

    @NotBlank(message = "Account name is required")
    private String accountName;

    @NotNull(message = "Account type is required")
    private AccountType accountType;

    private Long parentAccountId;

    private Boolean isActive = true;
}
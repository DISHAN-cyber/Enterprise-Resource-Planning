package com.erp.finance.dto;

import com.erp.finance.entity.AccountType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccountRequestDTO {

    @NotBlank(message = "Account code is required")
    @Size(max = 20, message = "Account code must not exceed 20 characters")
    @Pattern(regexp = "^[0-9]+$", message = "Account code must contain only numbers")
    private String accountCode;

    @NotBlank(message = "Account name is required")
    @Size(max = 255, message = "Account name must not exceed 255 characters")
    private String accountName;

    @NotNull(message = "Account type is required")
    private AccountType type;

    @Size(max = 100, message = "Sub-type must not exceed 100 characters")
    private String subType;

    private BigDecimal balance;

    private UUID parentAccountId;

    @Size(max = 500, message = "Description must not exceed 500 characters")
    private String description;

    private Boolean active;
}
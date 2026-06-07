package com.erp.finance.dto;

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
public class APInvoiceLineDTO {
    private UUID id;
    private String description;
    private BigDecimal amount;
    private Integer quantity;
    private BigDecimal unitPrice;
}
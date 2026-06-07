package com.erp.finance.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class APInvoiceRequestDTO {
    
    @NotBlank(message = "Invoice number is required")
    @Size(max = 100, message = "Invoice number must not exceed 100 characters")
    private String invoiceNumber;
    
    @NotNull(message = "Vendor is required")
    private UUID vendorId;
    
    @NotNull(message = "Amount is required")
    private BigDecimal amount;
    
    private BigDecimal taxAmount;
    
    private BigDecimal totalAmount;
    
    @NotNull(message = "Invoice date is required")
    private LocalDate invoiceDate;
    
    @NotNull(message = "Due date is required")
    private LocalDate dueDate;
    
    private String description;
    
    @Valid
    private List<APInvoiceLineRequestDTO> lines;
}
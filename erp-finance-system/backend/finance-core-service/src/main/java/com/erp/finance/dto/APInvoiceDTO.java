package com.erp.finance.dto;

import com.erp.finance.entity.APInvoiceStatus;
import com.erp.finance.entity.ApprovalStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class APInvoiceDTO {
    private UUID id;
    private String invoiceNumber;
    private UUID vendorId;
    private String vendorName;
    private BigDecimal amount;
    private BigDecimal taxAmount;
    private BigDecimal totalAmount;
    private LocalDate invoiceDate;
    private LocalDate dueDate;
    private String description;
    private APInvoiceStatus status;
    private ApprovalStatus approvalStatus;
    private UUID approvedBy;
    private LocalDateTime approvedAt;
    private List<APInvoiceLineDTO> lines;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean isOverdue;
}
package com.erp.ap.dto;
import com.erp.ap.entity.InvoiceStatus;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record InvoiceDTO(
    UUID id,
    UUID vendorId,
    String vendorName,
    String invoiceNumber,
    LocalDate issueDate,
    LocalDate dueDate,
    BigDecimal totalAmount,
    InvoiceStatus status,
    String approvedBy,
    LocalDate approvedAt
) {}
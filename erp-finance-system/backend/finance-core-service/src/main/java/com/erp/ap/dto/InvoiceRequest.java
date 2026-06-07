package com.erp.ap.dto;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record InvoiceRequest(
    UUID vendorId,
    String invoiceNumber,
    LocalDate issueDate,
    LocalDate dueDate,
    BigDecimal totalAmount
) {}
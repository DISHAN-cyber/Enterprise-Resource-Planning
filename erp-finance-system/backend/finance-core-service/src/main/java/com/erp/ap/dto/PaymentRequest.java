package com.erp.ap.dto;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record PaymentRequest(
    UUID invoiceId,
    BigDecimal amount,
    LocalDate paymentDate,
    String reference,
    String notes
) {}
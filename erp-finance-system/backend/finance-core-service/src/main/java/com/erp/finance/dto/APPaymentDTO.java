package com.erp.finance.dto;

import com.erp.finance.entity.PaymentMethod;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class APPaymentDTO {
    private UUID id;
    private String paymentNumber;
    private UUID invoiceId;
    private String invoiceNumber;
    private UUID vendorId;
    private String vendorName;
    private BigDecimal amount;
    private LocalDate paymentDate;
    private PaymentMethod paymentMethod;
    private String referenceNumber;
    private String notes;
    private LocalDateTime createdAt;
}
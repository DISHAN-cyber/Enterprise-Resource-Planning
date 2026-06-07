package com.erp.finance.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "invoices")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Invoice {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String type; // ACCOUNTS_RECEIVABLE, ACCOUNTS_PAYABLE

    @Column(nullable = false, length = 100)
    private String invoiceNumber;

    @Column(nullable = false, length = 255)
    private String partyName;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false)
    private LocalDate dueDate;

    @Column(nullable = false)
    private LocalDate issueDate;

    @Column(nullable = false)
    private String status; // PAID, UNPAID, OVERDUE, PARTIAL

    @Column(precision = 15, scale = 2)
    private BigDecimal paidAmount;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDate createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDate.now();
    }
}
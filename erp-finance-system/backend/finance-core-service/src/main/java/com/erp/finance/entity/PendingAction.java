package com.erp.finance.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "pending_actions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PendingAction {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 255)
    private String action;

    @Column(nullable = false, length = 100)
    private String module;

    @Column(nullable = false)
    private String priority; // HIGH, MEDIUM, LOW

    @Column(nullable = false)
    private LocalDate dueDate;

    @Column(nullable = false)
    private String status; // PENDING, IN_PROGRESS, COMPLETED

    @Column(length = 100)
    private String assignedTo;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDate createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDate.now();
    }
}
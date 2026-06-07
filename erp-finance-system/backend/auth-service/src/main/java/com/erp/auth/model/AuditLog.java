package com.erp.auth.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "audit_logs", indexes = {
    @Index(name = "idx_audit_user_id", columnList = "user_id"),
    @Index(name = "idx_audit_event_type", columnList = "event_type"),
    @Index(name = "idx_audit_timestamp", columnList = "created_at")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String eventType;  // LOGIN_SUCCESS, LOGIN_FAILED, PASSWORD_CHANGED, etc.

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "user_id")
    private UUID userId;  // Nullable for failed login attempts

    @Column(name = "user_email")
    private String userEmail;

    @Column(name = "ip_address", length = 45)  // IPv6 support
    private String ipAddress;

    @Column(name = "user_agent", columnDefinition = "TEXT")
    private String userAgent;

    @Column(nullable = false)
    private Boolean success;

    @Column(name = "failure_reason", length = 255)
    private String failureReason;

    @Column(name = "metadata", columnDefinition = "JSONB")
    private String metadata;  // Store additional JSON data

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
package com.erp.finance.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "chart_of_accounts")
@NoArgsConstructor
@AllArgsConstructor
public class ChartOfAccount {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "account_code", unique = true, nullable = false, length = 20)
    private String accountCode;
    
    @Column(name = "account_name", nullable = false)
    private String accountName;
    
    @Column(name = "account_type", nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    private AccountType accountType;
    
    @ManyToOne
    @JoinColumn(name = "parent_account_id")
    private ChartOfAccount parentAccount;
    
    @Column(name = "is_active")
    private Boolean isActive = true;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
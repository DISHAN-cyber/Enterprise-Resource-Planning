package com.erp.auth.repository;

import com.erp.auth.model.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, UUID> {
    
    List<AuditLog> findByUserIdOrderByCreatedAtDesc(UUID userId);
    
    List<AuditLog> findByEventTypeAndCreatedAtAfter(String eventType, LocalDateTime since);
    
    List<AuditLog> findBySuccessFalseAndCreatedAtAfter(Boolean success, LocalDateTime since);
    
    @Query("SELECT a FROM AuditLog a WHERE a.userEmail = :email ORDER BY a.createdAt DESC")
    List<AuditLog> findByUserEmailOrderByCreatedAtDesc(String email);
    
    long countByEventTypeAndCreatedAtAfter(String eventType, LocalDateTime since);
}
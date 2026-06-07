package com.erp.finance_service.repository;

import com.erp.finance_service.model.ComplianceLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface ComplianceLogRepository extends JpaRepository<ComplianceLog, Long> {
    List<ComplianceLog> findByUserId(Long userId);
    List<ComplianceLog> findByEventType(String eventType);
    List<ComplianceLog> findByEntityTypeAndEntityId(String entityType, Long entityId);
    List<ComplianceLog> findByTimestampBetween(Instant start, Instant end);
}
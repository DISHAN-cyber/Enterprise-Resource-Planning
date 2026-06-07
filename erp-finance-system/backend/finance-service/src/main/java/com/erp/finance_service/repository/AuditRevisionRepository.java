package com.erp.finance_service.repository;

import com.erp.finance_service.model.AuditRevision;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditRevisionRepository extends JpaRepository<AuditRevision, Long> {
    List<AuditRevision> findByEntityNameAndEntityId(String entityName, Long entityId);
    List<AuditRevision> findByChangedById(Long userId);
    List<AuditRevision> findByEntityName(String entityName);
}
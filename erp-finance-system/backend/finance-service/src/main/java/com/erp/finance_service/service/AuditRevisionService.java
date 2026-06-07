package com.erp.finance_service.service;

import com.erp.finance_service.model.AuditRevision;
import com.erp.finance_service.model.User;
import com.erp.finance_service.repository.AuditRevisionRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AuditRevisionService {

    private final AuditRevisionRepository auditRevisionRepository;
    private final UserService userService;

    public AuditRevisionService(AuditRevisionRepository auditRevisionRepository, UserService userService) {
        this.auditRevisionRepository = auditRevisionRepository;
        this.userService = userService;
    }

    public List<AuditRevision> getAllRevisions() {
        return auditRevisionRepository.findAll();
    }

    public Optional<AuditRevision> getRevisionById(Long id) {
        return auditRevisionRepository.findById(id);
    }

    public List<AuditRevision> getRevisionsByUser(Long userId) {
        return auditRevisionRepository.findByChangedById(userId);
    }

    public List<AuditRevision> getRevisionsByDateRange(Instant start, Instant end) {
        return auditRevisionRepository.findAll().stream()
                .filter(revision -> revision.getRevisionTimestamp() != null
                        && !revision.getRevisionTimestamp().isBefore(start)
                        && !revision.getRevisionTimestamp().isAfter(end))
                .collect(Collectors.toList());
    }

    public List<AuditRevision> getRevisionsForEntity(String entityType, Long entityId) {
        return auditRevisionRepository.findByEntityNameAndEntityId(entityType, entityId);
    }

    @Transactional
    public AuditRevision createRevision(String entityType, Long entityId, String action) {
        User currentUser = null;
        try {
            currentUser = userService.getCurrentUser();
        } catch (Exception e) {
            // User might not be authenticated
        }

        AuditRevision revision = AuditRevision.builder()
            .entityName(entityType)
            .entityId(entityId)
            .revisionType(action)
            .build();
        if (currentUser != null) {
            revision.setChangedBy(currentUser);
        }

        return auditRevisionRepository.save(revision);
    }

    @Transactional
    public AuditRevision logCreate(String entityType, Long entityId) {
        return createRevision(entityType, entityId, "CREATE");
    }

    @Transactional
    public AuditRevision logUpdate(String entityType, Long entityId) {
        return createRevision(entityType, entityId, "UPDATE");
    }

    @Transactional
    public AuditRevision logDelete(String entityType, Long entityId) {
        return createRevision(entityType, entityId, "DELETE");
    }
}
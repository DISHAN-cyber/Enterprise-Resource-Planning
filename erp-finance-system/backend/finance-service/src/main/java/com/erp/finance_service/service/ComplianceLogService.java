package com.erp.finance_service.service;

import com.erp.finance_service.model.ComplianceLog;
import com.erp.finance_service.model.User;
import com.erp.finance_service.repository.ComplianceLogRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@Service
public class ComplianceLogService {

    private final ComplianceLogRepository complianceLogRepository;
    private final UserService userService;

    public ComplianceLogService(ComplianceLogRepository complianceLogRepository, UserService userService) {
        this.complianceLogRepository = complianceLogRepository;
        this.userService = userService;
    }

    public List<ComplianceLog> getAllLogs() {
        return complianceLogRepository.findAll();
    }

    public List<ComplianceLog> getLogsByUser(Long userId) {
        return complianceLogRepository.findByUserId(userId);
    }

    public List<ComplianceLog> getLogsByEventType(String eventType) {
        return complianceLogRepository.findByEventType(eventType);
    }

    public List<ComplianceLog> getLogsByEntity(String entityType, Long entityId) {
        return complianceLogRepository.findByEntityTypeAndEntityId(entityType, entityId);
    }

    public List<ComplianceLog> getLogsByDateRange(Instant start, Instant end) {
        return complianceLogRepository.findByTimestampBetween(start, end);
    }

    @Transactional
    public ComplianceLog logEvent(String eventType, String entityType, Long entityId, 
                                   Map<String, Object> details, String ipAddress) {
        User currentUser = null;
        try {
            currentUser = userService.getCurrentUser();
        } catch (Exception e) {
            // User might not be authenticated for some events
        }

        ComplianceLog log = ComplianceLog.builder()
                .eventType(eventType)
                .user(currentUser)
                .entityType(entityType)
                .entityId(entityId)
                .details(details)
                .ipAddress(ipAddress)
                .build();

        return complianceLogRepository.save(log);
    }

    @Transactional
    public ComplianceLog logLogin(String ipAddress) {
        return logEvent("LOGIN", "USER", null, Map.of("event", "user_login"), ipAddress);
    }

    @Transactional
    public ComplianceLog logLogout(String ipAddress) {
        return logEvent("LOGOUT", "USER", null, Map.of("event", "user_logout"), ipAddress);
    }

    @Transactional
    public ComplianceLog logDataChange(String entityType, Long entityId, 
                                        Map<String, Object> changes, String ipAddress) {
        return logEvent("DATA_CHANGE", entityType, entityId, changes, ipAddress);
    }
}
package com.erp.auth.service;

import com.erp.auth.model.AuditLog;
import com.erp.auth.repository.AuditLogRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    @Async
    @Transactional(propagation = Propagation.REQUIRES_NEW)  // Log even if main transaction fails
    public void logEvent(String eventType, String description, UUID userId, 
                        String userEmail, Boolean success, String failureReason) {
        try {
            HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder
                    .currentRequestAttributes()).getRequest();

            AuditLog auditLog = AuditLog.builder()
                    .eventType(eventType)
                    .description(description)
                    .userId(userId)
                    .userEmail(userEmail)
                    .ipAddress(request.getRemoteAddr())
                    .userAgent(request.getHeader("User-Agent"))
                    .success(success)
                    .failureReason(failureReason)
                    .build();

            auditLogRepository.save(auditLog);
            log.info("Audit: {} - {} - Success: {}", eventType, description, success);
            
        } catch (Exception e) {
            log.error("Failed to save audit log", e);
            // Don't rethrow - audit failure shouldn't break main flow
        }
    }

    // Convenience methods
    public void logLoginSuccess(UUID userId, String email) {
        logEvent("LOGIN_SUCCESS", "User logged in", userId, email, true, null);
    }

    public void logLoginFailed(String email, String reason) {
        logEvent("LOGIN_FAILED", "Login attempt failed", null, email, false, reason);
    }

    public void logPasswordChanged(UUID userId, String email) {
        logEvent("PASSWORD_CHANGED", "Password updated", userId, email, true, null);
    }

    public void logPasswordResetRequested(String email) {
        logEvent("PASSWORD_RESET_REQUESTED", "Password reset requested", null, email, true, null);
    }

    public void logPasswordResetSuccess(UUID userId, String email) {
        logEvent("PASSWORD_RESET_SUCCESS", "Password reset completed", userId, email, true, null);
    }

    public void logLogout(UUID userId, String email) {
        logEvent("LOGOUT", "User logged out", userId, email, true, null);
    }
}
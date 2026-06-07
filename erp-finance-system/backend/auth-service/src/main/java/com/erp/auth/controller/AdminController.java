package com.erp.auth.controller;

import com.erp.auth.dto.MessageResponse;
import com.erp.auth.dto.UserProfileResponse;
import com.erp.auth.model.Role;
import com.erp.auth.model.User;
import com.erp.auth.repository.AuditLogRepository;
import com.erp.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final AuditLogRepository auditLogRepository;

    @GetMapping("/users")
    @PreAuthorize("hasAnyRole('ADMIN', 'FINANCE_MANAGER')")
    public ResponseEntity<List<UserProfileResponse>> getAllUsers() {
        List<UserProfileResponse> users = userRepository.findAll().stream()
                .map(UserProfileResponse::fromUser)
                .toList();
        return ResponseEntity.ok(users);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<MessageResponse> deleteUser(@PathVariable UUID id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok(MessageResponse.builder()
                .message("User deleted successfully")
                .success(true)
                .build());
    }

    @PutMapping("/users/{id}/role")
    @PreAuthorize("hasRole('ADMIN') and #newRole != 'ROLE_ADMIN'")
    public ResponseEntity<MessageResponse> updateUserRole(
            @PathVariable UUID id,
            @RequestParam String newRole) {
        return userRepository.findById(id)
                .map(user -> {
                    try {
                        user.setRole(Role.valueOf(newRole));
                        userRepository.save(user);
                        return ResponseEntity.ok(MessageResponse.builder()
                                .message("User role updated")
                                .success(true)
                                .build());
                    } catch (IllegalArgumentException ex) {
                        return ResponseEntity.badRequest().body(MessageResponse.builder()
                                .message("Invalid role provided")
                                .success(false)
                                .build());
                    }
                })
                .orElseGet(() -> ResponseEntity.badRequest().body(MessageResponse.builder()
                        .message("User not found")
                        .success(false)
                        .build()));
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<List<?>> getAuditLogs(
            @RequestParam(required = false) UUID userId,
            @RequestParam(required = false) String eventType,
            @RequestParam(defaultValue = "50") int limit) {

        List<?> logs;
        if (userId != null) {
            logs = auditLogRepository.findByUserIdOrderByCreatedAtDesc(userId)
                    .stream().limit(limit).toList();
        } else if (eventType != null) {
            logs = auditLogRepository.findByEventTypeAndCreatedAtAfter(
                            eventType, LocalDateTime.now().minusDays(30))
                    .stream().limit(limit).toList();
        } else {
            logs = auditLogRepository.findAll(PageRequest.of(0, limit)).getContent();
        }

        return ResponseEntity.ok(logs);
    }
}

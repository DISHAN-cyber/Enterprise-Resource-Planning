package com.erp.auth.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class MockEmailService implements EmailService {

    @Override
    public void sendPasswordResetEmail(String toEmail, String username, String resetLink) {
        // Log instead of sending real email (for development)
        log.info("=== MOCK EMAIL ===");
        log.info("To: {}", toEmail);
        log.info("Subject: Password Reset Request");
        log.info("Body: Hello {}, click here to reset your password: {}", username, resetLink);
        log.info("=== END MOCK EMAIL ===");
    }

    @Override
    public void sendPasswordChangedEmail(String toEmail, String username) {
        log.info("=== MOCK EMAIL ===");
        log.info("To: {}", toEmail);
        log.info("Subject: Password Changed Successfully");
        log.info("Body: Hello {}, your password has been changed successfully.", username);
        log.info("=== END MOCK EMAIL ===");
    }
}
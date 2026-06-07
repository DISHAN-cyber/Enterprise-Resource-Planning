package com.erp.auth.service;

public interface EmailService {
    void sendPasswordResetEmail(String toEmail, String username, String resetLink);
    void sendPasswordChangedEmail(String toEmail, String username);
}
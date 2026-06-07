package com.erp.auth.service;

import com.erp.auth.dto.ChangePasswordRequest;
import com.erp.auth.dto.ForgotPasswordRequest;
import com.erp.auth.dto.LoginRequest;
import com.erp.auth.dto.LoginResponse;
import com.erp.auth.dto.MessageResponse;
import com.erp.auth.dto.ResetPasswordRequest;
import com.erp.auth.dto.UserProfileResponse;
import com.erp.auth.model.PasswordResetToken;
import com.erp.auth.model.User;
import com.erp.auth.repository.PasswordResetTokenRepository;
import com.erp.auth.repository.UserRepository;
import com.erp.auth.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordResetTokenRepository resetTokenRepository;
    private final EmailService emailService;
    private final AuditService auditService;

    @Value("${app.frontend-url:http://localhost:4200}")
    private String frontendUrl;

    @Value("${app.reset-token-expiration:3600}")
    private long resetTokenExpirationSeconds;

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findActiveUserByEmail(request.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            auditService.logLoginFailed(request.getEmail(), "Invalid credentials");
            throw new BadCredentialsException("Invalid email or password");
        }

        user.updateLastLogin();
        userRepository.save(user);
        auditService.logLoginSuccess(user.getId(), user.getEmail());

        String accessToken = jwtTokenProvider.generateToken(user);
        String refreshToken = jwtTokenProvider.generateRefreshToken(user);

        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtTokenProvider.getJwtExpiration())
                .userProfile(UserProfileResponse.fromUser(user))
                .build();
    }

    public LoginResponse refreshToken(String refreshToken) {
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new BadCredentialsException("Invalid refresh token");
        }

        String email = jwtTokenProvider.getUsernameFromToken(refreshToken);
        User user = userRepository.findActiveUserByEmail(email)
                .orElseThrow(() -> new BadCredentialsException("Invalid refresh token"));

        String accessToken = jwtTokenProvider.generateToken(user);

        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtTokenProvider.getJwtExpiration())
                .userProfile(UserProfileResponse.fromUser(user))
                .build();
    }

    public MessageResponse forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail()).orElse(null);

        if (user != null && user.getEnabled()) {
            resetTokenRepository.deleteByUser(user);

            String token = UUID.randomUUID().toString();
            LocalDateTime expiryDate = LocalDateTime.now().plusSeconds(resetTokenExpirationSeconds);

            PasswordResetToken resetToken = PasswordResetToken.builder()
                    .token(token)
                    .user(user)
                    .expiryDate(expiryDate)
                    .used(false)
                    .build();
            resetTokenRepository.save(resetToken);

            String resetLink = frontendUrl + "/reset-password?token=" + token;
            emailService.sendPasswordResetEmail(user.getEmail(), user.getFirstName(), resetLink);
            auditService.logPasswordResetRequested(request.getEmail());
        }

        return MessageResponse.builder()
                .message("If an account exists with this email, a password reset link has been sent.")
                .success(true)
                .build();
    }

    @Transactional
    public MessageResponse resetPassword(ResetPasswordRequest request) {
        if (!request.isPasswordMatch()) {
            return MessageResponse.builder()
                    .message("New password and confirm password do not match")
                    .success(false)
                    .build();
        }

        PasswordResetToken resetToken = resetTokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> new RuntimeException("Invalid or expired reset token"));

        if (!resetToken.isValid()) {
            return MessageResponse.builder()
                    .message("Reset token has expired or already been used")
                    .success(false)
                    .build();
        }

        User user = resetToken.getUser();

        if (!isValidPassword(request.getNewPassword())) {
            return MessageResponse.builder()
                    .message("New password does not meet security requirements")
                    .success(false)
                    .build();
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        resetToken.setUsed(true);
        resetTokenRepository.save(resetToken);

        emailService.sendPasswordChangedEmail(user.getEmail(), user.getFirstName());
        auditService.logPasswordResetSuccess(user.getId(), user.getEmail());

        return MessageResponse.builder()
                .message("Password has been reset successfully")
                .success(true)
                .build();
    }

    public MessageResponse verifyResetToken(String token) {
        PasswordResetToken resetToken = resetTokenRepository.findByToken(token).orElse(null);
        if (resetToken != null && resetToken.isValid()) {
            return MessageResponse.builder()
                    .message("Token is valid")
                    .success(true)
                    .build();
        }
        return MessageResponse.builder()
                .message("Invalid or expired token")
                .success(false)
                .build();
    }

    public MessageResponse changePassword(User user, ChangePasswordRequest request) {
        if (!request.isPasswordMatch()) {
            return MessageResponse.builder()
                    .message("New password and confirm password do not match")
                    .success(false)
                    .build();
        }

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            return MessageResponse.builder()
                    .message("Current password is incorrect")
                    .success(false)
                    .build();
        }

        if (!isValidPassword(request.getNewPassword())) {
            return MessageResponse.builder()
                    .message("New password does not meet security requirements")
                    .success(false)
                    .build();
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        auditService.logPasswordChanged(user.getId(), user.getEmail());

        return MessageResponse.builder()
                .message("Password updated successfully")
                .success(true)
                .build();
    }

    public UserProfileResponse getProfile(User user) {
        return UserProfileResponse.fromUser(user);
    }

    private boolean isValidPassword(String password) {
        return password != null &&
                password.length() >= 8 &&
                password.matches(".*[A-Z].*") &&
                password.matches(".*[a-z].*") &&
                password.matches(".*\\d.*");
    }
}

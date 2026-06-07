// filepath: backend/finance-service/src/main/java/com/erp/finance_service/service/AuthService.java
package com.erp.finance_service.service;

import com.erp.finance_service.dto.*;
import com.erp.finance_service.model.User;
import com.erp.finance_service.repository.UserRepository;
import com.erp.finance_service.security.JwtUtil;
import jakarta.transaction.Transactional;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    private static final int MAX_FAILED_ATTEMPTS = 5;
    private static final int LOCK_DURATION_MINUTES = 30;

    public AuthService(UserRepository userRepository, 
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    public LoginResponse login(String username, String password) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new BadCredentialsException("Invalid username or password"));

        // Check if account is locked
        if (user.getLockedUntil() != null && user.getLockedUntil().isAfter(Instant.now())) {
            throw new LockedException("Account is locked. Please try again later.");
        }

        // Check if account is active
        if (!user.isActive()) {
            throw new BadCredentialsException("Account is disabled.");
        }

        // Authenticate
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password)
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Reset failed attempts and update last login
            userRepository.resetFailedLoginAttempts(user.getId());
            userRepository.updateLastLogin(user.getId(), Instant.now());

            // Generate token
            String token = jwtUtil.generateToken(username, user.getRole());

            return LoginResponse.builder()
                    .success(true)
                    .token(token)
                    .user(mapToUserDto(user))
                    .build();

        } catch (Exception e) {
            // Increment failed attempts
            userRepository.incrementFailedLoginAttempts(user.getId());
            user = userRepository.findByUsername(username).orElse(user);
            
            if (user.getFailedLoginAttempts() >= MAX_FAILED_ATTEMPTS) {
                userRepository.lockUserUntil(user.getId(), 
                        Instant.now().plusSeconds(LOCK_DURATION_MINUTES * 60L));
                throw new LockedException("Too many failed attempts. Account locked for " + 
                        LOCK_DURATION_MINUTES + " minutes.");
            }
            
            throw new BadCredentialsException("Invalid username or password");
        }
    }

    @Transactional
    public void logout() {
        SecurityContextHolder.clearContext();
    }

    public UserProfileDto getProfile() {
        User user = getCurrentUser();
        return mapToUserProfileDto(user);
    }

    @Transactional
    public ApiResponse<UserProfileDto> updateProfile(ProfileUpdateRequest request) {
        User user = getCurrentUser();

        if (StringUtils.hasText(request.getEmail()) && 
                userRepository.existsByEmailAndIdNot(request.getEmail(), user.getId())) {
            return ApiResponse.<UserProfileDto>builder()
                    .success(false)
                    .message("Email is already in use.")
                    .build();
        }

        if (StringUtils.hasText(request.getFirstName())) {
            user.setFirstName(request.getFirstName());
        }

        if (StringUtils.hasText(request.getLastName())) {
            user.setLastName(request.getLastName());
        }

        if (StringUtils.hasText(request.getDisplayName())) {
            user.setDisplayName(request.getDisplayName());
        }

        if (StringUtils.hasText(request.getEmail())) {
            user.setEmail(request.getEmail());
        }

        if (StringUtils.hasText(request.getPhone())) {
            user.setPhone(request.getPhone());
        }

        if (StringUtils.hasText(request.getAvatarUrl())) {
            user.setAvatarUrl(request.getAvatarUrl());
        }

        userRepository.save(user);

        return ApiResponse.<UserProfileDto>builder()
                .success(true)
                .data(mapToUserProfileDto(user))
                .build();
    }

    @Transactional
    public ApiResponse<Void> changePassword(ChangePasswordRequest request) {
        User user = getCurrentUser();

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            return ApiResponse.<Void>builder()
                    .success(false)
                    .message("Current password is incorrect.")
                    .build();
        }

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            return ApiResponse.<Void>builder()
                    .success(false)
                    .message("New passwords do not match.")
                    .build();
        }

        if (request.getNewPassword().length() < 8) {
            return ApiResponse.<Void>builder()
                    .success(false)
                    .message("Password must be at least 8 characters.")
                    .build();
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        user.setPasswordChangedAt(Instant.now());
        userRepository.save(user);

        return ApiResponse.<Void>builder()
                .success(true)
                .message("Password changed successfully.")
                .build();
    }

    public ApiResponse<Map<String, Object>> getSettings() {
        User user = getCurrentUser();
        
        Map<String, Object> settings = new HashMap<>();
        settings.put("theme", "light");
        settings.put("language", "en");
        settings.put("notificationsEnabled", true);
        settings.put("emailNotifications", true);

        return ApiResponse.<Map<String, Object>>builder()
                .success(true)
                .data(settings)
                .build();
    }

    @Transactional
    public ApiResponse<Map<String, Object>> updateSettings(Map<String, Object> settings) {
        // In a real implementation, you'd save these to a user_settings table
        return ApiResponse.<Map<String, Object>>builder()
                .success(true)
                .data(settings)
                .message("Settings updated successfully.")
                .build();
    }

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || 
                authentication.getPrincipal() == null) {
            throw new IllegalStateException("User is not authenticated.");
        }

        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalStateException("Authenticated user not found."));
    }

    private UserProfileDto mapToUserDto(User user) {
        return UserProfileDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .displayName(user.getDisplayName())
                .phone(user.getPhone())
                .role(user.getRole())
                .avatarUrl(user.getAvatarUrl())
                .isActive(user.isActive())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .lastLogin(user.getLastLogin())
                .build();
    }

    private UserProfileDto mapToUserProfileDto(User user) {
        return UserProfileDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .displayName(user.getDisplayName())
                .phone(user.getPhone())
                .role(user.getRole())
                .avatarUrl(user.getAvatarUrl())
                .isActive(user.isActive())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .lastLogin(user.getLastLogin())
                .build();
    }
}
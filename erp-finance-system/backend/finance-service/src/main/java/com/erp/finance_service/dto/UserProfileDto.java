package com.erp.finance_service.dto;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class UserProfileDto {
    private Long id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String displayName;
    private String phone;
    private String role;
    private String avatarUrl;
    private boolean isActive;
    private Instant createdAt;
    private Instant updatedAt;
    private Instant lastLogin;
}

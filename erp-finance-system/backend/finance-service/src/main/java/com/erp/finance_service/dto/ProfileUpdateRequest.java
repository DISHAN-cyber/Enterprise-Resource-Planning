package com.erp.finance_service.dto;

import lombok.Data;

@Data
public class ProfileUpdateRequest {
    private String email;
    private String firstName;
    private String lastName;
    private String displayName;
    private String phone;
    private String avatarUrl;
}

// filepath: backend/finance-service/src/main/java/com/erp/finance_service/dto/LoginResponse.java
package com.erp.finance_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    private boolean success;
    private String token;
    private String type = "Bearer";
    private UserProfileDto user;
    private String message;
}
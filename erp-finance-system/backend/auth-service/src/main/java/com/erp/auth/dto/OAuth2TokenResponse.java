package com.erp.auth.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OAuth2TokenResponse {
    private String accessToken;
    private String tokenType;
    private Integer expiresIn;
    private String refreshToken;
    private String scope;
    private String error;
    private String errorDescription;

    public static OAuth2TokenResponse error(String error, String errorDescription) {
        return OAuth2TokenResponse.builder()
                .error(error)
                .errorDescription(errorDescription)
                .build();
    }
}

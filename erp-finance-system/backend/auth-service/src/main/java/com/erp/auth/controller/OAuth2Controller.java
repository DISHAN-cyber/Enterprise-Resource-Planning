package com.erp.auth.controller;

import com.erp.auth.dto.LoginRequest;
import com.erp.auth.dto.LoginResponse;
import com.erp.auth.dto.OAuth2TokenResponse;
import com.erp.auth.security.JwtTokenProvider;
import com.erp.auth.service.AuthService;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.OctetSequenceKey;
import com.nimbusds.jose.util.Base64URL;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.MultiValueMap;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class OAuth2Controller {

    private final AuthService authService;
    private final JwtTokenProvider jwtTokenProvider;

    @PostMapping(value = "/oauth2/token", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public ResponseEntity<OAuth2TokenResponse> token(@RequestParam MultiValueMap<String, String> parameters) {
        String grantType = parameters.getFirst("grant_type");
        if (!StringUtils.hasText(grantType)) {
            return ResponseEntity.badRequest().body(OAuth2TokenResponse.error("invalid_request", "Missing grant_type parameter."));
        }

        if ("password" .equals(grantType)) {
            String username = parameters.getFirst("username");
            String password = parameters.getFirst("password");
            if (!StringUtils.hasText(username) || !StringUtils.hasText(password)) {
                return ResponseEntity.badRequest().body(OAuth2TokenResponse.error("invalid_request", "username and password are required."));
            }

            LoginResponse loginResponse = authService.login(new LoginRequest(username, password));
            return ResponseEntity.ok(toOAuth2Response(loginResponse));
        }

        if ("refresh_token".equals(grantType)) {
            String refreshToken = parameters.getFirst("refresh_token");
            if (!StringUtils.hasText(refreshToken)) {
                return ResponseEntity.badRequest().body(OAuth2TokenResponse.error("invalid_request", "refresh_token is required."));
            }
            LoginResponse loginResponse = authService.refreshToken(refreshToken);
            return ResponseEntity.ok(toOAuth2Response(loginResponse));
        }

        return ResponseEntity.badRequest().body(OAuth2TokenResponse.error("unsupported_grant_type", "The grant_type is not supported."));
    }

    @GetMapping("/.well-known/openid-configuration")
    public Map<String, Object> openIdConfiguration(HttpServletRequest request) {
        String issuer = getIssuer(request);
        Map<String, Object> configuration = new LinkedHashMap<>();
        configuration.put("issuer", issuer);
        configuration.put("authorization_endpoint", issuer + "/oauth2/authorize");
        configuration.put("token_endpoint", issuer + "/oauth2/token");
        configuration.put("jwks_uri", issuer + "/.well-known/jwks.json");
        configuration.put("response_types_supported", new String[]{"token", "code", "id_token"});
        configuration.put("subject_types_supported", new String[]{"public"});
        configuration.put("id_token_signing_alg_values_supported", new String[]{"HS256"});
        configuration.put("token_endpoint_auth_methods_supported", new String[]{"none"});
        configuration.put("grant_types_supported", new String[]{"password", "refresh_token"});
        configuration.put("scopes_supported", new String[]{"openid", "profile", "email"});
        return configuration;
    }

    @GetMapping("/.well-known/jwks.json")
    public Map<String, Object> jwks() {
        OctetSequenceKey jwk = new OctetSequenceKey.Builder(Base64URL.encode(jwtTokenProvider.getSecretBytes()))
                .keyID("erp-auth-key")
                .algorithm(JWSAlgorithm.HS256)
                .build();
        return new JWKSet(jwk).toJSONObject();
    }

    private OAuth2TokenResponse toOAuth2Response(LoginResponse loginResponse) {
        return OAuth2TokenResponse.builder()
                .accessToken(loginResponse.getAccessToken())
                .tokenType(loginResponse.getTokenType())
                .expiresIn(loginResponse.getExpiresIn() != null ? loginResponse.getExpiresIn().intValue() : null)
                .refreshToken(loginResponse.getRefreshToken())
                .scope("openid profile email")
                .build();
    }

    private String getIssuer(HttpServletRequest request) {
        return request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + "/auth";
    }
}

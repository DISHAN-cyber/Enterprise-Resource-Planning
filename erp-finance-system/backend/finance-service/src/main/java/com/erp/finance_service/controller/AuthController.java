package com.erp.finance_service.controller;

import com.erp.finance_service.dto.JwtResponse;
import com.erp.finance_service.dto.LoginRequest;
import com.erp.finance_service.security.FinanceUserDetails;
import com.erp.finance_service.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public AuthController(AuthenticationManager authenticationManager, JwtUtil jwtUtil) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(@RequestBody LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        
        String token = jwtUtil.generateToken(authentication);
        
        FinanceUserDetails userDetails = (FinanceUserDetails) authentication.getPrincipal();
        String role = userDetails.getUser().getRole();

        return ResponseEntity.ok(new JwtResponse(token, request.getUsername(), role));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok().build();
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication != null && authentication.isAuthenticated()) {
            FinanceUserDetails userDetails = (FinanceUserDetails) authentication.getPrincipal();
            return ResponseEntity.ok(userDetails.getUser());
        }
        return ResponseEntity.status(401).body("Not authenticated");
    }
}
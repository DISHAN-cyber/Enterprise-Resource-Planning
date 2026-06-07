package com.erp.finance.controller;

import com.erp.finance.dto.AccountDTO;
import com.erp.finance.dto.AccountHierarchyDTO;
import com.erp.finance.dto.AccountRequestDTO;
import com.erp.finance.service.AccountService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/chart-of-accounts")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    /**
     * GET /api/chart-of-accounts
     * Get all active accounts
     */
    @GetMapping
    public ResponseEntity<List<AccountDTO>> getAllAccounts() {
        return ResponseEntity.ok(accountService.getAllAccounts());
    }

    /**
     * GET /api/chart-of-accounts/hierarchy
     * Get hierarchical account structure
     */
    @GetMapping("/hierarchy")
    public ResponseEntity<List<AccountHierarchyDTO>> getAccountHierarchy() {
        return ResponseEntity.ok(accountService.getAccountHierarchy());
    }

    /**
     * GET /api/chart-of-accounts/search?q=cash
     * Search accounts by code or name
     */
    @GetMapping("/search")
    public ResponseEntity<List<AccountDTO>> searchAccounts(@RequestParam("q") String query) {
        return ResponseEntity.ok(accountService.searchAccounts(query));
    }

    /**
     * POST /api/chart-of-accounts
     * Create new account
     */
    @PostMapping
    public ResponseEntity<AccountDTO> createAccount(
            @Valid @RequestBody AccountRequestDTO request,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        UUID userId = UUID.fromString(userDetails.getUsername()); // Assuming username is UUID or adjust accordingly
        AccountDTO created = accountService.createAccount(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * PUT /api/chart-of-accounts/{id}
     * Update existing account
     */
    @PutMapping("/{id}")
    public ResponseEntity<AccountDTO> updateAccount(
            @PathVariable UUID id,
            @Valid @RequestBody AccountRequestDTO request,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        UUID userId = UUID.fromString(userDetails.getUsername());
        AccountDTO updated = accountService.updateAccount(id, request, userId);
        return ResponseEntity.ok(updated);
    }

    /**
     * DELETE /api/chart-of-accounts/{id}
     * Soft delete account
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteAccount(@PathVariable UUID id) {
        accountService.deleteAccount(id);
        return ResponseEntity.ok(Map.of("message", "Account deleted successfully"));
    }
}
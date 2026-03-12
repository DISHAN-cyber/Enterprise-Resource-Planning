package com.erp.finance.controller;

import com.erp.finance.dto.ChartOfAccountDTO;
import com.erp.finance.model.AccountType;
import com.erp.finance.service.ChartOfAccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/finance/accounts")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class ChartOfAccountController {

    private final ChartOfAccountService accountService;

    @GetMapping
    public ResponseEntity<List<ChartOfAccountDTO>> getAllAccounts() {
        List<ChartOfAccountDTO> accounts = accountService.getAllAccounts();
        return ResponseEntity.ok(accounts);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ChartOfAccountDTO> getAccountById(@PathVariable Long id) {
        ChartOfAccountDTO account = accountService.getAccountById(id);
        return ResponseEntity.ok(account);
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<ChartOfAccountDTO> getAccountByCode(@PathVariable String code) {
        ChartOfAccountDTO account = accountService.getAccountByCode(code);
        return ResponseEntity.ok(account);
    }

    @PostMapping
    public ResponseEntity<ChartOfAccountDTO> createAccount(@Valid @RequestBody ChartOfAccountDTO dto) {
        ChartOfAccountDTO createdAccount = accountService.createAccount(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdAccount);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ChartOfAccountDTO> updateAccount(
            @PathVariable Long id,
            @Valid @RequestBody ChartOfAccountDTO dto) {
        ChartOfAccountDTO updatedAccount = accountService.updateAccount(id, dto);
        return ResponseEntity.ok(updatedAccount);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAccount(@PathVariable Long id) {
        accountService.deleteAccount(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<ChartOfAccountDTO>> getAccountsByType(@PathVariable AccountType type) {
        List<ChartOfAccountDTO> accounts = accountService.getAccountsByType(type);
        return ResponseEntity.ok(accounts);
    }

    @GetMapping("/search")
    public ResponseEntity<List<ChartOfAccountDTO>> searchAccounts(@RequestParam String term) {
        List<ChartOfAccountDTO> accounts = accountService.searchAccounts(term);
        return ResponseEntity.ok(accounts);
    }
}
package com.erp.finance_service.controller;

import com.erp.finance_service.model.LedgerAccount;
import com.erp.finance_service.service.LedgerAccountService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
public class LedgerAccountController {

    private final LedgerAccountService ledgerAccountService;

    public LedgerAccountController(LedgerAccountService ledgerAccountService) {
        this.ledgerAccountService = ledgerAccountService;
    }

    @GetMapping
    public ResponseEntity<List<LedgerAccount>> getAllAccounts() {
        return ResponseEntity.ok(ledgerAccountService.getAllAccounts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LedgerAccount> getAccountById(@PathVariable Long id) {
        return ResponseEntity.ok(ledgerAccountService.getAccountById(id));
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<LedgerAccount> getAccountByCode(@PathVariable String code) {
        return ResponseEntity.ok(ledgerAccountService.getAccountByCode(code));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<LedgerAccount>> getAccountsByType(@PathVariable LedgerAccount.AccountType type) {
        return ResponseEntity.ok(ledgerAccountService.getAccountsByType(type));
    }

    @GetMapping("/roots")
    public ResponseEntity<List<LedgerAccount>> getRootAccounts() {
        return ResponseEntity.ok(ledgerAccountService.getRootAccounts());
    }

    @GetMapping("/parent/{parentId}")
    public ResponseEntity<List<LedgerAccount>> getChildAccounts(@PathVariable Long parentId) {
        return ResponseEntity.ok(ledgerAccountService.getChildAccounts(parentId));
    }

    @PostMapping
    public ResponseEntity<LedgerAccount> createAccount(@RequestBody LedgerAccount account) {
        return ResponseEntity.ok(ledgerAccountService.createAccount(account));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LedgerAccount> updateAccount(@PathVariable Long id, @RequestBody LedgerAccount account) {
        return ResponseEntity.ok(ledgerAccountService.updateAccount(id, account));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deactivateAccount(@PathVariable Long id) {
        ledgerAccountService.deactivateAccount(id);
        return ResponseEntity.noContent().build();
    }
}
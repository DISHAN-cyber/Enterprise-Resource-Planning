package com.erp.finance_service.service;

import com.erp.finance_service.model.LedgerAccount;
import com.erp.finance_service.repository.LedgerAccountRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LedgerAccountService {

    private final LedgerAccountRepository ledgerAccountRepository;

    public LedgerAccountService(LedgerAccountRepository ledgerAccountRepository) {
        this.ledgerAccountRepository = ledgerAccountRepository;
    }

    public List<LedgerAccount> getAllAccounts() {
        return ledgerAccountRepository.findByActiveTrue();
    }

    public List<LedgerAccount> getAccountsByType(LedgerAccount.AccountType type) {
        return ledgerAccountRepository.findByAccountType(type);
    }

    public LedgerAccount getAccountById(Long id) {
        return ledgerAccountRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Account not found: " + id));
    }

    public LedgerAccount getAccountByCode(String code) {
        return ledgerAccountRepository.findByAccountCode(code)
                .orElseThrow(() -> new IllegalArgumentException("Account not found: " + code));
    }

    public List<LedgerAccount> getRootAccounts() {
        return ledgerAccountRepository.findRootAccounts();
    }

    public List<LedgerAccount> getChildAccounts(Long parentId) {
        return ledgerAccountRepository.findByParentId(parentId);
    }

    @Transactional
    public LedgerAccount createAccount(LedgerAccount account) {
        if (ledgerAccountRepository.findByAccountCode(account.getAccountCode()).isPresent()) {
            throw new IllegalArgumentException("Account code already exists: " + account.getAccountCode());
        }
        return ledgerAccountRepository.save(account);
    }

    @Transactional
    public LedgerAccount updateAccount(Long id, LedgerAccount updated) {
        LedgerAccount existing = getAccountById(id);
        existing.setName(updated.getName());
        existing.setAccountType(updated.getAccountType());
        existing.setDescription(updated.getDescription());
        if (updated.getParent() != null) {
            existing.setParent(updated.getParent());
        }
        return ledgerAccountRepository.save(existing);
    }

    @Transactional
    public void deactivateAccount(Long id) {
        LedgerAccount account = getAccountById(id);
        account.setActive(false);
        ledgerAccountRepository.save(account);
    }
}
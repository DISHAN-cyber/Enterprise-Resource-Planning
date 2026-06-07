package com.erp.finance.service;

import com.erp.finance.dto.AccountDTO;
import com.erp.finance.dto.AccountHierarchyDTO;
import com.erp.finance.dto.AccountRequestDTO;
import com.erp.finance.entity.Account;
import com.erp.finance.entity.AccountType;
import com.erp.finance.exception.ResourceNotFoundException;
import com.erp.finance.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AccountService {

    private final AccountRepository accountRepository;

    public List<AccountDTO> getAllAccounts() {
        return accountRepository.findByIsActiveTrueOrderByAccountCode()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<AccountDTO> getTopLevelAccounts() {
        return accountRepository.findByParentAccountIdIsNullAndIsActiveTrueOrderByAccountCode()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public AccountDTO getAccountById(UUID id) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + id));
        return mapToDTO(account);
    }

    public AccountDTO getAccountByCode(String accountCode) {
        Account account = accountRepository.findByAccountCodeAndIsActiveTrue(accountCode)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with code: " + accountCode));
        return mapToDTO(account);
    }

    public List<AccountDTO> searchAccounts(String searchTerm) {
        return accountRepository.searchAccounts(searchTerm)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<AccountDTO> getAccountsByType(AccountType type) {
        return accountRepository.findByTypeAndIsActiveTrue(type)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<AccountHierarchyDTO> getAccountHierarchy() {
        List<Account> topLevelAccounts = accountRepository.findByParentAccountIdIsNullAndIsActiveTrueOrderByAccountCode();
        return topLevelAccounts.stream()
                .map(this::buildHierarchy)
                .collect(Collectors.toList());
    }

    @Transactional
    public AccountDTO createAccount(AccountRequestDTO request, UUID createdBy) {
        validateAccountCode(request.getAccountCode(), null);

        Account account = Account.builder()
                .accountCode(request.getAccountCode())
                .accountName(request.getAccountName())
                .type(request.getType())
                .subType(request.getSubType())
                .balance(request.getBalance() != null ? request.getBalance() : BigDecimal.ZERO)
                .description(request.getDescription())
                .isActive(request.getActive() != null ? request.getActive() : true)
                .createdBy(createdBy)
                .build();

        if (request.getParentAccountId() != null) {
            Account parentAccount = accountRepository.findById(request.getParentAccountId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent account not found"));
            account.setParentAccount(parentAccount);
        }

        Account savedAccount = accountRepository.save(account);
        return mapToDTO(savedAccount);
    }

    @Transactional
    public AccountDTO updateAccount(UUID id, AccountRequestDTO request, UUID updatedBy) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + id));

        validateAccountCode(request.getAccountCode(), id);

        account.setAccountCode(request.getAccountCode());
        account.setAccountName(request.getAccountName());
        account.setType(request.getType());
        account.setSubType(request.getSubType());
        account.setDescription(request.getDescription());
        account.setUpdatedBy(updatedBy);

        if (request.getParentAccountId() != null && 
            !request.getParentAccountId().equals(account.getParentAccount() != null ? account.getParentAccount().getId() : null)) {
            Account parentAccount = accountRepository.findById(request.getParentAccountId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent account not found"));
            account.setParentAccount(parentAccount);
        } else if (request.getParentAccountId() == null) {
            account.setParentAccount(null);
        }

        if (request.getActive() != null) {
            account.setIsActive(request.getActive());
        }

        Account updatedAccount = accountRepository.save(account);
        return mapToDTO(updatedAccount);
    }

    @Transactional
    public void deleteAccount(UUID id) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + id));

        if (account.getIsSystemAccount()) {
            throw new RuntimeException("Cannot delete system account");
        }

        // Check if account has child accounts
        List<Account> childAccounts = accountRepository.findByParentAccountIdAndIsActiveTrueOrderByAccountCode(id);
        if (!childAccounts.isEmpty()) {
            throw new RuntimeException("Cannot delete account with child accounts");
        }

        account.softDelete();
        accountRepository.save(account);
    }

    public BigDecimal getTotalBalanceByType(AccountType type) {
        BigDecimal total = accountRepository.getTotalBalanceByType(type);
        return total != null ? total : BigDecimal.ZERO;
    }

    private void validateAccountCode(String accountCode, UUID excludeId) {
        if (excludeId == null) {
            if (accountRepository.existsByAccountCodeAndIsActiveTrue(accountCode)) {
                throw new RuntimeException("Account code already exists: " + accountCode);
            }
        } else {
            if (accountRepository.existsByAccountCodeAndIsActiveTrueAndIdNot(accountCode, excludeId)) {
                throw new RuntimeException("Account code already exists: " + accountCode);
            }
        }
    }

    private AccountHierarchyDTO buildHierarchy(Account account) {
        List<Account> children = accountRepository.findByParentAccountIdAndIsActiveTrueOrderByAccountCode(account.getId());
        
        AccountHierarchyDTO dto = AccountHierarchyDTO.builder()
                .id(account.getId())
                .accountCode(account.getAccountCode())
                .accountName(account.getAccountName())
                .balance(account.getBalance())
                .children(new ArrayList<>())
                .build();

        for (Account child : children) {
            dto.getChildren().add(buildHierarchy(child));
        }

        return dto;
    }

    private AccountDTO mapToDTO(Account account) {
        AccountDTO dto = AccountDTO.builder()
                .id(account.getId())
                .accountCode(account.getAccountCode())
                .accountName(account.getAccountName())
                .type(account.getType())
                .subType(account.getSubType())
                .balance(account.getBalance())
                .debitBalance(account.getDebitBalance())
                .creditBalance(account.getCreditBalance())
                .description(account.getDescription())
                .isActive(account.getIsActive())
                .isSystemAccount(account.getIsSystemAccount())
                .createdAt(account.getCreatedAt())
                .updatedAt(account.getUpdatedAt())
                .build();

        if (account.getParentAccount() != null) {
            dto.setParentAccountId(account.getParentAccount().getId());
            dto.setParentAccountCode(account.getParentAccount().getAccountCode());
            dto.setParentAccountName(account.getParentAccount().getAccountName());
        }

        return dto;
    }
}
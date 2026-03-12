package com.erp.finance.service;

import com.erp.finance.dto.ChartOfAccountDTO;
import com.erp.finance.model.ChartOfAccount;
import com.erp.finance.model.AccountType;
import com.erp.finance.repository.ChartOfAccountRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChartOfAccountService {

    private final ChartOfAccountRepository accountRepository;

    
    @Transactional(readOnly = true)
    public List<ChartOfAccountDTO> getAllAccounts() {
        return accountRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ChartOfAccountDTO getAccountById(Long id) {
        ChartOfAccount account = findAccountById(id); 
        return convertToDTO(account);
    }

    @Transactional(readOnly = true)
    public ChartOfAccountDTO getAccountByCode(String code) {
        ChartOfAccount account = accountRepository.findByAccountCode(code)
                .orElseThrow(() -> new RuntimeException("Account not found with code: " + code));
        return convertToDTO(account);
    }

    @Transactional(readOnly = true)
    public List<ChartOfAccountDTO> getAccountsByType(AccountType type) {
        return accountRepository.findByAccountType(type)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ChartOfAccountDTO> searchAccounts(String searchTerm) {
        return accountRepository.searchAccounts(searchTerm)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    
    @Transactional
    public ChartOfAccountDTO createAccount(ChartOfAccountDTO dto) {
       
        if (accountRepository.findByAccountCode(dto.getAccountCode()).isPresent()) {
            throw new IllegalArgumentException("Account code already exists: " + dto.getAccountCode());
        }

        ChartOfAccount account = convertToEntity(dto);

       
        if (dto.getParentAccountId() != null) {
            ChartOfAccount parent = findAccountById(dto.getParentAccountId());
            account.setParentAccount(parent);
        }

       
        if (account.getIsActive() == null) {
            account.setIsActive(true);
        }

        
        validateNoCycle(account);

        ChartOfAccount savedAccount = accountRepository.save(account);
        log.info("Created new account with code: {}", savedAccount.getAccountCode());
        return convertToDTO(savedAccount);
    }

    @Transactional
    public ChartOfAccountDTO updateAccount(Long id, ChartOfAccountDTO dto) {
       
        if (id == null) {
            throw new IllegalArgumentException("Account ID cannot be null");
        }
        ChartOfAccount account = findAccountById(id);

        
        account.setAccountName(dto.getAccountName());
        account.setAccountType(dto.getAccountType());

        
        if (dto.getIsActive() != null) {
            account.setIsActive(dto.getIsActive());
        }

        
        if (dto.getParentAccountId() != null) {
            ChartOfAccount parent = findAccountById(dto.getParentAccountId());
            account.setParentAccount(parent);
        } else {
            account.setParentAccount(null);
        }

        
        validateNoCycle(account);

        ChartOfAccount updatedAccount = accountRepository.save(account);
        log.info("Updated account with id: {}", updatedAccount.getId());
        return convertToDTO(updatedAccount);
    }

    @Transactional
    public void deleteAccount(Long id) {
      
        if (id == null) {
            throw new IllegalArgumentException("Account ID cannot be null");
        }
        if (!accountRepository.existsById(id)) {
            throw new RuntimeException("Account not found with id: " + id);
        }
        accountRepository.deleteById(id);
        log.info("Deleted account with id: {}", id);
    }

    
    private ChartOfAccount findAccountById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Account ID cannot be null");
        }
        return accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found with id: " + id));
    }

    
    private void validateNoCycle(ChartOfAccount account) {
        if (account.getParentAccount() == null) return;

        java.util.Set<Long> visited = new java.util.HashSet<>();
        ChartOfAccount current = account.getParentAccount();

        while (current != null) {
            if (!visited.add(current.getId())) {
                throw new IllegalArgumentException(
                        "Circular parent relationship detected involving account id: " + current.getId());
            }
            current = current.getParentAccount();
        }
    }

    private ChartOfAccountDTO convertToDTO(ChartOfAccount account) {
        ChartOfAccountDTO dto = new ChartOfAccountDTO();
        dto.setId(account.getId());
        dto.setAccountCode(account.getAccountCode());
        dto.setAccountName(account.getAccountName());
        dto.setAccountType(account.getAccountType());
        dto.setIsActive(account.getIsActive());

        if (account.getParentAccount() != null) {
            dto.setParentAccountId(account.getParentAccount().getId());
        }

        return dto;
    }

    private ChartOfAccount convertToEntity(ChartOfAccountDTO dto) {
        ChartOfAccount account = new ChartOfAccount();
        account.setAccountCode(dto.getAccountCode());
        account.setAccountName(dto.getAccountName());
        account.setAccountType(dto.getAccountType());

       
        account.setIsActive(dto.getIsActive());

    
        return account;
    }
}
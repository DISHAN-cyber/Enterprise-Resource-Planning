package com.erp.finance_service.repository;

import com.erp.finance_service.model.LedgerAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LedgerAccountRepository extends JpaRepository<LedgerAccount, Long> {
    Optional<LedgerAccount> findByAccountCode(String accountCode);
    List<LedgerAccount> findByAccountType(LedgerAccount.AccountType accountType);
    List<LedgerAccount> findByActiveTrue();
    
    @Query("SELECT a FROM LedgerAccount a WHERE a.parent IS NULL AND a.active = true")
    List<LedgerAccount> findRootAccounts();
    
    @Query("SELECT a FROM LedgerAccount a WHERE a.parent.id = :parentId")
    List<LedgerAccount> findByParentId(Long parentId);
}
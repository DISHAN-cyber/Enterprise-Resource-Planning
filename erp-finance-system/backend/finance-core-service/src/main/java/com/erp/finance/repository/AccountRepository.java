package com.erp.finance.repository;

import com.erp.finance.entity.Account;
import com.erp.finance.entity.AccountType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AccountRepository extends JpaRepository<Account, UUID> {

    // Get all active accounts ordered by code
    List<Account> findByIsActiveTrueOrderByAccountCode();

    // Get top-level accounts (no parent)
    List<Account> findByParentAccountIdIsNullAndIsActiveTrueOrderByAccountCode();

    // Get children of a specific parent
    List<Account> findByParentAccountIdAndIsActiveTrueOrderByAccountCode(UUID parentAccountId);

    // Search by account code or name (case-insensitive)
    @Query("SELECT a FROM Account a WHERE a.isActive = true AND " +
           "(LOWER(a.accountCode) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(a.accountName) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "ORDER BY a.accountCode")
    List<Account> searchAccounts(@Param("keyword") String keyword);

    Optional<Account> findByAccountCodeAndIsActiveTrue(String accountCode);
    List<Account> findByTypeAndIsActiveTrue(AccountType type);
    
    @Query("SELECT COALESCE(SUM(a.balance), 0) FROM Account a WHERE a.type = :type AND a.isActive = true")
    BigDecimal getTotalBalanceByType(@Param("type") AccountType type);

    // Validation helpers
    boolean existsByAccountCodeAndIsActiveTrue(String accountCode);
    boolean existsByAccountCodeAndIsActiveTrueAndIdNot(String accountCode, UUID id);
    long countByParentAccountIdAndIsActiveTrue(UUID parentAccountId);
    
    // Check if account has transactions (optional but recommended for delete validation)
    @Query("SELECT COUNT(t) > 0 FROM Transaction t WHERE t.account.id = :accountId")
    boolean hasTransactions(@Param("accountId") UUID accountId);
}
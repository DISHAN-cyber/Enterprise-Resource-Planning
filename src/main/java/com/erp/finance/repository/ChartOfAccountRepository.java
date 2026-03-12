
package com.erp.finance.repository;

import com.erp.finance.model.ChartOfAccount;
import com.erp.finance.model.AccountType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ChartOfAccountRepository extends JpaRepository<ChartOfAccount, Long> {

    Optional<ChartOfAccount> findByAccountCode(String accountCode);

    List<ChartOfAccount> findByAccountType(AccountType accountType);

    List<ChartOfAccount> findByIsActive(Boolean isActive);

    @Query("SELECT c FROM ChartOfAccount c WHERE c.parentAccount IS NULL")
    List<ChartOfAccount> findRootAccounts();

    @Query("SELECT c FROM ChartOfAccount c WHERE c.accountName LIKE %:searchTerm% OR c.accountCode LIKE %:searchTerm%")
    List<ChartOfAccount> searchAccounts(String searchTerm);
}
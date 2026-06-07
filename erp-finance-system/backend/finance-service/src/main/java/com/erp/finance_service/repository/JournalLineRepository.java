package com.erp.finance_service.repository;

import com.erp.finance_service.model.JournalLine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface JournalLineRepository extends JpaRepository<JournalLine, Long> {
    List<JournalLine> findByEntryId(Long entryId);
    List<JournalLine> findByAccountId(Long accountId);
    
    @Query("SELECT SUM(jl.debitAmount) FROM JournalLine jl WHERE jl.account.id = :accountId")
    BigDecimal sumDebitsByAccountId(Long accountId);
    
    @Query("SELECT SUM(jl.creditAmount) FROM JournalLine jl WHERE jl.account.id = :accountId")
    BigDecimal sumCreditsByAccountId(Long accountId);
}
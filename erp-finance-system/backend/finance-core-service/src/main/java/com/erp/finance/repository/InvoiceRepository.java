package com.erp.finance.repository;

import com.erp.finance.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, UUID> {
    
    @Query("SELECT SUM(i.amount) FROM Invoice i WHERE i.type = 'ACCOUNTS_RECEIVABLE' AND i.status != 'PAID'")
    BigDecimal getTotalAccountsReceivable();
    
    @Query("SELECT SUM(i.amount) FROM Invoice i WHERE i.type = 'ACCOUNTS_PAYABLE' AND i.status != 'PAID'")
    BigDecimal getTotalAccountsPayable();
    
    @Query("SELECT SUM(i.amount) FROM Invoice i WHERE i.type = 'ACCOUNTS_RECEIVABLE' " +
           "AND i.status = 'OVERDUE'")
    BigDecimal getTotalOverdueReceivables();
    
    @Query("SELECT i FROM Invoice i WHERE i.type = 'ACCOUNTS_RECEIVABLE' AND i.status != 'PAID' " +
           "ORDER BY i.dueDate ASC")
    List<Invoice> findOutstandingReceivables();
    
    @Query("SELECT i FROM Invoice i WHERE i.type = 'ACCOUNTS_PAYABLE' AND i.status != 'PAID' " +
           "ORDER BY i.dueDate ASC")
    List<Invoice> findOutstandingPayables();
    
    long countByTypeAndStatus(String type, String status);
}
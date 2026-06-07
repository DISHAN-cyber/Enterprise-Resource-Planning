package com.erp.finance.repository;

import com.erp.finance.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, UUID> {
    
    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.type = 'INCOME' AND t.status = 'COMPLETED'")
    BigDecimal getTotalRevenue();
    
    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.type = 'EXPENSE' AND t.status = 'COMPLETED'")
    BigDecimal getTotalExpenses();
    
    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.type = 'INCOME' AND t.status = 'COMPLETED' " +
           "AND t.date BETWEEN :startDate AND :endDate")
    BigDecimal getRevenueByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    @Query("SELECT t FROM Transaction t WHERE t.type = 'INCOME' AND t.status = 'COMPLETED' " +
           "ORDER BY t.date DESC LIMIT 6")
    List<Transaction> findRecentRevenueTransactions();
    
    @Query("SELECT t FROM Transaction t WHERE t.type = 'INCOME' AND t.status = 'COMPLETED' " +
           "AND YEAR(t.date) = :year AND MONTH(t.date) = :month")
    List<Transaction> findTransactionsByMonth(@Param("year") int year, @Param("month") int month);
}
package com.erp.finance.repository;

import com.erp.finance.entity.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, UUID> {
    
    @Query("SELECT SUM(b.budgetedAmount) FROM Budget b WHERE b.fiscalYear = :year")
    Optional<Double> getTotalBudgetByYear(@Param("year") Integer year);
    
    @Query("SELECT SUM(b.actualAmount) FROM Budget b WHERE b.fiscalYear = :year")
    Optional<Double> getTotalActualByYear(@Param("year") Integer year);
    
    List<Budget> findByFiscalYear(Integer fiscalYear);
    
    Optional<Budget> findByFiscalYearAndMonthAndCategory(Integer fiscalYear, Integer month, String category);
}
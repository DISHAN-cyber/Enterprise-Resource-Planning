package com.erp.finance.repository;

import com.erp.finance.entity.APPayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface APPaymentRepository extends JpaRepository<APPayment, UUID> {
    
    Optional<APPayment> findByPaymentNumber(String paymentNumber);
    
    boolean existsByPaymentNumber(String paymentNumber);
    
    List<APPayment> findByInvoiceId(UUID invoiceId);
    
    List<APPayment> findByVendorId(UUID vendorId);
    
    @Query("SELECT SUM(p.amount) FROM APPayment p WHERE p.paymentDate BETWEEN :startDate AND :endDate")
    Optional<BigDecimal> getTotalPaymentsByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    List<APPayment> findByPaymentDateBetween(LocalDate startDate, LocalDate endDate);
    
    long countByInvoiceId(UUID invoiceId);
}
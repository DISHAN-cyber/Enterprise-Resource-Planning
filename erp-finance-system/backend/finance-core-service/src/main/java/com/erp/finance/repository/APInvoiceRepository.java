package com.erp.finance.repository;

import com.erp.finance.entity.APInvoice;
import com.erp.finance.entity.APInvoiceStatus;
import com.erp.finance.entity.ApprovalStatus;
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
public interface APInvoiceRepository extends JpaRepository<APInvoice, UUID> {
    
    Optional<APInvoice> findByInvoiceNumber(String invoiceNumber);
    
    boolean existsByInvoiceNumber(String invoiceNumber);
    
    boolean existsByInvoiceNumberAndIdNot(String invoiceNumber, UUID id);
    
    List<APInvoice> findByVendorId(UUID vendorId);
    
    List<APInvoice> findByStatus(APInvoiceStatus status);
    
    List<APInvoice> findByApprovalStatus(ApprovalStatus approvalStatus);
    
    @Query("SELECT i FROM APInvoice i WHERE i.dueDate < :today AND i.status = 'PENDING'")
    List<APInvoice> findOverdueInvoices(@Param("today") LocalDate today);
    
    @Query("SELECT SUM(i.totalAmount) FROM APInvoice i WHERE i.status = 'PENDING'")
    Optional<BigDecimal> getTotalPendingAmount();
    
    @Query("SELECT SUM(i.totalAmount) FROM APInvoice i WHERE i.status = 'PAID' AND i.invoiceDate BETWEEN :startDate AND :endDate")
    Optional<BigDecimal> getTotalPaidAmountByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    long countByStatus(APInvoiceStatus status);
    
    List<APInvoice> findByDueDateBetween(LocalDate startDate, LocalDate endDate);
}
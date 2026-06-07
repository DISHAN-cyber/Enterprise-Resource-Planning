package com.erp.ap.repository;

import com.erp.ap.entity.Invoice;
import com.erp.ap.entity.InvoiceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface InvoiceRepository extends JpaRepository<Invoice, UUID> {
    List<Invoice> findByStatus(InvoiceStatus status);
    List<Invoice> findByVendorId(UUID vendorId);
    boolean existsByInvoiceNumber(String invoiceNumber);
}
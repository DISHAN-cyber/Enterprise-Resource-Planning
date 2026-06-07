package com.erp.ap.service;

import com.erp.ap.dto.InvoiceDTO;
import com.erp.ap.dto.InvoiceRequest;
import com.erp.ap.entity.Invoice;
import com.erp.ap.entity.InvoiceStatus;
import com.erp.ap.entity.Vendor;
import com.erp.ap.repository.InvoiceRepository;
import com.erp.ap.repository.VendorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class InvoiceService {
    private final InvoiceRepository invoiceRepo;
    private final VendorRepository vendorRepo;

    public List<InvoiceDTO> getAllInvoices() {
        return invoiceRepo.findAll().stream().map(this::mapToDTO).toList();
    }

    @Transactional
    public InvoiceDTO createInvoice(InvoiceRequest req) {
        if (invoiceRepo.existsByInvoiceNumber(req.invoiceNumber()))
            throw new RuntimeException("Invoice number already exists");

        Vendor vendor = vendorRepo.findById(req.vendorId()).orElseThrow();

        Invoice invoice = Invoice.builder()
                .vendor(vendor)
                .invoiceNumber(req.invoiceNumber())
                .issueDate(req.issueDate())
                .dueDate(req.dueDate())
                .totalAmount(req.totalAmount())
                .build();
        
        return mapToDTO(invoiceRepo.save(invoice));
    }

    @Transactional
    public InvoiceDTO approveInvoice(UUID id, String approver) {
        Invoice invoice = invoiceRepo.findById(id).orElseThrow();
        if (invoice.getStatus() != InvoiceStatus.PENDING)
            throw new RuntimeException("Only pending invoices can be approved");

        invoice.setStatus(InvoiceStatus.APPROVED);
        invoice.setApprovedBy(approver);
        invoice.setApprovedAt(LocalDateTime.now());
        return mapToDTO(invoiceRepo.save(invoice));
    }

    @Transactional
    public InvoiceDTO rejectInvoice(UUID id) {
        Invoice invoice = invoiceRepo.findById(id).orElseThrow();
        if (invoice.getStatus() != InvoiceStatus.PENDING)
            throw new RuntimeException("Only pending invoices can be rejected");

        invoice.setStatus(InvoiceStatus.REJECTED);
        return mapToDTO(invoiceRepo.save(invoice));
    }

    @Transactional
    public InvoiceDTO markPaid(UUID id) {
        Invoice invoice = invoiceRepo.findById(id).orElseThrow();
        if (invoice.getStatus() != InvoiceStatus.APPROVED)
            throw new RuntimeException("Invoice must be approved before marking as paid");

        invoice.setStatus(InvoiceStatus.PAID);
        return mapToDTO(invoiceRepo.save(invoice));
    }

    private InvoiceDTO mapToDTO(Invoice i) {
        return new InvoiceDTO(i.getId(), i.getVendor().getId(), i.getVendor().getName(),
                              i.getInvoiceNumber(), i.getIssueDate(), i.getDueDate(),
                              i.getTotalAmount(), i.getStatus(), i.getApprovedBy(),
                              i.getApprovedAt() != null ? i.getApprovedAt().toLocalDate() : null);
    }
}
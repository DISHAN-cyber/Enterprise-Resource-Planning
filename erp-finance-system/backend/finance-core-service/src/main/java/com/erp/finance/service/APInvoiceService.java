package com.erp.finance.service;

import com.erp.finance.dto.*;
import com.erp.finance.entity.*;
import com.erp.finance.exception.ResourceNotFoundException;
import com.erp.finance.repository.APInvoiceRepository;
import com.erp.finance.repository.VendorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class APInvoiceService {

    private final APInvoiceRepository invoiceRepository;
    private final VendorRepository vendorRepository;

    public List<APInvoiceDTO> getAllInvoices() {
        return invoiceRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public APInvoiceDTO getInvoiceById(UUID id) {
        APInvoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found with id: " + id));
        return mapToDTO(invoice);
    }

    public APInvoiceDTO getInvoiceByNumber(String invoiceNumber) {
        APInvoice invoice = invoiceRepository.findByInvoiceNumber(invoiceNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found with number: " + invoiceNumber));
        return mapToDTO(invoice);
    }

    public List<APInvoiceDTO> getInvoicesByVendor(UUID vendorId) {
        return invoiceRepository.findByVendorId(vendorId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<APInvoiceDTO> getInvoicesByStatus(APInvoiceStatus status) {
        return invoiceRepository.findByStatus(status).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<APInvoiceDTO> getOverdueInvoices() {
        return invoiceRepository.findOverdueInvoices(LocalDate.now()).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public APInvoiceDTO createInvoice(APInvoiceRequestDTO request) {
        validateInvoiceNumber(request.getInvoiceNumber(), null);

        Vendor vendor = vendorRepository.findById(request.getVendorId())
                .orElseThrow(() -> new ResourceNotFoundException("Vendor not found with id: " + request.getVendorId()));

        APInvoice invoice = APInvoice.builder()
                .invoiceNumber(request.getInvoiceNumber())
                .vendor(vendor)
                .amount(request.getAmount())
                .taxAmount(request.getTaxAmount() != null ? request.getTaxAmount() : BigDecimal.ZERO)
                .totalAmount(request.getTotalAmount() != null ? request.getTotalAmount() : 
                    request.getAmount().add(request.getTaxAmount() != null ? request.getTaxAmount() : BigDecimal.ZERO))
                .invoiceDate(request.getInvoiceDate())
                .dueDate(request.getDueDate())
                .description(request.getDescription())
                .build();

        if (request.getLines() != null) {
            for (APInvoiceLineRequestDTO lineRequest : request.getLines()) {
                APInvoiceLine line = APInvoiceLine.builder()
                        .invoice(invoice)
                        .description(lineRequest.getDescription())
                        .amount(lineRequest.getAmount())
                        .quantity(lineRequest.getQuantity())
                        .unitPrice(lineRequest.getUnitPrice())
                        .build();
                invoice.getLines().add(line);
            }
        }

        return mapToDTO(invoiceRepository.save(invoice));
    }

    @Transactional
    public APInvoiceDTO approveInvoice(UUID id, UUID approvedBy) {
        APInvoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found with id: " + id));

        if (invoice.getApprovalStatus() != ApprovalStatus.PENDING) {
            throw new RuntimeException("Invoice is not in pending approval status");
        }

        invoice.setApprovalStatus(ApprovalStatus.APPROVED);
        invoice.setStatus(APInvoiceStatus.APPROVED);
        invoice.setApprovedBy(approvedBy);
        invoice.setApprovedAt(java.time.LocalDateTime.now());

        return mapToDTO(invoiceRepository.save(invoice));
    }

    @Transactional
    public APInvoiceDTO rejectInvoice(UUID id, UUID rejectedBy) {
        APInvoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found with id: " + id));

        if (invoice.getApprovalStatus() != ApprovalStatus.PENDING) {
            throw new RuntimeException("Invoice is not in pending approval status");
        }

        invoice.setApprovalStatus(ApprovalStatus.REJECTED);
        invoice.setStatus(APInvoiceStatus.REJECTED);

        return mapToDTO(invoiceRepository.save(invoice));
    }

    @Transactional
    public APInvoiceDTO markAsPaid(UUID id) {
        APInvoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found with id: " + id));

        if (invoice.getApprovalStatus() != ApprovalStatus.APPROVED) {
            throw new RuntimeException("Invoice must be approved before marking as paid");
        }

        invoice.setStatus(APInvoiceStatus.PAID);
        return mapToDTO(invoiceRepository.save(invoice));
    }

    @Transactional
    public APInvoiceDTO cancelInvoice(UUID id) {
        APInvoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found with id: " + id));

        if (invoice.getStatus() == APInvoiceStatus.PAID) {
            throw new RuntimeException("Cannot cancel a paid invoice");
        }

        invoice.setStatus(APInvoiceStatus.CANCELLED);
        return mapToDTO(invoiceRepository.save(invoice));
    }

    private void validateInvoiceNumber(String invoiceNumber, UUID excludeId) {
        if (excludeId == null) {
            if (invoiceRepository.existsByInvoiceNumber(invoiceNumber)) {
                throw new RuntimeException("Invoice number already exists: " + invoiceNumber);
            }
        } else {
            if (invoiceRepository.existsByInvoiceNumberAndIdNot(invoiceNumber, excludeId)) {
                throw new RuntimeException("Invoice number already exists: " + invoiceNumber);
            }
        }
    }

    private APInvoiceDTO mapToDTO(APInvoice invoice) {
        return APInvoiceDTO.builder()
                .id(invoice.getId())
                .invoiceNumber(invoice.getInvoiceNumber())
                .vendorId(invoice.getVendor().getId())
                .vendorName(invoice.getVendor().getVendorName())
                .amount(invoice.getAmount())
                .taxAmount(invoice.getTaxAmount())
                .totalAmount(invoice.getTotalAmount())
                .invoiceDate(invoice.getInvoiceDate())
                .dueDate(invoice.getDueDate())
                .description(invoice.getDescription())
                .status(invoice.getStatus())
                .approvalStatus(invoice.getApprovalStatus())
                .approvedBy(invoice.getApprovedBy())
                .approvedAt(invoice.getApprovedAt())
                .lines(invoice.getLines().stream()
                        .map(this::mapLineToDTO)
                        .collect(Collectors.toList()))
                .createdAt(invoice.getCreatedAt())
                .updatedAt(invoice.getUpdatedAt())
                .isOverdue(invoice.isOverdue())
                .build();
    }

    private APInvoiceLineDTO mapLineToDTO(APInvoiceLine line) {
        return APInvoiceLineDTO.builder()
                .id(line.getId())
                .description(line.getDescription())
                .amount(line.getAmount())
                .quantity(line.getQuantity())
                .unitPrice(line.getUnitPrice())
                .build();
    }
}
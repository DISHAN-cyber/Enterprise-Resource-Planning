package com.erp.finance.service;

import com.erp.finance.dto.APPaymentDTO;
import com.erp.finance.dto.APPaymentRequestDTO;
import com.erp.finance.entity.APInvoice;
import com.erp.finance.entity.APPayment;
import com.erp.finance.entity.Vendor;
import com.erp.finance.exception.ResourceNotFoundException;
import com.erp.finance.repository.APInvoiceRepository;
import com.erp.finance.repository.APPaymentRepository;
import com.erp.finance.repository.VendorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class APPaymentService {

    private final APPaymentRepository paymentRepository;
    private final APInvoiceRepository invoiceRepository;
    private final VendorRepository vendorRepository;

    public List<APPaymentDTO> getAllPayments() {
        return paymentRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public APPaymentDTO getPaymentById(UUID id) {
        APPayment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + id));
        return mapToDTO(payment);
    }

    public List<APPaymentDTO> getPaymentsByInvoice(UUID invoiceId) {
        return paymentRepository.findByInvoiceId(invoiceId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<APPaymentDTO> getPaymentsByVendor(UUID vendorId) {
        return paymentRepository.findByVendorId(vendorId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public APPaymentDTO createPayment(APPaymentRequestDTO request) {
        // Validate invoice exists and is approved
        APInvoice invoice = invoiceRepository.findById(request.getInvoiceId())
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found with id: " + request.getInvoiceId()));

        if (invoice.getApprovalStatus() != com.erp.finance.entity.ApprovalStatus.APPROVED) {
            throw new RuntimeException("Invoice must be approved before payment");
        }

        Vendor vendor = vendorRepository.findById(request.getVendorId())
                .orElseThrow(() -> new ResourceNotFoundException("Vendor not found with id: " + request.getVendorId()));

        // Generate payment number
        String paymentNumber = generatePaymentNumber();

        APPayment payment = APPayment.builder()
                .paymentNumber(paymentNumber)
                .invoice(invoice)
                .vendor(vendor)
                .amount(request.getAmount())
                .paymentDate(request.getPaymentDate())
                .paymentMethod(request.getPaymentMethod())
                .referenceNumber(request.getReferenceNumber())
                .notes(request.getNotes())
                .build();

        // Mark invoice as paid
        invoice.setStatus(com.erp.finance.entity.APInvoiceStatus.PAID);
        invoiceRepository.save(invoice);

        return mapToDTO(paymentRepository.save(payment));
    }

    private String generatePaymentNumber() {
        // Simple payment number generation - in production, use a more robust method
        return "PAY-" + System.currentTimeMillis();
    }

    private APPaymentDTO mapToDTO(APPayment payment) {
        return APPaymentDTO.builder()
                .id(payment.getId())
                .paymentNumber(payment.getPaymentNumber())
                .invoiceId(payment.getInvoice().getId())
                .invoiceNumber(payment.getInvoice().getInvoiceNumber())
                .vendorId(payment.getVendor().getId())
                .vendorName(payment.getVendor().getVendorName())
                .amount(payment.getAmount())
                .paymentDate(payment.getPaymentDate())
                .paymentMethod(payment.getPaymentMethod())
                .referenceNumber(payment.getReferenceNumber())
                .notes(payment.getNotes())
                .createdAt(payment.getCreatedAt())
                .build();
    }
}
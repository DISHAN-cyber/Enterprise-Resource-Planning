package com.erp.ap.service;

import com.erp.ap.dto.PaymentDTO;
import com.erp.ap.dto.PaymentRequest;
import com.erp.ap.entity.Invoice;
import com.erp.ap.entity.InvoiceStatus;
import com.erp.ap.entity.Payment;
import com.erp.ap.repository.InvoiceRepository;
import com.erp.ap.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final PaymentRepository paymentRepo;
    private final InvoiceRepository invoiceRepo;

    public List<PaymentDTO> getAllPayments() {
        return paymentRepo.findAll().stream().map(this::mapToDTO).toList();
    }

    @Transactional
    public PaymentDTO createPayment(PaymentRequest req) {
        Invoice invoice = invoiceRepo.findById(req.invoiceId()).orElseThrow();
        if (invoice.getStatus() != InvoiceStatus.APPROVED)
            throw new RuntimeException("Cannot pay unapproved invoice");

        // Create payment record
        Payment payment = Payment.builder()
                .invoice(invoice)
                .amount(req.amount())
                .paymentDate(req.paymentDate())
                .reference(req.reference())
                .build();

        // Update invoice status
        invoice.setStatus(InvoiceStatus.PAID);
        invoiceRepo.save(invoice);

        return mapToDTO(paymentRepo.save(payment));
    }

    private PaymentDTO mapToDTO(Payment p) {
        return new PaymentDTO(p.getId(), p.getInvoice().getId(), p.getAmount(), 
                              p.getPaymentDate(), p.getReference());
    }
}
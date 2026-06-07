package com.erp.finance.controller;

import com.erp.finance.dto.APPaymentDTO;
import com.erp.finance.dto.APPaymentRequestDTO;
import com.erp.finance.service.APPaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/ap/payments")
@RequiredArgsConstructor
public class APPaymentController {

    private final APPaymentService paymentService;

    @GetMapping
    public ResponseEntity<List<APPaymentDTO>> getAllPayments() {
        return ResponseEntity.ok(paymentService.getAllPayments());
    }

    @GetMapping("/{id}")
    public ResponseEntity<APPaymentDTO> getPaymentById(@PathVariable UUID id) {
        return ResponseEntity.ok(paymentService.getPaymentById(id));
    }

    @GetMapping("/invoice/{invoiceId}")
    public ResponseEntity<List<APPaymentDTO>> getPaymentsByInvoice(@PathVariable UUID invoiceId) {
        return ResponseEntity.ok(paymentService.getPaymentsByInvoice(invoiceId));
    }

    @GetMapping("/vendor/{vendorId}")
    public ResponseEntity<List<APPaymentDTO>> getPaymentsByVendor(@PathVariable UUID vendorId) {
        return ResponseEntity.ok(paymentService.getPaymentsByVendor(vendorId));
    }

    @PostMapping
    public ResponseEntity<APPaymentDTO> createPayment(@Valid @RequestBody APPaymentRequestDTO request) {
        APPaymentDTO payment = paymentService.createPayment(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(payment);
    }
}
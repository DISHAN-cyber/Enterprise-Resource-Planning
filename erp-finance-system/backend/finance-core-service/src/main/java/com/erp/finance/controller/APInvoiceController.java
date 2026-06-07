package com.erp.finance.controller;

import com.erp.finance.dto.APInvoiceDTO;
import com.erp.finance.dto.APInvoiceRequestDTO;
import com.erp.finance.dto.ApprovalRequestDTO;
import com.erp.finance.entity.APInvoiceStatus;
import com.erp.finance.service.APInvoiceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/ap/invoices")
@RequiredArgsConstructor
public class APInvoiceController {

    private final APInvoiceService invoiceService;

    @GetMapping
    public ResponseEntity<List<APInvoiceDTO>> getAllInvoices() {
        return ResponseEntity.ok(invoiceService.getAllInvoices());
    }

    @GetMapping("/{id}")
    public ResponseEntity<APInvoiceDTO> getInvoiceById(@PathVariable UUID id) {
        return ResponseEntity.ok(invoiceService.getInvoiceById(id));
    }

    @GetMapping("/number/{invoiceNumber}")
    public ResponseEntity<APInvoiceDTO> getInvoiceByNumber(@PathVariable String invoiceNumber) {
        return ResponseEntity.ok(invoiceService.getInvoiceByNumber(invoiceNumber));
    }

    @GetMapping("/vendor/{vendorId}")
    public ResponseEntity<List<APInvoiceDTO>> getInvoicesByVendor(@PathVariable UUID vendorId) {
        return ResponseEntity.ok(invoiceService.getInvoicesByVendor(vendorId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<APInvoiceDTO>> getInvoicesByStatus(@PathVariable APInvoiceStatus status) {
        return ResponseEntity.ok(invoiceService.getInvoicesByStatus(status));
    }

    @GetMapping("/overdue")
    public ResponseEntity<List<APInvoiceDTO>> getOverdueInvoices() {
        return ResponseEntity.ok(invoiceService.getOverdueInvoices());
    }

    @PostMapping
    public ResponseEntity<APInvoiceDTO> createInvoice(@Valid @RequestBody APInvoiceRequestDTO request) {
        APInvoiceDTO invoice = invoiceService.createInvoice(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(invoice);
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<APInvoiceDTO> approveInvoice(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetails userDetails) {
        // In production, get actual user ID from JWT token
        UUID approvedBy = UUID.randomUUID(); // Replace with actual user ID
        return ResponseEntity.ok(invoiceService.approveInvoice(id, approvedBy));
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<APInvoiceDTO> rejectInvoice(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetails userDetails) {
        UUID rejectedBy = UUID.randomUUID(); // Replace with actual user ID
        return ResponseEntity.ok(invoiceService.rejectInvoice(id, rejectedBy));
    }

    @PostMapping("/{id}/mark-paid")
    public ResponseEntity<APInvoiceDTO> markAsPaid(@PathVariable UUID id) {
        return ResponseEntity.ok(invoiceService.markAsPaid(id));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<APInvoiceDTO> cancelInvoice(@PathVariable UUID id) {
        return ResponseEntity.ok(invoiceService.cancelInvoice(id));
    }
}
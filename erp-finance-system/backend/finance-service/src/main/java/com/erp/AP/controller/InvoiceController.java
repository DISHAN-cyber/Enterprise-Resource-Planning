package com.erp.ap.controller;

import com.erp.ap.dto.InvoiceDTO;
import com.erp.ap.dto.InvoiceRequest;
import com.erp.ap.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/ap/invoices")
@RequiredArgsConstructor
public class InvoiceController {
    private final InvoiceService service;

    @GetMapping
    public ResponseEntity<List<InvoiceDTO>> getAll() {
        return ResponseEntity.ok(service.getAllInvoices());
    }

    @PostMapping
    public ResponseEntity<InvoiceDTO> create(@RequestBody InvoiceRequest req) {
        return ResponseEntity.ok(service.createInvoice(req));
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<InvoiceDTO> approve(@PathVariable UUID id, 
                                              @RequestParam String approver) {
        return ResponseEntity.ok(service.approveInvoice(id, approver));
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<InvoiceDTO> reject(@PathVariable UUID id) {
        return ResponseEntity.ok(service.rejectInvoice(id));
    }

    @PostMapping("/{id}/mark-paid")
    public ResponseEntity<InvoiceDTO> markPaid(@PathVariable UUID id) {
        return ResponseEntity.ok(service.markPaid(id));
    }
}
package com.erp.ap.controller;

import com.erp.ap.dto.VendorDTO;
import com.erp.ap.dto.VendorRequest;
import com.erp.ap.service.VendorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/ap/vendors")
@RequiredArgsConstructor
public class VendorController {
    private final VendorService service;

    @GetMapping
    public ResponseEntity<List<VendorDTO>> getAll() {
        return ResponseEntity.ok(service.getAllVendors());
    }

    @PostMapping
    public ResponseEntity<VendorDTO> create(@RequestBody VendorRequest req) {
        return ResponseEntity.ok(service.createVendor(req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<VendorDTO> update(@PathVariable UUID id, @RequestBody VendorRequest req) {
        return ResponseEntity.ok(service.updateVendor(id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        service.deleteVendor(id);
        return ResponseEntity.noContent().build();
    }
}
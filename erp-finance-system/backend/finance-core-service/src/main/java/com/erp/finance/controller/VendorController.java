package com.erp.finance.controller;

import com.erp.finance.dto.VendorDTO;
import com.erp.finance.dto.VendorRequestDTO;
import com.erp.finance.service.VendorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/ap/vendors")
@RequiredArgsConstructor
public class VendorController {

    private final VendorService vendorService;

    @GetMapping
    public ResponseEntity<List<VendorDTO>> getAllVendors() {
        return ResponseEntity.ok(vendorService.getAllVendors());
    }

    @GetMapping("/{id}")
    public ResponseEntity<VendorDTO> getVendorById(@PathVariable UUID id) {
        return ResponseEntity.ok(vendorService.getVendorById(id));
    }

    @GetMapping("/code/{vendorCode}")
    public ResponseEntity<VendorDTO> getVendorByCode(@PathVariable String vendorCode) {
        return ResponseEntity.ok(vendorService.getVendorByCode(vendorCode));
    }

    @PostMapping
    public ResponseEntity<VendorDTO> createVendor(@Valid @RequestBody VendorRequestDTO request) {
        VendorDTO vendor = vendorService.createVendor(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(vendor);
    }

    @PutMapping("/{id}")
    public ResponseEntity<VendorDTO> updateVendor(
            @PathVariable UUID id,
            @Valid @RequestBody VendorRequestDTO request) {
        return ResponseEntity.ok(vendorService.updateVendor(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVendor(@PathVariable UUID id) {
        vendorService.deleteVendor(id);
        return ResponseEntity.noContent().build();
    }
}
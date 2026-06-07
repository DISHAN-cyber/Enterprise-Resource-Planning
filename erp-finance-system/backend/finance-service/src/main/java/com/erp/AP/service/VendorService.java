package com.erp.ap.service;

import com.erp.ap.dto.VendorDTO;
import com.erp.ap.dto.VendorRequest;
import com.erp.ap.entity.Vendor;
import com.erp.ap.repository.VendorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VendorService {
    private final VendorRepository repository;

    public List<VendorDTO> getAllVendors() {
        return repository.findAll().stream().map(this::mapToDTO).toList();
    }

    public VendorDTO createVendor(VendorRequest req) {
        if (repository.existsByName(req.name()))
            throw new RuntimeException("Vendor name already exists");

        Vendor vendor = Vendor.builder()
                .name(req.name()).email(req.email()).phone(req.phone())
                .address(req.address()).taxId(req.taxId()).build();
        return mapToDTO(repository.save(vendor));
    }

    public VendorDTO updateVendor(UUID id, VendorRequest req) {
        Vendor vendor = repository.findById(id).orElseThrow();
        vendor.setName(req.name());
        vendor.setEmail(req.email());
        vendor.setPhone(req.phone());
        vendor.setAddress(req.address());
        vendor.setTaxId(req.taxId());
        return mapToDTO(repository.save(vendor));
    }

    public void deleteVendor(UUID id) {
        repository.deleteById(id);
    }

    private VendorDTO mapToDTO(Vendor v) {
        return new VendorDTO(v.getId(), v.getName(), v.getEmail(), v.getPhone(), 
                             v.getAddress(), v.getTaxId(), v.getStatus());
    }
}

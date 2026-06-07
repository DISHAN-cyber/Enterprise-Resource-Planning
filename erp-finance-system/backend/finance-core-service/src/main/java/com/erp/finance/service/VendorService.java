package com.erp.finance.service;

import com.erp.finance.dto.VendorDTO;
import com.erp.finance.dto.VendorRequestDTO;
import com.erp.finance.entity.Vendor;
import com.erp.finance.exception.ResourceNotFoundException;
import com.erp.finance.repository.VendorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class VendorService {

    private final VendorRepository vendorRepository;

    public List<VendorDTO> getAllVendors() {
        return vendorRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public VendorDTO getVendorById(UUID id) {
        Vendor vendor = vendorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor not found with id: " + id));
        return mapToDTO(vendor);
    }

    public VendorDTO getVendorByCode(String vendorCode) {
        Vendor vendor = vendorRepository.findByVendorCode(vendorCode)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor not found with code: " + vendorCode));
        return mapToDTO(vendor);
    }

    @Transactional
    public VendorDTO createVendor(VendorRequestDTO request) {
        validateVendorCode(request.getVendorCode(), null);

        Vendor vendor = Vendor.builder()
                .vendorCode(request.getVendorCode())
                .vendorName(request.getVendorName())
                .contactPerson(request.getContactPerson())
                .email(request.getEmail())
                .phone(request.getPhone())
                .address(request.getAddress())
                .taxId(request.getTaxId())
                .status(request.getStatus() != null ? request.getStatus() : com.erp.finance.entity.VendorStatus.ACTIVE)
                .build();

        return mapToDTO(vendorRepository.save(vendor));
    }

    @Transactional
    public VendorDTO updateVendor(UUID id, VendorRequestDTO request) {
        Vendor vendor = vendorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor not found with id: " + id));

        validateVendorCode(request.getVendorCode(), id);

        vendor.setVendorCode(request.getVendorCode());
        vendor.setVendorName(request.getVendorName());
        vendor.setContactPerson(request.getContactPerson());
        vendor.setEmail(request.getEmail());
        vendor.setPhone(request.getPhone());
        vendor.setAddress(request.getAddress());
        vendor.setTaxId(request.getTaxId());
        
        if (request.getStatus() != null) {
            vendor.setStatus(request.getStatus());
        }

        return mapToDTO(vendorRepository.save(vendor));
    }

    @Transactional
    public void deleteVendor(UUID id) {
        Vendor vendor = vendorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor not found with id: " + id));
        vendorRepository.delete(vendor);
    }

    private void validateVendorCode(String vendorCode, UUID excludeId) {
        if (excludeId == null) {
            if (vendorRepository.existsByVendorCode(vendorCode)) {
                throw new RuntimeException("Vendor code already exists: " + vendorCode);
            }
        } else {
            if (vendorRepository.existsByVendorCodeAndIdNot(vendorCode, excludeId)) {
                throw new RuntimeException("Vendor code already exists: " + vendorCode);
            }
        }
    }

    private VendorDTO mapToDTO(Vendor vendor) {
        return VendorDTO.builder()
                .id(vendor.getId())
                .vendorCode(vendor.getVendorCode())
                .vendorName(vendor.getVendorName())
                .contactPerson(vendor.getContactPerson())
                .email(vendor.getEmail())
                .phone(vendor.getPhone())
                .address(vendor.getAddress())
                .taxId(vendor.getTaxId())
                .status(vendor.getStatus())
                .createdAt(vendor.getCreatedAt())
                .updatedAt(vendor.getUpdatedAt())
                .build();
    }
}
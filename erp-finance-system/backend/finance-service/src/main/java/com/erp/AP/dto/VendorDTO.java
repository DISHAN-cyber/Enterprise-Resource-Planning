package com.erp.ap.dto;
import com.erp.ap.entity.VendorStatus;
import java.util.UUID;

public record VendorDTO(
    UUID id,
    String name,
    String email,
    String phone,
    String address,
    String taxId,
    VendorStatus status
) {}

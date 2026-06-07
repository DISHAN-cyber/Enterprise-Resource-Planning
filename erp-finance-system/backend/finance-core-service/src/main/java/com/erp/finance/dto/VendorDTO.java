package com.erp.finance.dto;

import com.erp.finance.entity.VendorStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VendorDTO {
    private UUID id;
    private String vendorCode;
    private String vendorName;
    private String contactPerson;
    private String email;
    private String phone;
    private String address;
    private String taxId;
    private VendorStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
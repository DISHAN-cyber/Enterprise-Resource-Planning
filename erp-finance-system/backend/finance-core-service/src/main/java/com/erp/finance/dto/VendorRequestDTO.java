package com.erp.finance.dto;

import com.erp.finance.entity.VendorStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VendorRequestDTO {
    
    @NotBlank(message = "Vendor code is required")
    @Size(max = 100, message = "Vendor code must not exceed 100 characters")
    private String vendorCode;
    
    @NotBlank(message = "Vendor name is required")
    @Size(max = 255, message = "Vendor name must not exceed 255 characters")
    private String vendorName;
    
    @Size(max = 255, message = "Contact person must not exceed 255 characters")
    private String contactPerson;
    
    @Email(message = "Email must be valid")
    @Size(max = 100, message = "Email must not exceed 100 characters")
    private String email;
    
    @Size(max = 20, message = "Phone must not exceed 20 characters")
    private String phone;
    
    private String address;
    
    @Size(max = 100, message = "Tax ID must not exceed 100 characters")
    private String taxId;
    
    private VendorStatus status;
}
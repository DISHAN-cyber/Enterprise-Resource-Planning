package com.erp.ap.dto;

public record VendorRequest(
    String name,
    String email,
    String phone,
    String address,
    String taxId
) {}
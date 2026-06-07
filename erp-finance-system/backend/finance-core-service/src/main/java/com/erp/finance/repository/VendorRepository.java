package com.erp.finance.repository;

import com.erp.finance.entity.Vendor;
import com.erp.finance.entity.VendorStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface VendorRepository extends JpaRepository<Vendor, UUID> {
    
    Optional<Vendor> findByVendorCode(String vendorCode);
    
    boolean existsByVendorCode(String vendorCode);
    
    boolean existsByVendorCodeAndIdNot(String vendorCode, UUID id);
    
    List<Vendor> findByStatus(VendorStatus status);
    
    List<Vendor> findByVendorNameContainingIgnoreCase(String name);
    
    long countByStatus(VendorStatus status);
}
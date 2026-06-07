package com.erp.ap.repository;

import com.erp.ap.entity.Vendor;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface VendorRepository extends JpaRepository<Vendor, UUID> {
    boolean existsByName(String name);
}
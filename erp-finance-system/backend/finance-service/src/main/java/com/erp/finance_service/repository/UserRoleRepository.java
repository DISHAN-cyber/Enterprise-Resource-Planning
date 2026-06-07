package com.erp.finance_service.repository;

import com.erp.finance_service.model.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRoleRepository extends JpaRepository<UserRole, Long> {
    List<UserRole> findByUserId(Long userId);
    Optional<UserRole> findByUserIdAndRoleId(Long userId, Long roleId);
    void deleteByUserId(Long userId);
}
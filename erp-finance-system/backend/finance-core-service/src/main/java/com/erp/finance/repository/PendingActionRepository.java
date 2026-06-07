package com.erp.finance.repository;

import com.erp.finance.entity.PendingAction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PendingActionRepository extends JpaRepository<PendingAction, UUID> {
    
    List<PendingAction> findByStatusOrderByDueDateAsc(String status);
    
    List<PendingAction> findByStatusAndPriority(String status, String priority);
    
    @Query("SELECT COUNT(p) FROM PendingAction p WHERE p.status = 'PENDING'")
    long countPendingActions();
    
    List<PendingAction> findTop10ByStatusOrderByDueDateAsc(String status);
}
package com.erp.finance_service.repository;

import com.erp.finance_service.model.JournalEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface JournalEntryRepository extends JpaRepository<JournalEntry, Long> {
    List<JournalEntry> findByStatus(JournalEntry.JournalStatus status);
    List<JournalEntry> findByCreatedById(Long userId);
    List<JournalEntry> findByEntryDateBetween(LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT j FROM JournalEntry j WHERE j.status = 'POSTED' AND j.entryDate BETWEEN :startDate AND :endDate")
    List<JournalEntry> findPostedEntriesBetweenDates(LocalDate startDate, LocalDate endDate);
    
    Optional<JournalEntry> findByReferenceNumber(String referenceNumber);
    
    @Query("SELECT MAX(j.referenceNumber) FROM JournalEntry j WHERE j.referenceNumber LIKE :prefix%")
    String findMaxReferenceNumberWithPrefix(String prefix);
}
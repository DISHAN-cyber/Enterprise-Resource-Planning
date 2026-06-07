package com.erp.finance_service.service;

import com.erp.finance_service.model.JournalEntry;
import com.erp.finance_service.model.JournalLine;
import com.erp.finance_service.model.User;
import com.erp.finance_service.repository.JournalEntryRepository;
import com.erp.finance_service.repository.JournalLineRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class JournalEntryService {

    private final JournalEntryRepository journalEntryRepository;
    private final JournalLineRepository journalLineRepository;
    private final UserService userService;

    public JournalEntryService(JournalEntryRepository journalEntryRepository,
                               JournalLineRepository journalLineRepository,
                               UserService userService) {
        this.journalEntryRepository = journalEntryRepository;
        this.journalLineRepository = journalLineRepository;
        this.userService = userService;
    }

    public List<JournalEntry> getAllEntries() {
        return journalEntryRepository.findAll();
    }

    public List<JournalEntry> getEntriesByStatus(JournalEntry.JournalStatus status) {
        return journalEntryRepository.findByStatus(status);
    }

    public JournalEntry getEntryById(Long id) {
        return journalEntryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Journal entry not found: " + id));
    }

    public List<JournalEntry> getEntriesByDateRange(LocalDate startDate, LocalDate endDate) {
        return journalEntryRepository.findByEntryDateBetween(startDate, endDate);
    }

    public List<JournalEntry> getPostedEntriesBetweenDates(LocalDate startDate, LocalDate endDate) {
        return journalEntryRepository.findPostedEntriesBetweenDates(startDate, endDate);
    }

    @Transactional
    public JournalEntry createEntry(JournalEntry entry) {
        User currentUser = userService.getCurrentUser();
        entry.setCreatedBy(currentUser);
        
        // Generate reference number
        String refNumber = generateReferenceNumber();
        entry.setReferenceNumber(refNumber);
        
        // Validate debits equal credits
        if (entry.getTotalDebit().compareTo(entry.getTotalCredit()) != 0) {
            throw new IllegalArgumentException("Debits must equal credits. Debits: " 
                + entry.getTotalDebit() + ", Credits: " + entry.getTotalCredit());
        }
        
        return journalEntryRepository.save(entry);
    }

    @Transactional
    public JournalEntry addLineToEntry(Long entryId, JournalLine line) {
        JournalEntry entry = getEntryById(entryId);
        if (entry.getStatus() != JournalEntry.JournalStatus.DRAFT) {
            throw new IllegalStateException("Can only add lines to DRAFT entries.");
        }
        entry.addLine(line);
        return journalEntryRepository.save(entry);
    }

    @Transactional
    public JournalEntry postEntry(Long id) {
        JournalEntry entry = getEntryById(id);
        
        if (entry.getStatus() != JournalEntry.JournalStatus.DRAFT) {
            throw new IllegalStateException("Only DRAFT entries can be posted.");
        }
        
        if (entry.getLines().isEmpty()) {
            throw new IllegalArgumentException("Cannot post an entry with no lines.");
        }
        
        if (entry.getTotalDebit().compareTo(entry.getTotalCredit()) != 0) {
            throw new IllegalArgumentException("Debits must equal credits before posting.");
        }
        
        entry.setStatus(JournalEntry.JournalStatus.POSTED);
        entry.setPostedAt(java.time.Instant.now());
        return journalEntryRepository.save(entry);
    }

    @Transactional
    public JournalEntry reverseEntry(Long id) {
        JournalEntry original = getEntryById(id);
        
        if (original.getStatus() != JournalEntry.JournalStatus.POSTED) {
            throw new IllegalStateException("Only POSTED entries can be reversed.");
        }
        
        JournalEntry reversal = JournalEntry.builder()
                .entryDate(LocalDate.now())
                .description("Reversal of entry: " + original.getReferenceNumber())
                .referenceNumber(generateReferenceNumber())
                .status(JournalEntry.JournalStatus.DRAFT)
                .createdBy(original.getCreatedBy())
                .reversedEntry(original)
                .build();
        
        // Create reversal lines (swap debits and credits)
        for (JournalLine line : original.getLines()) {
            JournalLine reversalLine = JournalLine.builder()
                    .account(line.getAccount())
                    .debitAmount(line.getCreditAmount())
                    .creditAmount(line.getDebitAmount())
                    .description("Reversal: " + line.getDescription())
                    .build();
            reversal.addLine(reversalLine);
        }
        
        original.setStatus(JournalEntry.JournalStatus.REVERSED);
        journalEntryRepository.save(original);
        
        return journalEntryRepository.save(reversal);
    }

    @Transactional
    public void deleteEntry(Long id) {
        JournalEntry entry = getEntryById(id);
        if (entry.getStatus() == JournalEntry.JournalStatus.POSTED) {
            throw new IllegalStateException("Cannot delete a POSTED entry.");
        }
        journalEntryRepository.delete(entry);
    }

    private String generateReferenceNumber() {
        String prefix = "JE-" + LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")) + "-";
        String maxRef = journalEntryRepository.findMaxReferenceNumberWithPrefix(prefix);
        
        int nextNum = 1;
        if (maxRef != null) {
            String numPart = maxRef.substring(prefix.length());
            nextNum = Integer.parseInt(numPart) + 1;
        }
        
        return prefix + String.format("%04d", nextNum);
    }
}
package com.erp.finance.service;

import com.erp.finance.dto.JournalEntryRequestDTO;
import com.erp.finance.entity.*;
import com.erp.finance.exception.ResourceNotFoundException;
import com.erp.finance.repository.AccountRepository;
import com.erp.finance.repository.JournalEntryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class JournalEntryService {

    private final JournalEntryRepository journalEntryRepository;
    private final AccountRepository accountRepository;

    // Create a new Journal Entry
    @Transactional
    public JournalEntry createJournalEntry(JournalEntryRequestDTO request) {
        validateBalanced(request.getLines());

        JournalEntry entry = JournalEntry.builder()
                .transactionDate(request.getTransactionDate())
                .description(request.getDescription())
                .status(JournalEntryStatus.DRAFT)
                .build();

        for (JournalEntryRequestDTO.LineItemDTO lineDto : request.getLines()) {
            Account account = accountRepository.findById(lineDto.getAccountId())
                    .orElseThrow(() -> new ResourceNotFoundException("Account not found"));

            JournalEntryLine line = JournalEntryLine.builder()
                    .account(account)
                    .description(lineDto.getDescription())
                    .debitAmount(BigDecimal.valueOf(lineDto.getDebitAmount()))
                    .creditAmount(BigDecimal.valueOf(lineDto.getCreditAmount()))
                    .build();
            
            entry.getLines().add(line);
        }

        // Generate a unique reference number before saving
        entry.generateTransactionNumber("JE");
        
        return journalEntryRepository.save(entry);
    }

    // Post the entry (lock it and update account balances)
    @Transactional
    public JournalEntry postJournalEntry(UUID id) {
        JournalEntry entry = journalEntryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Journal Entry not found"));

        if (entry.getStatus() != JournalEntryStatus.DRAFT) {
            throw new IllegalStateException("Only Draft entries can be posted");
        }

        entry.setStatus(JournalEntryStatus.POSTED);
        
        // TODO: Update Account Balances here based on Debits/Credits
        
        return journalEntryRepository.save(entry);
    }

    // Get all entries
    public List<JournalEntry> getAllEntries() {
        return journalEntryRepository.findAllByOrderByTransactionDateDesc();
    }

    // Validation Helper: Debits must equal Credits
    private void validateBalanced(List<JournalEntryRequestDTO.LineItemDTO> lines) {
        BigDecimal totalDebit = BigDecimal.ZERO;
        BigDecimal totalCredit = BigDecimal.ZERO;

        for (JournalEntryRequestDTO.LineItemDTO line : lines) {
            totalDebit = totalDebit.add(BigDecimal.valueOf(line.getDebitAmount()));
            totalCredit = totalCredit.add(BigDecimal.valueOf(line.getCreditAmount()));
        }

        if (totalDebit.compareTo(totalCredit) != 0) {
            throw new IllegalArgumentException("Journal entry is not balanced! Total Debit: " + totalDebit + ", Total Credit: " + totalCredit);
        }
    }
}
package com.erp.finance.controller;

import com.erp.finance.dto.JournalEntryRequestDTO;
import com.erp.finance.entity.JournalEntry;
import com.erp.finance.service.JournalEntryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/general-ledger")
@RequiredArgsConstructor
public class JournalEntryController {

    private final JournalEntryService journalEntryService;

    /**
     * GET /api/general-ledger
     * Get all journal entries
     */
    @GetMapping
    public ResponseEntity<List<JournalEntry>> getAllEntries() {
        return ResponseEntity.ok(journalEntryService.getAllEntries());
    }

    /**
     * POST /api/general-ledger
     * Create a new journal entry
     */
    @PostMapping
    public ResponseEntity<JournalEntry> createEntry(@Valid @RequestBody JournalEntryRequestDTO request) {
        JournalEntry created = journalEntryService.createJournalEntry(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * POST /api/general-ledger/{id}/post
     * Post a journal entry (finalize it)
     */
    @PostMapping("/{id}/post")
    public ResponseEntity<JournalEntry> postEntry(@PathVariable UUID id) {
        JournalEntry posted = journalEntryService.postJournalEntry(id);
        return ResponseEntity.ok(posted);
    }
}
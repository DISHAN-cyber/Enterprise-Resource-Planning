package com.erp.finance_service.controller;

import com.erp.finance_service.model.JournalEntry;
import com.erp.finance_service.model.JournalLine;
import com.erp.finance_service.service.JournalEntryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/journal")
public class JournalEntryController {

    private final JournalEntryService journalEntryService;

    public JournalEntryController(JournalEntryService journalEntryService) {
        this.journalEntryService = journalEntryService;
    }

    @GetMapping
    public ResponseEntity<List<JournalEntry>> getAllEntries() {
        return ResponseEntity.ok(journalEntryService.getAllEntries());
    }

    @GetMapping("/{id}")
    public ResponseEntity<JournalEntry> getEntryById(@PathVariable Long id) {
        return ResponseEntity.ok(journalEntryService.getEntryById(id));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<JournalEntry>> getEntriesByStatus(@PathVariable JournalEntry.JournalStatus status) {
        return ResponseEntity.ok(journalEntryService.getEntriesByStatus(status));
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<JournalEntry>> getEntriesByDateRange(
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {
        return ResponseEntity.ok(journalEntryService.getEntriesByDateRange(startDate, endDate));
    }

    @GetMapping("/posted")
    public ResponseEntity<List<JournalEntry>> getPostedEntries(
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {
        return ResponseEntity.ok(journalEntryService.getPostedEntriesBetweenDates(startDate, endDate));
    }

    @PostMapping
    public ResponseEntity<JournalEntry> createEntry(@RequestBody JournalEntry entry) {
        return ResponseEntity.ok(journalEntryService.createEntry(entry));
    }

    @PostMapping("/{id}/lines")
    public ResponseEntity<JournalEntry> addLine(@PathVariable Long id, @RequestBody JournalLine line) {
        return ResponseEntity.ok(journalEntryService.addLineToEntry(id, line));
    }

    @PostMapping("/{id}/post")
    public ResponseEntity<JournalEntry> postEntry(@PathVariable Long id) {
        return ResponseEntity.ok(journalEntryService.postEntry(id));
    }

    @PostMapping("/{id}/reverse")
    public ResponseEntity<JournalEntry> reverseEntry(@PathVariable Long id) {
        return ResponseEntity.ok(journalEntryService.reverseEntry(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEntry(@PathVariable Long id) {
        journalEntryService.deleteEntry(id);
        return ResponseEntity.noContent().build();
    }
}
package com.erp.finance.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
public class JournalEntryRequestDTO {
    
    @NotNull
    private LocalDate transactionDate;

    private String description;

    @Valid
    @NotEmpty(message = "Journal entry must have at least one line")
    private List<LineItemDTO> lines;

    @Data
    public static class LineItemDTO {
        @NotNull
        private UUID accountId;
        private String description;
        private double debitAmount;
        private double creditAmount;
    }
}
package com.erp.finance.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PendingActionDTO {
    private UUID id;
    private String action;
    private String module;
    private Priority priority;
    private LocalDate dueDate;
    private Status status;
    private String assignedTo;

    public enum Priority {
        HIGH, MEDIUM, LOW
    }

    public enum Status {
        PENDING, IN_PROGRESS, COMPLETED
    }
}
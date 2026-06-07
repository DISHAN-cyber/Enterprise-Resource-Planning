package com.erp.finance.dto;

import com.erp.finance.entity.ApprovalStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApprovalRequestDTO {
    
    @NotNull(message = "Approval status is required")
    private ApprovalStatus approvalStatus;
    
    private String comments;
}
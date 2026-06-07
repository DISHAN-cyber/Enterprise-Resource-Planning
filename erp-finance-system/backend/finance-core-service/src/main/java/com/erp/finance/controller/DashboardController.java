package com.erp.finance.controller;

import com.erp.finance.dto.dashboard.DashboardSummaryDTO;
import com.erp.finance.dto.dashboard.FinancialOverviewDTO;
import com.erp.finance.dto.dashboard.PendingActionDTO;
import com.erp.finance.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    /**
     * GET /api/dashboard/summary
     * Get dashboard summary with financial metrics
     */
    @GetMapping("/summary")
    public ResponseEntity<DashboardSummaryDTO> getDashboardSummary(
            @AuthenticationPrincipal UserDetails userDetails) {
        DashboardSummaryDTO summary = dashboardService.getDashboardSummary();
        return ResponseEntity.ok(summary);
    }

    /**
     * GET /api/dashboard/financial-overview
     * Get financial overview chart data
     */
    @GetMapping("/financial-overview")
    public ResponseEntity<FinancialOverviewDTO> getFinancialOverview(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "Last Year") String period) {
        FinancialOverviewDTO overview = dashboardService.getFinancialOverview(period);
        return ResponseEntity.ok(overview);
    }

    /**
     * GET /api/dashboard/pending-actions
     * Get list of pending actions
     */
    @GetMapping("/pending-actions")
    public ResponseEntity<List<PendingActionDTO>> getPendingActions(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<PendingActionDTO> actions = dashboardService.getPendingActions();
        return ResponseEntity.ok(actions);
    }

    /**
     * POST /api/dashboard/pending-actions/{actionId}/complete
     * Mark a specific action as complete
     */
    @PostMapping("/pending-actions/{actionId}/complete")
    public ResponseEntity<?> markActionComplete(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable UUID actionId) {
        boolean success = dashboardService.markActionComplete(actionId);
        if (success) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.badRequest().body("Failed to mark action as complete");
    }

    /**
     * POST /api/dashboard/pending-actions/mark-all-complete
     * Mark all pending actions as complete
     */
    @PostMapping("/pending-actions/mark-all-complete")
    public ResponseEntity<?> markAllActionsComplete(
            @AuthenticationPrincipal UserDetails userDetails) {
        boolean success = dashboardService.markAllActionsComplete();
        if (success) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.badRequest().body("Failed to mark all actions as complete");
    }
}
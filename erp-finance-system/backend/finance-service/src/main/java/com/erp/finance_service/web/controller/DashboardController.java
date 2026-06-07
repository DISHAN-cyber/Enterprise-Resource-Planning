package com.erp.finance_service.web.controller;

import com.erp.finance_service.dto.DashboardResponse;
import com.erp.finance_service.dto.UserProfileDto;
import com.erp.finance_service.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final UserService userService;

    public DashboardController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<DashboardResponse> getDashboard() {
        UserProfileDto currentUser = userService.getCurrentUserProfile();
        DashboardResponse response = DashboardResponse.builder()
                .welcomeMessage("Welcome back, " + (currentUser.getDisplayName() != null ? currentUser.getDisplayName() : currentUser.getUsername()))
                .companyName("General Business")
                .totalRevenue("$245,830.00")
                .accountsReceivable("$42,560.00")
                .accountsPayable("$18,200.00")
                .openTasks(6)
                .userName(currentUser.getDisplayName() != null ? currentUser.getDisplayName() : currentUser.getUsername())
                .build();
        return ResponseEntity.ok(response);
    }
}

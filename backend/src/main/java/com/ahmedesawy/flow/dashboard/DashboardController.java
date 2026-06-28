package com.ahmedesawy.flow.dashboard;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ahmedesawy.flow.dashboard.dto.DashboardResponseDTO;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/dashboard")
public class DashboardController {

   private final DashboardService dashboardService;

   @GetMapping
   public ResponseEntity<DashboardResponseDTO> getDashboard(
      @RequestParam(required = false)Integer year
   ) {
      return ResponseEntity.ok(dashboardService.getDashboardData(year));
   }
}

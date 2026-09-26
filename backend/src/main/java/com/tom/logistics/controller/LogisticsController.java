package com.tom.logistics.controller;

import com.tom.common.dto.ApiResponse;
import com.tom.logistics.domain.WeighbridgeTicket;
import com.tom.logistics.service.LogisticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/logistics")
@RequiredArgsConstructor
public class LogisticsController {

    private final LogisticsService logisticsService;

    @GetMapping("/tickets")
    public ResponseEntity<ApiResponse<List<WeighbridgeTicket>>> getTickets() {
        return ResponseEntity.ok(ApiResponse.success(logisticsService.getAllTickets()));
    }

    @PostMapping("/tickets")
    public ResponseEntity<ApiResponse<WeighbridgeTicket>> createTicket(@RequestBody WeighbridgeTicket ticket) {
        return ResponseEntity.ok(ApiResponse.success(logisticsService.createTicket(ticket)));
    }
}

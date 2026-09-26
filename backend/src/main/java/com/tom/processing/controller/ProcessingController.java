package com.tom.processing.controller;

import com.tom.common.dto.ApiResponse;
import com.tom.processing.domain.MachineUnit;
import com.tom.processing.domain.ProcessingRun;
import com.tom.processing.service.ProcessingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/processing")
@RequiredArgsConstructor
public class ProcessingController {

    private final ProcessingService processingService;

    @GetMapping("/machines")
    public ResponseEntity<ApiResponse<List<MachineUnit>>> getMachines() {
        return ResponseEntity.ok(ApiResponse.success(processingService.getAllMachines()));
    }

    @PutMapping("/machines/{id}/toggle")
    public ResponseEntity<ApiResponse<MachineUnit>> toggleMachine(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(processingService.toggleMachineStatus(id)));
    }

    @GetMapping("/runs")
    public ResponseEntity<ApiResponse<List<ProcessingRun>>> getRuns() {
        return ResponseEntity.ok(ApiResponse.success(processingService.getAllRuns()));
    }

    @PostMapping("/runs")
    public ResponseEntity<ApiResponse<ProcessingRun>> createRun(@RequestBody ProcessingRun run) {
        return ResponseEntity.ok(ApiResponse.success(processingService.recordRun(run)));
    }
}

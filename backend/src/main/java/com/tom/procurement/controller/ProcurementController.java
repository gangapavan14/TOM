package com.tom.procurement.controller;

import com.tom.common.dto.ApiResponse;
import com.tom.procurement.domain.ProcurementDeal;
import com.tom.procurement.domain.ProcurementRequirement;
import com.tom.procurement.domain.Supplier;
import com.tom.procurement.service.ProcurementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/procurement")
@RequiredArgsConstructor
public class ProcurementController {

    private final ProcurementService procurementService;

    @GetMapping("/suppliers")
    public ResponseEntity<ApiResponse<List<Supplier>>> getSuppliers() {
        return ResponseEntity.ok(ApiResponse.success(procurementService.getAllSuppliers()));
    }

    @GetMapping("/requirements")
    public ResponseEntity<ApiResponse<List<ProcurementRequirement>>> getRequirements() {
        return ResponseEntity.ok(ApiResponse.success(procurementService.getAllRequirements()));
    }

    @PostMapping("/requirements")
    public ResponseEntity<ApiResponse<ProcurementRequirement>> createRequirement(@RequestBody ProcurementRequirement req) {
        return ResponseEntity.ok(ApiResponse.success(procurementService.createRequirement(req)));
    }

    @GetMapping("/deals")
    public ResponseEntity<ApiResponse<List<ProcurementDeal>>> getDeals() {
        return ResponseEntity.ok(ApiResponse.success(procurementService.getAllDeals()));
    }

    @PostMapping("/deals")
    public ResponseEntity<ApiResponse<ProcurementDeal>> createDeal(@RequestBody ProcurementDeal deal) {
        return ResponseEntity.ok(ApiResponse.success(procurementService.createDeal(deal)));
    }
}

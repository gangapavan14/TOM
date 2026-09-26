package com.tom.inventory.controller;

import com.tom.common.dto.ApiResponse;
import com.tom.inventory.domain.InventoryBatch;
import com.tom.inventory.domain.Warehouse;
import com.tom.inventory.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    @GetMapping("/warehouses")
    public ResponseEntity<ApiResponse<List<Warehouse>>> getWarehouses() {
        return ResponseEntity.ok(ApiResponse.success(inventoryService.getAllWarehouses()));
    }

    @GetMapping("/batches")
    public ResponseEntity<ApiResponse<List<InventoryBatch>>> getBatches() {
        return ResponseEntity.ok(ApiResponse.success(inventoryService.getAllBatches()));
    }

    @PostMapping("/batches")
    public ResponseEntity<ApiResponse<InventoryBatch>> createBatch(@RequestBody InventoryBatch batch) {
        return ResponseEntity.ok(ApiResponse.success(inventoryService.createBatch(batch)));
    }
}

package com.tom.sales.controller;

import com.tom.common.dto.ApiResponse;
import com.tom.sales.domain.Customer;
import com.tom.sales.domain.SalesOrder;
import com.tom.sales.service.SalesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sales")
@RequiredArgsConstructor
public class SalesController {

    private final SalesService salesService;

    @GetMapping("/customers")
    public ResponseEntity<ApiResponse<List<Customer>>> getCustomers() {
        return ResponseEntity.ok(ApiResponse.success(salesService.getAllCustomers()));
    }

    @GetMapping("/orders")
    public ResponseEntity<ApiResponse<List<SalesOrder>>> getOrders() {
        return ResponseEntity.ok(ApiResponse.success(salesService.getAllOrders()));
    }

    @PostMapping("/orders")
    public ResponseEntity<ApiResponse<SalesOrder>> createOrder(@RequestBody SalesOrder order) {
        return ResponseEntity.ok(ApiResponse.success(salesService.createOrder(order)));
    }
}

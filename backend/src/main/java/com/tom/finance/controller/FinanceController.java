package com.tom.finance.controller;

import com.tom.common.dto.ApiResponse;
import com.tom.finance.domain.FinancialTransaction;
import com.tom.finance.service.FinanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/finance")
@RequiredArgsConstructor
public class FinanceController {

    private final FinanceService financeService;

    @GetMapping("/transactions")
    public ResponseEntity<ApiResponse<List<FinancialTransaction>>> getTransactions() {
        return ResponseEntity.ok(ApiResponse.success(financeService.getAllTransactions()));
    }

    @PostMapping("/transactions")
    public ResponseEntity<ApiResponse<FinancialTransaction>> createTransaction(@RequestBody FinancialTransaction txn) {
        return ResponseEntity.ok(ApiResponse.success(financeService.recordTransaction(txn)));
    }
}

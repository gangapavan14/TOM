package com.tom.workforce.controller;

import com.tom.common.dto.ApiResponse;
import com.tom.workforce.domain.Attendance;
import com.tom.workforce.domain.Employee;
import com.tom.workforce.domain.PayrollRecord;
import com.tom.workforce.domain.TemporaryWorkerApplication;
import com.tom.workforce.service.WorkforceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workforce")
@RequiredArgsConstructor
public class WorkforceController {

    private final WorkforceService workforceService;

    @GetMapping("/employees")
    public ResponseEntity<ApiResponse<List<Employee>>> getEmployees() {
        return ResponseEntity.ok(ApiResponse.success(workforceService.getAllEmployees()));
    }

    @PostMapping("/employees")
    public ResponseEntity<ApiResponse<Employee>> createEmployee(@RequestBody Employee employee) {
        return ResponseEntity.ok(ApiResponse.success(workforceService.saveEmployee(employee)));
    }

    @GetMapping("/attendance/today")
    public ResponseEntity<ApiResponse<List<Attendance>>> getTodayAttendance() {
        return ResponseEntity.ok(ApiResponse.success(workforceService.getTodayAttendance()));
    }

    @PostMapping("/attendance")
    public ResponseEntity<ApiResponse<Attendance>> recordAttendance(@RequestBody Attendance attendance) {
        return ResponseEntity.ok(ApiResponse.success(workforceService.recordAttendance(attendance)));
    }

    @GetMapping("/temp-applications")
    public ResponseEntity<ApiResponse<List<TemporaryWorkerApplication>>> getTempApplications() {
        return ResponseEntity.ok(ApiResponse.success(workforceService.getTemporaryApplications()));
    }

    @PostMapping("/temp-applications")
    public ResponseEntity<ApiResponse<TemporaryWorkerApplication>> applyTemporary(@RequestBody TemporaryWorkerApplication app) {
        return ResponseEntity.ok(ApiResponse.success(workforceService.applyTemporary(app)));
    }

    @PutMapping("/temp-applications/{id}/approve")
    public ResponseEntity<ApiResponse<TemporaryWorkerApplication>> approveTemporary(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(workforceService.approveTemporary(id)));
    }

    @GetMapping("/payroll")
    public ResponseEntity<ApiResponse<List<PayrollRecord>>> getPayroll() {
        return ResponseEntity.ok(ApiResponse.success(workforceService.getPayrollRecords()));
    }

    @PostMapping("/payroll/disburse-all")
    public ResponseEntity<ApiResponse<String>> disburseAll() {
        workforceService.disburseAll();
        return ResponseEntity.ok(ApiResponse.success("All pending payrolls disbursed successfully"));
    }
}

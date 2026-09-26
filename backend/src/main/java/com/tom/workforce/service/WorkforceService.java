package com.tom.workforce.service;

import com.tom.workforce.domain.Attendance;
import com.tom.workforce.domain.Employee;
import com.tom.workforce.domain.PayrollRecord;
import com.tom.workforce.domain.TemporaryWorkerApplication;
import com.tom.workforce.repository.AttendanceRepository;
import com.tom.workforce.repository.EmployeeRepository;
import com.tom.workforce.repository.PayrollRecordRepository;
import com.tom.workforce.repository.TemporaryWorkerApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WorkforceService {

    private final EmployeeRepository employeeRepository;
    private final AttendanceRepository attendanceRepository;
    private final TemporaryWorkerApplicationRepository tempWorkerRepository;
    private final PayrollRecordRepository payrollRepository;

    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    public Employee saveEmployee(Employee employee) {
        if (employee.getEmployeeCode() == null) {
            employee.setEmployeeCode("EMP-" + System.currentTimeMillis() % 100000);
        }
        return employeeRepository.save(employee);
    }

    public List<Attendance> getTodayAttendance() {
        return attendanceRepository.findByAttendanceDate(LocalDate.now());
    }

    public Attendance recordAttendance(Attendance attendance) {
        if (attendance.getAttendanceDate() == null) {
            attendance.setAttendanceDate(LocalDate.now());
        }
        return attendanceRepository.save(attendance);
    }

    public List<TemporaryWorkerApplication> getTemporaryApplications() {
        return tempWorkerRepository.findAll();
    }

    public TemporaryWorkerApplication applyTemporary(TemporaryWorkerApplication app) {
        app.setStatus("PENDING");
        return tempWorkerRepository.save(app);
    }

    @Transactional
    public TemporaryWorkerApplication approveTemporary(Long id) {
        TemporaryWorkerApplication app = tempWorkerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        app.setStatus("APPROVED");
        app.setApprovedAt(LocalDateTime.now());
        return tempWorkerRepository.save(app);
    }

    public List<PayrollRecord> getPayrollRecords() {
        return payrollRepository.findAll();
    }

    @Transactional
    public void disburseAll() {
        List<PayrollRecord> records = payrollRepository.findByStatus("GENERATED");
        for (PayrollRecord rec : records) {
            rec.setStatus("PAID");
            rec.setDisbursedAt(LocalDateTime.now());
        }
        payrollRepository.saveAll(records);
    }
}

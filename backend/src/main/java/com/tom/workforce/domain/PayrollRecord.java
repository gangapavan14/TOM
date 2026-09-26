package com.tom.workforce.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payroll_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PayrollRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "payroll_code", nullable = false, unique = true, length = 50)
    private String payrollCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(name = "month_name", nullable = false, length = 30)
    private String monthName;

    @Column(name = "year_val", nullable = false)
    private Integer yearVal;

    @Column(name = "base_salary", precision = 12, scale = 2, nullable = false)
    private BigDecimal baseSalary;

    @Column(name = "days_worked", nullable = false)
    @Builder.Default
    private Integer daysWorked = 26;

    @Column(name = "overtime_pay", precision = 10, scale = 2, nullable = false)
    @Builder.Default
    private BigDecimal overtimePay = BigDecimal.ZERO;

    @Column(precision = 10, scale = 2, nullable = false)
    @Builder.Default
    private BigDecimal deductions = BigDecimal.ZERO;

    @Column(name = "net_pay", precision = 12, scale = 2, nullable = false)
    private BigDecimal netPay;

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String status = "GENERATED"; // GENERATED, APPROVED, PAID

    @Column(name = "disbursed_at")
    private LocalDateTime disbursedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}

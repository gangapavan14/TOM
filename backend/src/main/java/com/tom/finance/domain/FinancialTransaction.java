package com.tom.finance.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "financial_transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FinancialTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "txn_code", nullable = false, unique = true, length = 50)
    private String txnCode;

    @Column(name = "txn_type", nullable = false, length = 20)
    private String txnType; // CREDIT, DEBIT

    @Column(nullable = false, length = 50)
    private String category; // SALES_COLLECTION, SUPPLIER_PAYMENT, PAYROLL, OPERATING_EXPENSE, MAINTENANCE

    @Column(precision = 14, scale = 2, nullable = false)
    private BigDecimal amount;

    @Column(name = "reference_id", length = 50)
    private String referenceId;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "txn_date", nullable = false)
    @Builder.Default
    private LocalDateTime txnDate = LocalDateTime.now();
}

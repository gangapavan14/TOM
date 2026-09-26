package com.tom.processing.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "processing_runs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProcessingRun {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "run_code", nullable = false, unique = true, length = 50)
    private String runCode;

    @Column(name = "seed_input_kg", precision = 12, scale = 2, nullable = false)
    private BigDecimal seedInputKg;

    @Column(name = "crude_oil_kg", precision = 12, scale = 2, nullable = false)
    private BigDecimal crudeOilKg;

    @Column(name = "cake_output_kg", precision = 12, scale = 2, nullable = false)
    private BigDecimal cakeOutputKg;

    @Column(name = "waste_loss_kg", precision = 12, scale = 2, nullable = false)
    private BigDecimal wasteLossKg;

    @Column(name = "shift_name", nullable = false, length = 50)
    private String shiftName;

    @Column(nullable = false, length = 100)
    private String supervisor;

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String status = "IN_PROGRESS"; // IN_PROGRESS, COMPLETED

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}

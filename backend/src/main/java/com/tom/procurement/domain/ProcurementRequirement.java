package com.tom.procurement.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "procurement_requirements")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProcurementRequirement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "req_code", nullable = false, unique = true, length = 50)
    private String reqCode;

    @Column(nullable = false, length = 100)
    private String commodity;

    @Column(name = "required_bags", nullable = false)
    private Integer requiredBags;

    @Column(name = "required_kg", precision = 12, scale = 2, nullable = false)
    private BigDecimal requiredKg;

    @Column(name = "target_price", precision = 10, scale = 2)
    private BigDecimal targetPrice;

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String status = "OPEN"; // OPEN, RESERVED, PARTIALLY_FULFILLED, CLOSED

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}

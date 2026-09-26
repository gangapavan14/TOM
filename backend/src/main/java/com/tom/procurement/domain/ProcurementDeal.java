package com.tom.procurement.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "procurement_deals")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProcurementDeal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "deal_code", nullable = false, unique = true, length = 50)
    private String dealCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requirement_id")
    private ProcurementRequirement requirement;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "supplier_id", nullable = false)
    private Supplier supplier;

    @Column(nullable = false, length = 100)
    private String commodity;

    @Column(nullable = false)
    private Integer bags;

    @Column(name = "total_kg", precision = 12, scale = 2, nullable = false)
    private BigDecimal totalKg;

    @Column(name = "rate_per_kg", precision = 10, scale = 2, nullable = false)
    private BigDecimal ratePerKg;

    @Column(name = "advance_amount", precision = 12, scale = 2, nullable = false)
    @Builder.Default
    private BigDecimal advanceAmount = BigDecimal.ZERO;

    @Column(name = "deal_status", nullable = false, length = 30)
    @Builder.Default
    private String dealStatus = "CONFIRMED"; // DRAFT, CONFIRMED, DELIVERED, CANCELLED

    @Column(name = "quality_status", nullable = false, length = 30)
    @Builder.Default
    private String qualityStatus = "PENDING"; // PENDING, PASSED, REJECTED

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}

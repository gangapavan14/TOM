package com.tom.inventory.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "inventory_batches")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryBatch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "batch_code", nullable = false, unique = true, length = 50)
    private String batchCode;

    @Column(nullable = false, length = 100)
    private String commodity;

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String grade = "A";

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "warehouse_id", nullable = false)
    private Warehouse warehouse;

    @Column(name = "room_section", nullable = false, length = 50)
    @Builder.Default
    private String roomSection = "Room A";

    @Column(nullable = false)
    @Builder.Default
    private Integer bags = 0;

    @Column(name = "total_kg", precision = 12, scale = 2, nullable = false)
    @Builder.Default
    private BigDecimal totalKg = BigDecimal.ZERO;

    @Column(name = "cost_per_kg", precision = 10, scale = 2, nullable = false)
    @Builder.Default
    private BigDecimal costPerKg = BigDecimal.ZERO;

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String status = "IN_STOCK";

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}

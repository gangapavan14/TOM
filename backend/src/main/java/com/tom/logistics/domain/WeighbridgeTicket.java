package com.tom.logistics.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "weighbridge_tickets")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WeighbridgeTicket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ticket_code", nullable = false, unique = true, length = 50)
    private String ticketCode;

    @Column(name = "vehicle_no", nullable = false, length = 50)
    private String vehicleNo;

    @Column(name = "driver_name", nullable = false, length = 150)
    private String driverName;

    @Column(name = "driver_phone", nullable = false, length = 20)
    private String driverPhone;

    @Column(nullable = false, length = 100)
    private String material;

    @Column(name = "gross_weight", precision = 10, scale = 2, nullable = false)
    @Builder.Default
    private BigDecimal grossWeight = BigDecimal.ZERO;

    @Column(name = "tare_weight", precision = 10, scale = 2, nullable = false)
    @Builder.Default
    private BigDecimal tareWeight = BigDecimal.ZERO;

    @Column(name = "net_weight", precision = 10, scale = 2, nullable = false)
    @Builder.Default
    private BigDecimal netWeight = BigDecimal.ZERO;

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String status = "ON_WEIGHBRIDGE"; // GATE_ENTRY, ON_WEIGHBRIDGE, UNLOADING, COMPLETED

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}

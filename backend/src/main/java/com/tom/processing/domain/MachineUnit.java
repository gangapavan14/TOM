package com.tom.processing.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "machine_units")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MachineUnit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "machine_code", nullable = false, unique = true, length = 50)
    private String machineCode;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "machine_type", nullable = false, length = 50)
    private String machineType;

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String status = "RUNNING";

    @Column(length = 30)
    private String temperature;

    @Column(name = "current_load", length = 30)
    private String currentLoad;

    @Column(length = 30)
    private String rpm;

    @Column(name = "output_rate", length = 50)
    private String outputRate;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}

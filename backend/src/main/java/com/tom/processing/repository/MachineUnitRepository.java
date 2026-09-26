package com.tom.processing.repository;

import com.tom.processing.domain.MachineUnit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MachineUnitRepository extends JpaRepository<MachineUnit, Long> {
    Optional<MachineUnit> findByMachineCode(String machineCode);
}

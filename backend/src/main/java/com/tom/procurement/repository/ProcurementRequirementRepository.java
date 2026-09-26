package com.tom.procurement.repository;

import com.tom.procurement.domain.ProcurementRequirement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProcurementRequirementRepository extends JpaRepository<ProcurementRequirement, Long> {
    List<ProcurementRequirement> findByStatus(String status);
}

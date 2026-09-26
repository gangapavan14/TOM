package com.tom.procurement.repository;

import com.tom.procurement.domain.ProcurementDeal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProcurementDealRepository extends JpaRepository<ProcurementDeal, Long> {
    List<ProcurementDeal> findByDealStatus(String dealStatus);
    List<ProcurementDeal> findBySupplierId(Long supplierId);
}

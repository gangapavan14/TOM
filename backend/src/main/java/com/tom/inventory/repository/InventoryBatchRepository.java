package com.tom.inventory.repository;

import com.tom.inventory.domain.InventoryBatch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryBatchRepository extends JpaRepository<InventoryBatch, Long> {
    Optional<InventoryBatch> findByBatchCode(String batchCode);
    List<InventoryBatch> findByStatus(String status);
    List<InventoryBatch> findByWarehouseId(Long warehouseId);
}

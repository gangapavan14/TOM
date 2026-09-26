package com.tom.inventory.service;

import com.tom.inventory.domain.InventoryBatch;
import com.tom.inventory.domain.Warehouse;
import com.tom.inventory.repository.InventoryBatchRepository;
import com.tom.inventory.repository.WarehouseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final WarehouseRepository warehouseRepository;
    private final InventoryBatchRepository batchRepository;

    public List<Warehouse> getAllWarehouses() {
        return warehouseRepository.findAll();
    }

    public List<InventoryBatch> getAllBatches() {
        return batchRepository.findAll();
    }

    @Transactional
    public InventoryBatch createBatch(InventoryBatch batch) {
        if (batch.getBatchCode() == null) {
            batch.setBatchCode("BAT-" + System.currentTimeMillis() % 100000);
        }
        return batchRepository.save(batch);
    }
}

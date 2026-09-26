package com.tom.procurement.service;

import com.tom.procurement.domain.ProcurementDeal;
import com.tom.procurement.domain.ProcurementRequirement;
import com.tom.procurement.domain.Supplier;
import com.tom.procurement.repository.ProcurementDealRepository;
import com.tom.procurement.repository.ProcurementRequirementRepository;
import com.tom.procurement.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProcurementService {

    private final SupplierRepository supplierRepository;
    private final ProcurementRequirementRepository requirementRepository;
    private final ProcurementDealRepository dealRepository;

    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }

    public List<ProcurementRequirement> getAllRequirements() {
        return requirementRepository.findAll();
    }

    @Transactional
    public ProcurementRequirement createRequirement(ProcurementRequirement req) {
        if (req.getReqCode() == null) {
            req.setReqCode("REQ-" + System.currentTimeMillis() % 100000);
        }
        return requirementRepository.save(req);
    }

    public List<ProcurementDeal> getAllDeals() {
        return dealRepository.findAll();
    }

    @Transactional
    public ProcurementDeal createDeal(ProcurementDeal deal) {
        if (deal.getDealCode() == null) {
            deal.setDealCode("DEAL-" + System.currentTimeMillis() % 100000);
        }
        return dealRepository.save(deal);
    }
}

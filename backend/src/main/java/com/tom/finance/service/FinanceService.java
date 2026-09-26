package com.tom.finance.service;

import com.tom.finance.domain.FinancialTransaction;
import com.tom.finance.repository.FinancialTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FinanceService {

    private final FinancialTransactionRepository txnRepository;

    public List<FinancialTransaction> getAllTransactions() {
        return txnRepository.findAll();
    }

    @Transactional
    public FinancialTransaction recordTransaction(FinancialTransaction txn) {
        if (txn.getTxnCode() == null) {
            txn.setTxnCode("TXN-" + System.currentTimeMillis() % 100000);
        }
        return txnRepository.save(txn);
    }
}

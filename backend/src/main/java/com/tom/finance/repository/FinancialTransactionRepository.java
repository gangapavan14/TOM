package com.tom.finance.repository;

import com.tom.finance.domain.FinancialTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FinancialTransactionRepository extends JpaRepository<FinancialTransaction, Long> {
    Optional<FinancialTransaction> findByTxnCode(String txnCode);
    List<FinancialTransaction> findByTxnType(String txnType);
    List<FinancialTransaction> findByCategory(String category);
}

package com.tom.sales.repository;

import com.tom.sales.domain.SalesOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SalesOrderRepository extends JpaRepository<SalesOrder, Long> {
    Optional<SalesOrder> findByOrderCode(String orderCode);
    List<SalesOrder> findByCustomerId(Long customerId);
}

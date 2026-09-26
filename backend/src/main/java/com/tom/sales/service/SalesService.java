package com.tom.sales.service;

import com.tom.sales.domain.Customer;
import com.tom.sales.domain.SalesOrder;
import com.tom.sales.repository.CustomerRepository;
import com.tom.sales.repository.SalesOrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SalesService {

    private final CustomerRepository customerRepository;
    private final SalesOrderRepository salesOrderRepository;

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    public List<SalesOrder> getAllOrders() {
        return salesOrderRepository.findAll();
    }

    @Transactional
    public SalesOrder createOrder(SalesOrder order) {
        if (order.getOrderCode() == null) {
            order.setOrderCode("ORD-" + System.currentTimeMillis() % 100000);
        }
        if (order.getQuantity() != null && order.getUnitPrice() != null) {
            order.setTotalAmount(order.getQuantity().multiply(order.getUnitPrice()));
        }
        return salesOrderRepository.save(order);
    }
}

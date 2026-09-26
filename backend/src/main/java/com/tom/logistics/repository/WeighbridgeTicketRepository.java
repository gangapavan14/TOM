package com.tom.logistics.repository;

import com.tom.logistics.domain.WeighbridgeTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WeighbridgeTicketRepository extends JpaRepository<WeighbridgeTicket, Long> {
    Optional<WeighbridgeTicket> findByTicketCode(String ticketCode);
}

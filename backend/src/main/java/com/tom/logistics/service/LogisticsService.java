package com.tom.logistics.service;

import com.tom.logistics.domain.WeighbridgeTicket;
import com.tom.logistics.repository.WeighbridgeTicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LogisticsService {

    private final WeighbridgeTicketRepository ticketRepository;

    public List<WeighbridgeTicket> getAllTickets() {
        return ticketRepository.findAll();
    }

    @Transactional
    public WeighbridgeTicket createTicket(WeighbridgeTicket ticket) {
        if (ticket.getTicketCode() == null) {
            ticket.setTicketCode("WB-" + System.currentTimeMillis() % 100000);
        }
        if (ticket.getGrossWeight() != null && ticket.getTareWeight() != null) {
            BigDecimal net = ticket.getGrossWeight().subtract(ticket.getTareWeight());
            ticket.setNetWeight(net.compareTo(BigDecimal.ZERO) > 0 ? net : BigDecimal.ZERO);
            if (ticket.getTareWeight().compareTo(BigDecimal.ZERO) > 0) {
                ticket.setStatus("COMPLETED");
            }
        }
        return ticketRepository.save(ticket);
    }
}

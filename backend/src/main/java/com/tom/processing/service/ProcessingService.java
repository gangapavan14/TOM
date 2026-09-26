package com.tom.processing.service;

import com.tom.processing.domain.MachineUnit;
import com.tom.processing.domain.ProcessingRun;
import com.tom.processing.repository.MachineUnitRepository;
import com.tom.processing.repository.ProcessingRunRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProcessingService {

    private final MachineUnitRepository machineUnitRepository;
    private final ProcessingRunRepository processingRunRepository;

    public List<MachineUnit> getAllMachines() {
        return machineUnitRepository.findAll();
    }

    @Transactional
    public MachineUnit toggleMachineStatus(Long id) {
        MachineUnit machine = machineUnitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Machine not found"));
        if ("RUNNING".equalsIgnoreCase(machine.getStatus())) {
            machine.setStatus("IDLE");
            machine.setCurrentLoad("0%");
            machine.setRpm("0");
        } else {
            machine.setStatus("RUNNING");
            machine.setCurrentLoad("85%");
            machine.setRpm("1420");
        }
        return machineUnitRepository.save(machine);
    }

    public List<ProcessingRun> getAllRuns() {
        return processingRunRepository.findAll();
    }

    @Transactional
    public ProcessingRun recordRun(ProcessingRun run) {
        if (run.getRunCode() == null) {
            run.setRunCode("RUN-" + System.currentTimeMillis() % 100000);
        }
        return processingRunRepository.save(run);
    }
}

package com.tom.processing.repository;

import com.tom.processing.domain.ProcessingRun;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProcessingRunRepository extends JpaRepository<ProcessingRun, Long> {
    Optional<ProcessingRun> findByRunCode(String runCode);
}

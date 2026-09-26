package com.tom.workforce.repository;

import com.tom.workforce.domain.TemporaryWorkerApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TemporaryWorkerApplicationRepository extends JpaRepository<TemporaryWorkerApplication, Long> {
    List<TemporaryWorkerApplication> findByStatus(String status);
}

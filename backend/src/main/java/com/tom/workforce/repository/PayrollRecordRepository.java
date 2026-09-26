package com.tom.workforce.repository;

import com.tom.workforce.domain.PayrollRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PayrollRecordRepository extends JpaRepository<PayrollRecord, Long> {
    List<PayrollRecord> findByMonthNameAndYearVal(String monthName, Integer yearVal);
    List<PayrollRecord> findByStatus(String status);
}

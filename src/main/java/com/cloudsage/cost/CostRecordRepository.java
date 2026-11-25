package com.cloudsage.cost;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CostRecordRepository extends JpaRepository<CostRecord, Long> {

    List<CostRecord> findByResourceIdOrderByRecordedAtAsc(Long resourceId);
}
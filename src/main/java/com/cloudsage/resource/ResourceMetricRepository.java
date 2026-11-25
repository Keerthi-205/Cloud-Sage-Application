package com.cloudsage.resource;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
public interface ResourceMetricRepository extends JpaRepository<ResourceMetric, Long> {

    List<ResourceMetric> findByResourceIdOrderByRecordedAtAsc(Long resourceId);
    long countByResource_Id(Long resourceId);
}
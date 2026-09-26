package com.tom.common.audit;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    List<AuditLog> findByEntityTypeAndEntityIdOrderByCreatedAtDesc(String entityType, String entityId);

    List<AuditLog> findByActorIdOrderByCreatedAtDesc(Long actorId);

    @Query("SELECT a FROM AuditLog a WHERE a.entityType = :entityType ORDER BY a.createdAt DESC")
    List<AuditLog> findByEntityTypeOrderByCreatedAtDesc(@Param("entityType") String entityType);
}

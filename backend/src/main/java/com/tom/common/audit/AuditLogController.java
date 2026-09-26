package com.tom.common.audit;

import com.tom.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audit-logs")
@RequiredArgsConstructor
public class AuditLogController {

    private final AuditLogRepository auditLogRepository;

    @GetMapping
    @PreAuthorize("hasAuthority('AUTH_VIEW_AUDIT')")
    public ResponseEntity<ApiResponse<List<AuditLog>>> getAllLogs() {
        List<AuditLog> logs = auditLogRepository.findAll()
                .stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .toList();
        return ResponseEntity.ok(ApiResponse.success(logs));
    }

    @GetMapping("/entity/{type}/{id}")
    @PreAuthorize("hasAuthority('AUTH_VIEW_AUDIT')")
    public ResponseEntity<ApiResponse<List<AuditLog>>> getByEntity(
            @PathVariable String type, @PathVariable String id) {
        List<AuditLog> logs = auditLogRepository.findByEntityTypeAndEntityIdOrderByCreatedAtDesc(type, id);
        return ResponseEntity.ok(ApiResponse.success(logs));
    }
}

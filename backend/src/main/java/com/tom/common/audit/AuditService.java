package com.tom.common.audit;

import com.tom.auth.domain.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

/**
 * Service to record audit log entries for important business actions.
 * Usage:
 *   auditService.log("SALARY_CHANGED", "Employee", "42", oldSalary, newSalary, "Annual revision");
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    /**
     * Log a business action with old and new values.
     */
    public void log(String action, String entityType, String entityId,
                    Object oldValue, Object newValue, String reason) {
        try {
            Long actorId = getCurrentUserId();
            String actorName = getCurrentUserName();

            AuditLog entry = AuditLog.builder()
                    .actorId(actorId)
                    .actorName(actorName)
                    .action(action)
                    .entityType(entityType)
                    .entityId(entityId)
                    .oldValue(oldValue != null ? oldValue.toString() : null)
                    .newValue(newValue != null ? newValue.toString() : null)
                    .reason(reason)
                    .build();

            auditLogRepository.save(entry);
        } catch (Exception e) {
            log.error("Failed to write audit log: action={}, entity={}/{}", action, entityType, entityId, e);
        }
    }

    /**
     * Log a simple action without old/new values.
     */
    public void log(String action, String entityType, String entityId) {
        log(action, entityType, entityId, null, null, null);
    }

    private Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof User user) {
            return user.getId();
        }
        return -1L; // system
    }

    private String getCurrentUserName() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof User user) {
            return user.getFullName();
        }
        return "SYSTEM";
    }
}

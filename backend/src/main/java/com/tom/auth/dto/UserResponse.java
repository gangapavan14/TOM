package com.tom.auth.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String phone;
    private String role;
    private String roleDisplayName;
    private List<String> permissions;
    private boolean active;
    private LocalDateTime lastLoginAt;
    private LocalDateTime createdAt;
}

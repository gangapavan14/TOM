package com.tom.auth.controller;

import com.tom.auth.dto.*;
import com.tom.auth.repository.RoleRepository;
import com.tom.auth.repository.UserRepository;
import com.tom.auth.service.AuthService;
import com.tom.common.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        AuthResponse response = authService.refreshToken(request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> me() {
        return ResponseEntity.ok(ApiResponse.success(authService.getCurrentUser()));
    }

    // ---- User management (Admin only) ----

    @GetMapping("/users")
    @PreAuthorize("hasAuthority('AUTH_MANAGE_USERS')")
    public ResponseEntity<ApiResponse<List<UserResponse>>> listUsers() {
        List<UserResponse> users = userRepository.findAll().stream()
                .map(authService::mapToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    @PostMapping("/users")
    @PreAuthorize("hasAuthority('AUTH_MANAGE_USERS')")
    public ResponseEntity<ApiResponse<UserResponse>> createUser(@Valid @RequestBody CreateUserRequest request) {
        UserResponse created = authService.createUser(request);
        return ResponseEntity.status(201).body(ApiResponse.success(created));
    }

    @PutMapping("/users/{id}/deactivate")
    @PreAuthorize("hasAuthority('AUTH_MANAGE_USERS')")
    public ResponseEntity<ApiResponse<String>> deactivateUser(@PathVariable Long id) {
        userRepository.findById(id).ifPresent(user -> {
            user.setActive(false);
            userRepository.save(user);
        });
        return ResponseEntity.ok(ApiResponse.success("User deactivated"));
    }

    @GetMapping("/roles")
    @PreAuthorize("hasAuthority('AUTH_MANAGE_ROLES')")
    public ResponseEntity<ApiResponse<List<?>>> listRoles() {
        return ResponseEntity.ok(ApiResponse.success(roleRepository.findAll()));
    }
}

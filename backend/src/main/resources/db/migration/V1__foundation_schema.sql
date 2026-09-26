-- =============================================================
-- V1: TOM Foundation Schema
-- Auth, Roles, Permissions, Audit, System Settings
-- =============================================================

-- -------------------------
-- ROLES
-- -------------------------
CREATE TABLE roles (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(50)  NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active   BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------
-- PERMISSIONS
-- -------------------------
CREATE TABLE permissions (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    code        VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255),
    module      VARCHAR(50)  NOT NULL,
    created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------
-- ROLE <-> PERMISSIONS
-- -------------------------
CREATE TABLE role_permissions (
    role_id       BIGINT NOT NULL,
    permission_id BIGINT NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    CONSTRAINT fk_rp_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    CONSTRAINT fk_rp_perm FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------
-- USERS
-- -------------------------
CREATE TABLE users (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    username      VARCHAR(50)  NOT NULL UNIQUE,
    email         VARCHAR(150) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name     VARCHAR(150) NOT NULL,
    phone         VARCHAR(20),
    role_id       BIGINT       NOT NULL,
    is_active     BOOLEAN      NOT NULL DEFAULT TRUE,
    last_login_at DATETIME,
    created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------
-- REFRESH TOKENS
-- -------------------------
CREATE TABLE refresh_tokens (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT       NOT NULL,
    token       VARCHAR(512) NOT NULL UNIQUE,
    expires_at  DATETIME     NOT NULL,
    revoked     BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_rt_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------
-- AUDIT LOGS
-- -------------------------
CREATE TABLE audit_logs (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    actor_id    BIGINT       NOT NULL,
    actor_name  VARCHAR(150) NOT NULL,
    action      VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id   VARCHAR(100),
    old_value   TEXT,
    new_value   TEXT,
    reason      TEXT,
    ip_address  VARCHAR(50),
    created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_audit_actor (actor_id),
    INDEX idx_audit_entity (entity_type, entity_id),
    INDEX idx_audit_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------
-- SYSTEM SETTINGS
-- (configurable business policies — never hard-code)
-- -------------------------
CREATE TABLE system_settings (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT        NOT NULL,
    description VARCHAR(255),
    data_type   VARCHAR(20)  NOT NULL DEFAULT 'STRING',
    updated_by  BIGINT,
    updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_ss_user FOREIGN KEY (updated_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================
-- SEED DATA
-- =============================================================

-- Roles
INSERT INTO roles (name, display_name, description) VALUES
('ADMIN',           'Admin',               'Business owner / highest authority with full financial control'),
('OFFICE_EMPLOYEE', 'Office Employee',     'Coordinates operations, manages field staff assignments'),
('FIELD_OFFICER',   'Field Officer',       'Procurement inspection, quality, processing decisions, loading verification'),
('SENIOR_WORKER',   'Senior Worker',       'Physical work + worker management + recording execution'),
('WORKER',          'Worker',              'Executes assigned physical tasks'),
('TEMP_WORKER',     'Temporary Worker',    'Approved temporary/part-time workers with configurable pay rates'),
('SALES',           'Sales Employee',      'B2B enquiries, customer acquisition, orders, and collections');

-- Permissions (grouped by module)
INSERT INTO permissions (code, description, module) VALUES
-- Auth
('AUTH_MANAGE_USERS',       'Create, edit, deactivate users',          'AUTH'),
('AUTH_MANAGE_ROLES',       'Assign roles and permissions',             'AUTH'),
('AUTH_VIEW_AUDIT',         'View audit logs',                          'AUTH'),

-- Workforce
('WORKFORCE_VIEW',          'View employee and worker records',         'WORKFORCE'),
('WORKFORCE_MANAGE',        'Create and manage employee/worker records','WORKFORCE'),
('WORKFORCE_APPROVE_TEMP',  'Approve/reject temporary worker applications', 'WORKFORCE'),
('WORKFORCE_MANAGE_PAYROLL','Generate and manage payroll',              'WORKFORCE'),
('WORKFORCE_PAY_SALARY',    'Mark salaries and incentives as paid',     'WORKFORCE'),
('WORKFORCE_ASSIGN_TASKS',  'Assign tasks to workers',                  'WORKFORCE'),
('WORKFORCE_COMPLETE_TASKS','Mark own assigned tasks as complete',       'WORKFORCE'),

-- Procurement
('PROCUREMENT_VIEW',        'View procurement records',                 'PROCUREMENT'),
('PROCUREMENT_CREATE_REQ',  'Create procurement requirements',          'PROCUREMENT'),
('PROCUREMENT_NEGOTIATE',   'Negotiate procurement deals within limits', 'PROCUREMENT'),
('PROCUREMENT_INSPECT',     'Perform quality inspection and grading',   'PROCUREMENT'),
('PROCUREMENT_ACCEPT_REJECT','Accept or reject incoming stock',         'PROCUREMENT'),
('PROCUREMENT_CLOSE',       'Close procurement requirements',           'PROCUREMENT'),

-- Inventory
('INVENTORY_VIEW',          'View inventory and warehouse stock',       'INVENTORY'),
('INVENTORY_MANAGE',        'Adjust stock, manage batches and bags',    'INVENTORY'),
('INVENTORY_TRANSFER',      'Initiate stock transfers',                 'INVENTORY'),
('INVENTORY_VERIFY_LOADING','Verify physical loading operations',       'INVENTORY'),

-- Sales
('SALES_VIEW',              'View sales orders and customers',          'SALES'),
('SALES_MANAGE_ENQUIRY',    'Create and manage sales enquiries',        'SALES'),
('SALES_CREATE_ORDER',      'Create and confirm sales orders',          'SALES'),
('SALES_COLLECT_PAYMENT',   'Record payment collections from customers','SALES'),
('SALES_VERIFY_PAYMENT',    'Verify and approve collected payments',    'SALES'),
('SALES_APPROVE_CREDIT',    'Approve credit sales',                     'SALES'),

-- Finance
('FINANCE_VIEW',            'View financial accounts and reports',      'FINANCE'),
('FINANCE_MANAGE',          'Manage financial accounts and expenses',   'FINANCE'),
('FINANCE_PAY_SUPPLIER',    'Record supplier payments',                 'FINANCE'),
('FINANCE_MANAGE_EXPENSE',  'Create and approve expenses',              'FINANCE'),
('FINANCE_RECONCILE',       'Perform cash reconciliation',              'FINANCE'),

-- Reports
('REPORTS_VIEW_OPERATIONAL','View operational reports',                 'REPORTS'),
('REPORTS_VIEW_FINANCIAL',  'View financial reports',                   'REPORTS'),
('REPORTS_VIEW_ALL',        'View all reports including P&L',           'REPORTS');

-- Assign ALL permissions to ADMIN
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p WHERE r.name = 'ADMIN';

-- OFFICE_EMPLOYEE permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'OFFICE_EMPLOYEE'
AND p.code IN (
    'WORKFORCE_VIEW', 'WORKFORCE_MANAGE', 'WORKFORCE_ASSIGN_TASKS',
    'PROCUREMENT_VIEW', 'INVENTORY_VIEW', 'SALES_VIEW',
    'SALES_MANAGE_ENQUIRY', 'REPORTS_VIEW_OPERATIONAL'
);

-- FIELD_OFFICER permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'FIELD_OFFICER'
AND p.code IN (
    'PROCUREMENT_VIEW', 'PROCUREMENT_NEGOTIATE', 'PROCUREMENT_INSPECT',
    'PROCUREMENT_ACCEPT_REJECT',
    'INVENTORY_VIEW', 'INVENTORY_VERIFY_LOADING',
    'SALES_VIEW', 'WORKFORCE_VIEW'
);

-- SENIOR_WORKER permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'SENIOR_WORKER'
AND p.code IN (
    'WORKFORCE_VIEW', 'WORKFORCE_ASSIGN_TASKS', 'WORKFORCE_COMPLETE_TASKS',
    'INVENTORY_VIEW', 'PROCUREMENT_VIEW'
);

-- WORKER permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'WORKER'
AND p.code IN ('WORKFORCE_COMPLETE_TASKS');

-- TEMP_WORKER permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'TEMP_WORKER'
AND p.code IN ('WORKFORCE_COMPLETE_TASKS');

-- SALES permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'SALES'
AND p.code IN (
    'SALES_VIEW', 'SALES_MANAGE_ENQUIRY', 'SALES_CREATE_ORDER',
    'SALES_COLLECT_PAYMENT', 'INVENTORY_VIEW', 'REPORTS_VIEW_OPERATIONAL'
);

-- System settings (configurable business policies)
INSERT INTO system_settings (setting_key, setting_value, description, data_type) VALUES
('PROCUREMENT_RESERVATION_HOURS',       '12',   'Hours before a procurement reservation auto-expires',         'INTEGER'),
('PROCUREMENT_DELIVERY_WINDOW_HOURS',   '24',   'Hours allowed for delivery after a deal is finalized',        'INTEGER'),
('SUPPLIER_PAYMENT_DAYS_NORMAL',        '15',   'Normal supplier payment period in days',                      'INTEGER'),
('SUPPLIER_PAYMENT_DAYS_MAX',           '20',   'Maximum supplier payment period in days',                     'INTEGER'),
('SUPPLIER_EARLY_PAYMENT_DEDUCTION_PCT','2.00', 'Percentage deducted for early supplier payment requests',     'DECIMAL'),
('CUSTOMER_CREDIT_TARGET_DAYS',         '15',   'Target credit collection period for B2B customers in days',   'INTEGER'),
('CUSTOMER_CREDIT_MAX_DAYS',            '20',   'Maximum allowed credit days for B2B customers',               'INTEGER'),
('STANDARD_BAG_SIZE_KG',                '50',   'Standard bag size in kilograms',                              'INTEGER'),
('SALARY_WORKER_MONTHLY',               '10000','Default monthly salary for Worker role in INR',               'DECIMAL'),
('SALARY_SENIOR_WORKER_MONTHLY',        '15000','Default monthly salary for Senior Worker role in INR',        'DECIMAL'),
('SALARY_FIELD_OFFICER_MONTHLY',        '20000','Default monthly salary for Field Officer role in INR',        'DECIMAL'),
('SALARY_OFFICE_EMPLOYEE_MONTHLY',      '20000','Default monthly salary for Office Employee role in INR',      'DECIMAL'),
('CURRENCY',                            'INR',  'Business currency',                                           'STRING');

-- Default Admin user (password: Admin@123 — MUST change in production)
-- BCrypt hash of "Admin@123"
INSERT INTO users (username, email, password_hash, full_name, phone, role_id)
SELECT 'admin', 'admin@tirumalamill.com',
       '$2a$12$k7JD.0.7VRvfJLQqoJGjHO6TjDj.aIxcJ3t/HNGrHbH7L2yT2wJ8m',
       'TOM Administrator', '+91-9000000000', r.id
FROM roles r WHERE r.name = 'ADMIN';

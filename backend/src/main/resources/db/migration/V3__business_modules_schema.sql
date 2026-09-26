-- =============================================================
-- V3: TOM Business Modules Schema
-- Workforce, Procurement, Inventory, Processing, Logistics, Sales, Finance
-- =============================================================

-- -------------------------
-- WORKFORCE
-- -------------------------
CREATE TABLE employees (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_code VARCHAR(50)  NOT NULL UNIQUE,
    full_name     VARCHAR(150) NOT NULL,
    phone         VARCHAR(20)  NOT NULL,
    designation   VARCHAR(100) NOT NULL,
    role_type     VARCHAR(50)  NOT NULL, -- PERMANENT, TEMPORARY, CONTRACT
    base_salary   DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    daily_rate    DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    status        VARCHAR(30)  NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, ON_LEAVE, TERMINATED
    joined_date   DATE         NOT NULL,
    created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE temporary_worker_applications (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    applicant_name VARCHAR(150) NOT NULL,
    phone         VARCHAR(20)  NOT NULL,
    role_applied  VARCHAR(100) NOT NULL,
    daily_rate    DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    status        VARCHAR(30)  NOT NULL DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED
    approved_by   BIGINT,
    approved_at   DATETIME,
    notes         TEXT,
    created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE attendance (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id   BIGINT       NOT NULL,
    attendance_date DATE       NOT NULL,
    status        VARCHAR(30)  NOT NULL DEFAULT 'PRESENT', -- PRESENT, ABSENT, HALF_DAY, LEAVE
    check_in      TIME,
    check_out     TIME,
    overtime_hours DECIMAL(4,1) NOT NULL DEFAULT 0.0,
    created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_att_emp FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    UNIQUE KEY uq_emp_date (employee_id, attendance_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE payroll_records (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    payroll_code  VARCHAR(50)  NOT NULL UNIQUE,
    employee_id   BIGINT       NOT NULL,
    month_name    VARCHAR(30)  NOT NULL,
    year_val      INT          NOT NULL,
    base_salary   DECIMAL(12,2) NOT NULL,
    days_worked   INT          NOT NULL DEFAULT 26,
    overtime_pay  DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    deductions    DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    net_pay       DECIMAL(12,2) NOT NULL,
    status        VARCHAR(30)  NOT NULL DEFAULT 'GENERATED', -- GENERATED, APPROVED, PAID
    disbursed_at  DATETIME,
    created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pay_emp FOREIGN KEY (employee_id) REFERENCES employees(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------
-- PROCUREMENT
-- -------------------------
CREATE TABLE suppliers (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    supplier_code VARCHAR(50)  NOT NULL UNIQUE,
    name          VARCHAR(150) NOT NULL,
    phone         VARCHAR(20)  NOT NULL,
    supplier_type VARCHAR(50)  NOT NULL DEFAULT 'FARMER', -- FARMER, COMMISSION_AGENT, TRADER
    address       TEXT,
    bank_account  VARCHAR(50),
    ifsc_code     VARCHAR(20),
    is_active     BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE procurement_requirements (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    req_code      VARCHAR(50)  NOT NULL UNIQUE,
    commodity     VARCHAR(100) NOT NULL,
    required_bags INT          NOT NULL,
    required_kg   DECIMAL(12,2) NOT NULL,
    target_price  DECIMAL(10,2),
    status        VARCHAR(30)  NOT NULL DEFAULT 'OPEN', -- OPEN, RESERVED, PARTIALLY_FULFILLED, CLOSED
    created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE procurement_deals (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    deal_code     VARCHAR(50)  NOT NULL UNIQUE,
    requirement_id BIGINT,
    supplier_id   BIGINT       NOT NULL,
    commodity     VARCHAR(100) NOT NULL,
    bags          INT          NOT NULL,
    total_kg      DECIMAL(12,2) NOT NULL,
    rate_per_kg   DECIMAL(10,2) NOT NULL,
    advance_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    deal_status   VARCHAR(30)  NOT NULL DEFAULT 'CONFIRMED', -- DRAFT, CONFIRMED, DELIVERED, CANCELLED
    quality_status VARCHAR(30) NOT NULL DEFAULT 'PENDING', -- PENDING, PASSED, REJECTED
    created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_deal_req FOREIGN KEY (requirement_id) REFERENCES procurement_requirements(id),
    CONSTRAINT fk_deal_sup FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------
-- INVENTORY & WAREHOUSES
-- -------------------------
CREATE TABLE warehouses (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(100) NOT NULL UNIQUE,
    location      VARCHAR(255) NOT NULL,
    capacity_bags INT          NOT NULL DEFAULT 10000,
    created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE inventory_batches (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    batch_code    VARCHAR(50)  NOT NULL UNIQUE,
    commodity     VARCHAR(100) NOT NULL,
    grade         VARCHAR(20)  NOT NULL DEFAULT 'A', -- A+, A, B, C
    warehouse_id  BIGINT       NOT NULL,
    room_section  VARCHAR(50)  NOT NULL DEFAULT 'Room A',
    bags          INT          NOT NULL DEFAULT 0,
    total_kg      DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    cost_per_kg   DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    status        VARCHAR(30)  NOT NULL DEFAULT 'IN_STOCK', -- IN_STOCK, PROCESSING, DEPLETED
    created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_batch_wh FOREIGN KEY (warehouse_id) REFERENCES warehouses(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------
-- PROCESSING / MILLING
-- -------------------------
CREATE TABLE machine_units (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    machine_code  VARCHAR(50)  NOT NULL UNIQUE,
    name          VARCHAR(100) NOT NULL,
    machine_type  VARCHAR(50)  NOT NULL, -- EXPELLER, FILTER_PRESS, BOILER
    status        VARCHAR(30)  NOT NULL DEFAULT 'RUNNING', -- RUNNING, IDLE, MAINTENANCE
    temperature   VARCHAR(30),
    current_load  VARCHAR(30),
    rpm           VARCHAR(30),
    output_rate   VARCHAR(50),
    created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE processing_runs (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    run_code      VARCHAR(50)  NOT NULL UNIQUE,
    seed_input_kg DECIMAL(12,2) NOT NULL,
    crude_oil_kg  DECIMAL(12,2) NOT NULL,
    cake_output_kg DECIMAL(12,2) NOT NULL,
    waste_loss_kg DECIMAL(12,2) NOT NULL,
    shift_name    VARCHAR(50)  NOT NULL,
    supervisor    VARCHAR(100) NOT NULL,
    status        VARCHAR(30)  NOT NULL DEFAULT 'IN_PROGRESS', -- IN_PROGRESS, COMPLETED
    created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------
-- LOGISTICS & WEIGHBRIDGE
-- -------------------------
CREATE TABLE weighbridge_tickets (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    ticket_code   VARCHAR(50)  NOT NULL UNIQUE,
    vehicle_no    VARCHAR(50)  NOT NULL,
    driver_name   VARCHAR(150) NOT NULL,
    driver_phone  VARCHAR(20)  NOT NULL,
    material      VARCHAR(100) NOT NULL,
    gross_weight  DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    tare_weight   DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    net_weight    DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    status        VARCHAR(30)  NOT NULL DEFAULT 'ON_WEIGHBRIDGE', -- GATE_ENTRY, ON_WEIGHBRIDGE, UNLOADING, COMPLETED
    created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------
-- B2B SALES
-- -------------------------
CREATE TABLE customers (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_code VARCHAR(50)  NOT NULL UNIQUE,
    company_name  VARCHAR(150) NOT NULL,
    contact_person VARCHAR(150) NOT NULL,
    phone         VARCHAR(20)  NOT NULL,
    email         VARCHAR(150),
    gstin         VARCHAR(30),
    credit_limit  DECIMAL(14,2) NOT NULL DEFAULT 0.00,
    outstanding_balance DECIMAL(14,2) NOT NULL DEFAULT 0.00,
    is_active     BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE sales_orders (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_code    VARCHAR(50)  NOT NULL UNIQUE,
    customer_id   BIGINT       NOT NULL,
    product_name  VARCHAR(100) NOT NULL,
    quantity      DECIMAL(12,2) NOT NULL,
    unit_price    DECIMAL(10,2) NOT NULL,
    total_amount  DECIMAL(14,2) NOT NULL,
    payment_status VARCHAR(30) NOT NULL DEFAULT 'PENDING', -- PENDING, PARTIALLY_PAID, PAID
    dispatch_status VARCHAR(30) NOT NULL DEFAULT 'CONFIRMED', -- CONFIRMED, PACKING, DISPATCHED, DELIVERED
    created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_so_cust FOREIGN KEY (customer_id) REFERENCES customers(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------
-- FINANCE & TRANSACTIONS
-- -------------------------
CREATE TABLE financial_transactions (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    txn_code      VARCHAR(50)  NOT NULL UNIQUE,
    txn_type      VARCHAR(20)  NOT NULL, -- CREDIT, DEBIT
    category      VARCHAR(50)  NOT NULL, -- SALES_COLLECTION, SUPPLIER_PAYMENT, PAYROLL, OPERATING_EXPENSE, MAINTENANCE
    amount        DECIMAL(14,2) NOT NULL,
    reference_id  VARCHAR(50),
    description   TEXT,
    txn_date      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------
-- SEED DATA FOR DEMO & TESTING
-- -------------------------
INSERT INTO employees (employee_code, full_name, phone, designation, role_type, base_salary, daily_rate, status, joined_date)
VALUES 
('EMP-001', 'N. Venkata Rao', '9848011223', 'Expeller Operator', 'PERMANENT', 28000.00, 0, 'ACTIVE', '2024-01-15'),
('EMP-002', 'M. Shiva Reddy', '9988771122', 'Boiler Operator', 'PERMANENT', 26000.00, 0, 'ACTIVE', '2024-03-01'),
('EMP-003', 'G. Apparao', '9701122334', 'Senior Yard Worker', 'PERMANENT', 22000.00, 0, 'ACTIVE', '2024-02-10'),
('EMP-004', 'K. Lakshmi', '9440112233', 'Office Accountant', 'PERMANENT', 32000.00, 0, 'ACTIVE', '2023-11-01');

INSERT INTO warehouses (name, location, capacity_bags)
VALUES 
('Warehouse 1 (Raw Seeds)', 'North Shed Bay 1', 15000),
('Warehouse 2 (Oil Cake)', 'South Shed Bay 2', 12000),
('Tank Farm (Crude Oil)', 'Bulk Tank Bay', 50000);

INSERT INTO inventory_batches (batch_code, commodity, grade, warehouse_id, room_section, bags, total_kg, cost_per_kg, status)
VALUES
('TUR-260926-001', 'Raw Cotton Seed', 'A+', 1, 'Room A', 120, 6000.00, 125.00, 'IN_STOCK'),
('TUR-260926-002', 'Raw Cotton Seed', 'A', 1, 'Room B', 80, 4000.00, 118.00, 'IN_STOCK'),
('SUN-260926-001', 'Sunflower Seed', 'A', 1, 'Room C', 200, 10000.00, 72.00, 'IN_STOCK'),
('CAK-260926-001', 'Cotton Oil Cake', 'Standard', 2, 'Room A', 400, 20000.00, 31.00, 'IN_STOCK');

INSERT INTO machine_units (machine_code, name, machine_type, status, temperature, current_load, rpm, output_rate)
VALUES
('EXP-01', 'Heavy Expeller 1 (60 TPD)', 'EXPELLER', 'RUNNING', '112°C', '88%', '1420', '1,250 kg/h'),
('EXP-02', 'Heavy Expeller 2 (60 TPD)', 'EXPELLER', 'RUNNING', '108°C', '84%', '1420', '1,180 kg/h'),
('EXP-03', 'Medium Expeller 3 (30 TPD)', 'EXPELLER', 'IDLE', '42°C', '0%', '0', '0 kg/h'),
('FLP-01', 'Plate & Frame Filter Press', 'FILTER_PRESS', 'RUNNING', '65°C', '92%', '—', '2,800 L/h'),
('BLR-01', 'Husk Steam Boiler', 'BOILER', 'RUNNING', '185°C', '75%', '10 bar', '3.5 Ton/h');

INSERT INTO suppliers (supplier_code, name, phone, supplier_type, address)
VALUES
('SUP-001', 'Sri Rama Agros', '9848099881', 'COMMISSION_AGENT', 'Guntur Cotton Market Yard'),
('SUP-002', 'K. Venkat Reddy', '9988011223', 'FARMER', 'Sattenapalli, AP'),
('SUP-003', 'Bhavani Traders', '9701199882', 'TRADER', 'Kurnool');

INSERT INTO customers (customer_code, company_name, contact_person, phone, email, gstin, credit_limit, outstanding_balance)
VALUES
('CUST-001', 'Heritage Foods Pvt Ltd', 'M. Srinivas', '9848123456', 'procurement@heritage.com', '37AABCH1234F1Z1', 5000000.00, 850000.00),
('CUST-002', 'Tirupati Refineries', 'V. Ramesh', '9988234567', 'sales@tirupatiref.com', '37AABCT5678F1Z2', 8000000.00, 1420000.00),
('CUST-003', 'Kaveri Feeds & Cattle', 'S. Narayana', '9701345678', 'kaveri@cattlefeed.in', '37AABCK9012F1Z3', 2500000.00, 310000.00);

INSERT INTO weighbridge_tickets (ticket_code, vehicle_no, driver_name, driver_phone, material, gross_weight, tare_weight, net_weight, status)
VALUES
('WB-260926-001', 'AP 21 TY 4521', 'Raju Naidu', '9848012345', 'Raw Cotton Seed', 24500.00, 8200.00, 16300.00, 'COMPLETED'),
('WB-260926-002', 'TS 09 UB 9812', 'K. Shiva Kumar', '9988776655', 'Sunflower Seed', 28100.00, 8500.00, 19600.00, 'UNLOADING'),
('WB-260926-003', 'KA 32 M 1109', 'Mohammed Rafi', '9701234567', 'Refined Cotton Oil', 14200.00, 6100.00, 8100.00, 'ON_WEIGHBRIDGE');

# Tirumala Oil Mill (TOM) — Enterprise Business Management System

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.5-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange.svg)](https://www.mysql.com/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED.svg)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-Proprietary-red.svg)]()

> Central operational platform and ERP for **Tirumala Oil Mill (TOM)**, orchestrating procurement, expeller processing, multi-warehouse stock identity, logistics, B2B wholesale dispatch, and unified financial authority.

---

## 📌 Table of Contents
- [Executive Overview](#-executive-overview)
- [System Architecture](#-system-architecture)
- [The 8 Core Invariant Business Rules](#-the-8-core-invariant-business-rules)
- [Module Directory](#-module-directory)
- [Technology Stack](#-technology-stack)
- [Quick Start Guide](#-quick-start-guide)
  - [Prerequisites](#prerequisites)
  - [Option A: Running with Docker Compose (Recommended)](#option-a-running-with-docker-compose-recommended)
  - [Option B: Running Locally (Manual Dev Mode)](#option-b-running-locally-manual-dev-mode)
- [Default System Credentials](#-default-system-credentials)
- [API Documentation & Health Monitoring](#-api-documentation--health-monitoring)
- [Repository Structure](#-repository-structure)

---

## 🏢 Executive Overview

Tirumala Oil Mill (TOM) operates high-volume commodity processing (Turmeric, Maize, Sesame/Til Seeds, and Cottonseed Oil Cake). 

Unlike generic CRUD platforms, this system models the real-world operational lifecycle:
```text
Supplier / Farmer
       ↓
Procurement Requirement & 12h Reservation
       ↓
Weighbridge Tare/Gross & Quality Lab Inspection (Strict Grade D Elimination)
       ↓
Processing & Expeller Run (Oil + Oil Cake By-product)
       ↓
Godown Silo & Bag Identification (Permanent Location-Independent Bag IDs)
       ↓
B2B Sales Order & Rule 6 Dual-Signoff Physical Loading Docket
       ↓
Sales Cash Handover & Rule 7 Admin Count Verification
       ↓
Supreme Financial Approval (Supplier Disbursement & Payroll)
```

---

## 🏛 System Architecture

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        React 19 + Vite Frontend                        │
│         - Role-tailored Cockpits (Admin, Office, Field, Floor, Sales) │
│         - Inter Enterprise Console Design System                       │
│         - Offline-safe Operational State Replication Bus               │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Reverse Proxy (/api/*)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                       Spring Boot 3.3.5 Backend                        │
│         - Stateless JWT Authentication (Bearer Header)                 │
│         - 34 Fine-Grained Role Permissions                             │
│         - Flyway Automated Database Migrations (V1, V2, V3)            │
│         - Standard ApiResponse<T> Result Envelope                      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HikariCP Connection Pool
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                           MySQL 8.0 Database                           │
│         - Database: tom_db (UTF8MB4, Asia/Kolkata Timezone)            │
│         - Fully normalized transactional ledgers & audit records       │
└────────────────────────────────────────────────────────────────────────┘
```

---

## ⚖️ The 8 Core Invariant Business Rules

The application strictly enforces the 8 foundational business rules from the 42-page Master Blueprint:

1. **Stock is Not Inventory on Receipt**: Goods received never automatically credit available inventory until weighbridge tare/gross and quality lab acceptance are completed.
2. **12-Hour Procurement Reservation Timeout**: Procurement deals not confirmed by suppliers within 12 hours automatically expire, returning seed quotas to the open procurement pool.
3. **Price & Grade Lock (24h Window)**: Once price, grade, and accepted quantities are agreed upon, terms are locked with zero post-facto renegotiation permitted.
4. **Strict Elimination of Grade D**: Grade D quality results in unconditional rejection; rejected stock is quarantined and never touches company inventory or accounts payable.
5. **Location-Independent Bag IDs**: Bag barcodes (e.g. `TUR-260926-001-001`) are globally unique and location-independent—moving a bag between godowns or stacks never alters its serial identity.
6. **Rule 6 Dual-Signoff Customer Pickup**: Finished goods pickup deduction requires **Senior Worker physical loading count** plus **Field Officer digital verification**.
7. **Rule 7 Sales Cash Handover & Admin Verification**: Cash collected by sales executives remains in a "Handed Over (Pending)" status until Admin physically counts and confirms the currency.
8. **Rule 8 Supreme Financial Authority**: Admin alone retains execution privileges over business disbursements, payroll releases, expense vouchers, and rate authorizations.

---

## 📦 Module Directory

| Module | Route | Access Scope | Key Capabilities |
|---|---|---|---|
| **Role Dashboard** | `/admin/dashboard` | All Roles (Tailored) | Adaptive operational cockpits customized for Admin, Office, Field, Floor, and Sales |
| **Procurement** | `/procurement` | Admin, Office, Field | 12h reservations, supplier management, 24h delivery locks, mandi pricing |
| **Quality Lab** | `/quality` | Admin, Field, Floor | Grading (A+, A, B, C), moisture testing, foreign matter %, Grade D rejection protocol |
| **Processing** | `/processing` | Admin, Floor, Worker | Expeller line runs 1–4, seed extraction, oil yields, cake output & loss tracking |
| **Floor Operations** | `/floor-operations` | Admin, Floor, Office | Rule 6 dual-signoff loading dockets, Senior Worker task boards & worker assignments |
| **Inventory** | `/inventory` | Admin, Office, Field, Sales | Warehouses 1–4 (Turmeric, Maize, Til, Cake), silo levels, serialized bag ledger |
| **Logistics** | `/logistics` | Admin, Office, Field | Weighbridge gross/tare tickets, fleet & transporter roster, vehicle gate passes |
| **B2B Sales** | `/sales` | Admin, Office, Sales | Wholesale customer accounts, dispatch reservations, tax invoices, credit management |
| **Product Catalogue** | `/catalogue` | All Mill Staff & Sales | Public B2C showcase (cold-pressed oils, turmeric powder, cattle feed) with enquiry capture |
| **Finance Office** | `/finance` | Admin, Office | Cash & bank ledger, Rule 7 cash verification, supplier payments, batch margin costing |
| **Workforce** | `/workforce` | Admin, Office | Employee roster, daily attendance register, temporary worker approval workflows |
| **Payroll** | `/payroll` | Strictly Admin | Confidential payroll calculation, advances, incentives, and direct bank disbursement |
| **BI Reports** | `/reports` | Admin, Office | P&L performance, extraction yields, warehouse occupancy, vendor turnaround times |
| **Audit Logs** | `/audit` | Strictly Admin | Tamper-evident ledger capturing actor, action, previous value, new value, and timestamp |
| **Document Vault** | `/documents` | Admin, Office, Field, Sales | Central document repository (contracts, mandi receipts, test certs, invoices) |
| **System Settings** | `/settings` | Strictly Admin | Operational thresholds, reservation durations, discount policies, hardware sensors |

---

## 🛠 Technology Stack

### Backend
- **Framework:** Spring Boot 3.3.5
- **Language:** Java 17+
- **Security:** Spring Security with stateless JWT (HMAC-SHA512)
- **Persistence:** Spring Data JPA / Hibernate (HikariCP connection pool)
- **Database Migrations:** Flyway (Migrations `V1`, `V2`, `V3`)
- **API Spec & Docs:** Springdoc OpenAPI 3.0 / Swagger UI
- **Build Tool:** Maven 3.8+

### Frontend
- **Framework:** React 19 + Vite 8
- **Styling:** Vanilla CSS + Tailwind CSS (Inter enterprise console design system)
- **Icons & Graphics:** Lucide React, Recharts
- **State Architecture:** React Context + Cross-Tab Operational Replication Bus

### DevOps & Containerization
- **Container Runtime:** Docker & Docker Compose
- **Web Server / Reverse Proxy:** Nginx Alpine (SPA fallback + gzip + asset caching)
- **Database Engine:** MySQL 8.0 Community Edition

---

## 🚀 Quick Start Guide

### Prerequisites
- **Docker & Docker Compose** (for containerized setup) **OR**:
  - **Java 17+** & **Maven 3.8+**
  - **Node.js 18+** & **npm**
  - **MySQL 8.0** running locally on port `3306`

---

### Option A: Running with Docker Compose (Recommended)

To start the complete production stack (MySQL + Spring Boot Backend + React/Nginx Frontend):

```bash
docker compose up -d --build
```

- **Frontend Console:** [http://localhost](http://localhost) (Port 80)
- **Backend API:** [http://localhost:8080](http://localhost:8080)
- **Swagger UI:** [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)
- **Health Check:** [http://localhost:8080/actuator/health](http://localhost:8080/actuator/health)

To stop the containers:
```bash
docker compose down
```

---

### Option B: Running Locally (Manual Dev Mode)

#### 1. Database Setup
Create database and user in MySQL:
```sql
CREATE DATABASE IF NOT EXISTS tom_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'tom_user'@'localhost' IDENTIFIED BY 'tom_pass';
GRANT ALL PRIVILEGES ON tom_db.* TO 'tom_user'@'localhost';
FLUSH PRIVILEGES;
```

#### 2. Start Backend
```bash
cd backend
mvn spring-boot:run
```
Backend will start on `http://localhost:8080`. Flyway will apply migrations automatically.

#### 3. Start Frontend
```bash
cd tom-frontend
npm install
npm run dev
```
Frontend development server will start on `http://localhost:5173`.

---

## 🔐 Default System Credentials

| Role | Username | Password | Access Scope |
|---|---|---|---|
| **Admin** | `admin` | `Admin@123` | Full ERP System Access (all 34 permissions) |

> **Role Simulation:** When logged in as Admin, you can use the profile menu dropdown in the top navigation bar to seamlessly simulate and preview the user experience for other roles (*Field Officer*, *Senior Worker*, *Sales Representative*, *Office Accountant*).

---

## 📖 API Documentation & Health Monitoring

- **Interactive API Documentation:** [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)
- **OpenAPI 3.0 JSON Spec:** [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)
- **Actuator Health Endpoint:** [http://localhost:8080/actuator/health](http://localhost:8080/actuator/health)

All API responses follow the standard envelope format:
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully",
  "errors": null
}
```

---

## 📂 Repository Structure

```text
TOM/
├── backend/                             # Spring Boot 3.3.5 Backend Service
│   ├── src/main/java/com/tom/
│   │   ├── auth/                        # JWT Security, RBAC, Users, Roles & Permissions
│   │   ├── common/                      # Audit Logs, Standard ApiResponse, Global Exceptions
│   │   ├── config/                      # OpenAPI & Security Configurations
│   │   ├── finance/                     # Financial Transactions, Ledgers & Payments
│   │   ├── inventory/                   # Warehouses, Silos & Batch Tracking
│   │   ├── logistics/                   # Weighbridge Tickets & Fleet Movement
│   │   ├── processing/                  # Expeller Units & Milling Runs
│   │   ├── procurement/                 # Suppliers, Deals & 12h Reservations
│   │   ├── sales/                       # B2B Wholesale Customers & Sales Orders
│   │   └── workforce/                   # Employees, Attendance, Payroll & Workers
│   ├── src/main/resources/
│   │   ├── application.yml              # Config with Environment Variable Fallbacks
│   │   └── db/migration/                # Flyway Migrations (V1, V2, V3)
│   ├── Dockerfile                       # Multi-stage JDK build -> lightweight JRE image
│   └── pom.xml
├── tom-frontend/                        # React 19 + Vite Enterprise Web Console
│   ├── src/
│   │   ├── api/                         # Axios REST Client & Endpoint Definitions
│   │   ├── components/                  # Navigation Layout & Reusable UI Components
│   │   ├── context/                     # Auth Context & Operational Data Replication
│   │   └── pages/                       # 16 Enterprise Module Pages
│   ├── Dockerfile                       # Multi-stage Node build -> Nginx Alpine image
│   ├── nginx.conf                       # Production Nginx reverse-proxy & routing
│   ├── package.json
│   └── vite.config.js
├── docs/                                # Technical Blueprints & Architecture Docs
├── docker-compose.yml                   # Unified MySQL + Backend + Frontend Orchestration
├── DESIGN.md                            # Official UI/UX Design System Specifications
├── DEVELOPMENT.md                       # Developer DX & Time-to-Hello-World Guide
└── README.md                            # Master Project Documentation
```

---

## 📄 License & Proprietary Notice

Copyright © 2026 **Tirumala Oil Mill (TOM)**. All rights reserved.  
Internal enterprise application built strictly for Tirumala Oil Mill operational workflows.

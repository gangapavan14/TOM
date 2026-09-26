# Tirumala Oil Mill (TOM) — Developer Guide & DX Handbook

Welcome to the Tirumala Oil Mill (TOM) codebase. This document is designed to get any new engineer or contributor from zero to a running development environment in under 3 minutes, with complete architecture and debugging visibility.

---

## 1. Quick Start (Time-to-Hello-World < 3 min)

### Prerequisites
- **Java 17+** (`java -version`)
- **Maven 3.8+** (`mvn -v`)
- **Node.js 18+** & **npm** (`node -v`, `npm -v`)
- **MySQL 8.0** running locally on port 3306 (or via Docker)

### Step 1: Database Setup
Make sure MySQL is running and create the database with user credentials:
```sql
CREATE DATABASE IF NOT EXISTS tom_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'tom_user'@'localhost' IDENTIFIED BY 'tom_pass';
GRANT ALL PRIVILEGES ON tom_db.* TO 'tom_user'@'localhost';
FLUSH PRIVILEGES;
```
*(Flyway automatically migrates schemas V1, V2, and V3 upon backend startup).*

### Step 2: Start Backend
```bash
cd backend
mvn spring-boot:run
```
- Server starts at `http://localhost:8080`
- Health check: `http://localhost:8080/actuator/health` -> `{"status":"UP"}`
- Interactive API Docs & Swagger UI: `http://localhost:8080/swagger-ui/index.html`
- OpenAPI JSON Spec: `http://localhost:8080/v3/api-docs`

### Step 3: Start Frontend
```bash
cd tom-frontend
npm install
npm run dev
```
- Vite dev server runs at `http://localhost:5173`
- API calls to `/api/*` automatically proxy to `http://localhost:8080`

### Default System Credentials
| Role | Username | Password | Access Scope |
|------|----------|----------|--------------|
| **Admin** | `admin` | `Admin@123` | Full ERP System Access (all 34 permissions) |

---

## 2. System Architecture

```
                  +-----------------------------------------+
                  |         React 18 + Vite Frontend        |
                  |     Tailwind CSS - Port 5173 / Local    |
                  +--------------------+--------------------+
                                       | Proxy /api/*
                                       v
                  +-----------------------------------------+
                  |         Spring Boot 3.3.5 Backend       |
                  |             Port 8080 (REST)            |
                  |  - Stateless JWT Security (Bearer)      |
                  |  - Spring Data JPA + Hibernate          |
                  |  - Flyway Database Migrations           |
                  |  - Springdoc OpenAPI 3.0 (Swagger UI)   |
                  +--------------------+--------------------+
                                       | JDBC / HikariCP
                                       v
                  +-----------------------------------------+
                  |             MySQL 8.0 Database          |
                  |         `tom_db` (UTF8MB4) Port 3306    |
                  +-----------------------------------------+
```

---

## 3. API Surface & Module Endpoints

All endpoints use a unified `ApiResponse<T>` response envelope:
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message",
  "errors": null
}
```

| Module | Base Path | Key Endpoints | Description |
|--------|-----------|---------------|-------------|
| **Authentication** | `/api/auth` | `POST /login`, `POST /refresh` | Issues JWT Bearer tokens |
| **Inventory** | `/api/inventory` | `GET /warehouses`, `GET /batches`, `POST /batches` | Warehouse silos, oil tanks & stock |
| **Procurement** | `/api/procurement` | `GET /suppliers`, `GET /orders`, `POST /orders` | Seed procurement & vendor orders |
| **Processing** | `/api/processing` | `GET /batches`, `POST /batches` | Expeller runs & oil extraction batches |
| **Logistics** | `/api/logistics` | `GET /transporters`, `GET /trips`, `POST /trips` | Vehicle tracking, gate passes |
| **Sales** | `/api/sales` | `GET /customers`, `GET /orders`, `POST /orders` | Customer orders, credit & dispatch |
| **Finance** | `/api/finance` | `GET /transactions`, `GET /invoices`, `POST /invoices` | Ledgers, payments & invoices |
| **Workforce** | `/api/workforce` | `GET /employees`, `GET /tasks`, `POST /tasks` | Employee roster & daily tasks |
| **Audit Logs** | `/api/audit-logs` | `GET /` | Tamper-evident system activity trail |
| **System Health** | `/actuator` | `GET /health`, `GET /info` | Production health & metrics |

---

## 4. Error Handling Guidelines

All errors return the standard error envelope with appropriate HTTP status codes:

```json
{
  "success": false,
  "message": "Malformed JSON request body. Please verify request syntax and field formats.",
  "errors": { "field": "Reason" }
}
```

### HTTP Status Code Contracts:
- `400 Bad Request`: Business rule validation error or malformed JSON payload (`HttpMessageNotReadableException`).
- `401 Unauthorized`: Bad credentials or missing/expired JWT token (`BadCredentialsException`, `AuthenticationException`).
- `403 Forbidden`: Authenticated user lacks permission (`AccessDeniedException`).
- `404 Not Found`: Endpoint or requested entity ID does not exist (`NoResourceFoundException`).
- `405 Method Not Allowed`: Incorrect HTTP verb (`HttpRequestMethodNotSupportedException`).
- `500 Internal Server Error`: Unhandled server exception (logged with stack trace in backend logs).

---

## 5. Developer Quality Checklist
- [x] Springdoc OpenAPI / Swagger UI live at `http://localhost:8080/swagger-ui/index.html`
- [x] JWT Bearer authentication supported directly in Swagger UI
- [x] Actuator health endpoint configured at `http://localhost:8080/actuator/health`
- [x] Standard `ApiResponse<T>` envelope for all endpoints
- [x] Clean Flyway database version control
- [x] Vite dev proxy configured to prevent CORS in development
- [x] Global exception handler with accurate HTTP status codes (no 500s on 404 or bad JSON)

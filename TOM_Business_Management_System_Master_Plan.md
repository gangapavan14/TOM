# Tirumala Oil Mill (TOM) — Business Management System
## Master System Design & Implementation Plan

**Document status:** Requirements baseline + implementation blueprint  
**Version:** 1.0  
**Date:** 2026-09-26

---

## 1. Purpose

This document defines the planned architecture, modules, workflows, roles, data model, technical structure, security model, and implementation roadmap for the Tirumala Oil Mill (TOM) Business Management System.

The system is intended to become the central operational platform for TOM's:

- Procurement
- Supplier management
- Quality inspection
- Processing
- Inventory and warehouses
- Stock movement and logistics
- B2B sales
- Future B2C commerce
- Finance and accounting
- Workforce and employment management
- Documents
- Notifications and internal communication
- Audit and reporting

The application must model the real business process rather than becoming a collection of disconnected CRUD screens.

---

# 2. Core Design Principles

## 2.1 Business-first design

The software must follow TOM's real-world workflows.

Business decisions should not be hidden inside database CRUD operations.

Examples:

- Stock is not inventory merely because somebody entered a receipt.
- A procurement reservation is not permanent until its negotiation/delivery conditions are satisfied.
- A worker cannot become an employee simply because an application was submitted.
- A B2B payment collected by a sales employee does not become an official financial transaction until Admin verifies it.
- Inventory cannot be deducted from a customer pickup until physical loading is recorded and verified.

## 2.2 Role-based authority

Every important action must be controlled by role and permission.

The system must distinguish:

- Who can decide
- Who can execute
- Who can verify
- Who can approve
- Who can make/pay money
- Who can only view information

## 2.3 Admin is the financial authority

Admin controls:

- Business payments
- Supplier payments
- Customer payment verification
- Expenses
- Salaries
- Incentives
- Bonuses
- Temporary worker approval
- Temporary worker payment rates
- Employment decisions
- Exceptional approvals

Supported payment methods include:

- Cash
- UPI
- Bank transfer
- Cheque
- Future configurable payment methods

## 2.4 Traceability

The system must trace stock from:

**Supplier → Procurement → Quality → Processing → Batch → Warehouse → Bag → Sale/Transfer → Customer**

## 2.5 Configurable business policies

Do not hard-code business policies that may change.

Examples:

- Negotiation limits
- Procurement reservation timeout
- Early supplier-payment deductions
- Supplier payment terms
- Commission rules
- Customer credit terms
- Delivery charges
- Loading charges
- Wage rules
- Expense categories
- Payment methods

## 2.6 Auditability

Important business and financial changes must create audit records.

Record:

- Actor
- Action
- Date/time
- Entity
- Previous value
- New value
- Reason where required

---

# 3. Recommended Technical Architecture

## 3.1 Architecture style

Use a **Spring Boot modular monolith** initially.

This is preferred over microservices because:

- TOM is one business organization.
- Modules have strong transactional relationships.
- Inventory, procurement, sales and finance need reliable transactions.
- Deployment and maintenance are simpler.
- The system can later extract services if scale genuinely requires it.

## 3.2 High-level architecture

```text
                         ┌─────────────────────────┐
                         │       Web Frontend      │
                         │ Dashboard / Admin / B2B │
                         └────────────┬────────────┘
                                      │ HTTPS
                                      ▼
                         ┌─────────────────────────┐
                         │    Spring Boot API      │
                         │ Authentication / RBAC   │
                         └────────────┬────────────┘
                                      │
              ┌───────────────────────┼────────────────────────┐
              │                       │                        │
              ▼                       ▼                        ▼
       ┌────────────┐         ┌──────────────┐         ┌──────────────┐
       │ Procurement│         │  Inventory   │         │    Sales     │
       └────────────┘         └──────────────┘         └──────────────┘
              │                       │                        │
              └───────────────┬───────┴──────────────┬─────────┘
                              ▼                      ▼
                       ┌──────────────┐       ┌──────────────┐
                       │   Finance    │       │  Workforce   │
                       └──────────────┘       └──────────────┘
                              │                      │
                              └──────────┬───────────┘
                                         ▼
                                  ┌──────────────┐
                                  │   MySQL DB   │
                                  └──────────────┘

                    Supporting modules:
                    Documents / Audit / Notifications / Logistics
```

---

# 4. Recommended Technology Stack

## Backend

- Java
- Spring Boot
- Spring Web
- Spring Security
- Spring Data JPA
- Hibernate
- Bean Validation
- Flyway
- Maven
- MySQL

## Frontend

Recommended:

- HTML
- CSS
- JavaScript
- A modern component/UI layer as the frontend grows

The frontend should consume REST APIs rather than directly accessing the database.

## Infrastructure

Development:

- Docker
- Docker Compose
- MySQL container

Production can later use:

- Linux server/cloud VM
- Managed MySQL if appropriate
- HTTPS
- Reverse proxy
- Automated backups

## Testing

- JUnit
- Mockito
- Spring Boot Test
- Testcontainers
- API/integration tests
- Frontend tests where appropriate

---

# 5. Major Modules

```text
1. Authentication & Authorization
2. Organization / Configuration
3. Workforce Management
4. Procurement
5. Quality Management
6. Processing
7. Inventory & Warehouses
8. Logistics / Fleet
9. B2B Sales
10. B2C Catalogue
11. Finance & Accounting
12. Documents
13. Notifications
14. Internal Communication
15. Audit
16. Reports & Analytics
```

---

# 6. Roles and Authority

## 6.1 Admin

Admin is the highest business authority.

Responsibilities:

- Hiring
- Employment management
- Salary configuration
- Incentives
- Bonuses
- Temporary-worker approvals
- Temporary-worker payment rates
- Financial payments
- Supplier payment decisions
- Expense management
- Payment verification
- Pricing exceptions
- Exceptional procurement decisions
- Customer credit/financial approvals
- Management reports

## 6.2 Office Employee / Agent

Office employees coordinate operational work.

Responsibilities may include:

- Assign work to Field Officers
- Assign work to Senior Workers
- Coordinate operations
- Handle customer/supplier communication where permitted
- Create operational tasks
- Monitor task progress

They do not automatically receive financial authority.

Specific permissions should be configurable by Admin.

## 6.3 Field Officer

Field Officers are operational decision makers.

Responsibilities:

- Procurement inspection
- Quality assessment
- Grade assignment
- Accepted/rejected quantity decisions
- Procurement price decision within authority
- Processing decision
- Supplier negotiation within configured limits
- Escalation to Admin
- Inventory verification
- Verification of customer pickup/loading
- Operational confirmation

## 6.4 Senior Worker

Senior Worker has two responsibilities:

1. Physical work
2. Worker management

Responsibilities:

- Assign workers
- Coordinate workers
- Supervise work
- Record physical execution
- Record loading/unloading
- Report issues
- Perform physical work themselves

## 6.5 Worker

Workers execute assigned physical work.

Examples:

- Loading
- Unloading
- Bagging
- Weighing
- Drying
- Cleaning
- Polishing
- Stacking
- Warehouse movement

## 6.6 Temporary / Part-time Worker

Anyone can apply for temporary work.

Rules:

- Application does not create employment automatically.
- Admin approves/rejects application.
- Admin determines payment rate.
- Payment is based on completed work.
- Temporary workers cannot assign work.
- Work is coordinated through the operational hierarchy.

## 6.7 Sales Employee / Sales Team

The system should support sales-specific permissions for:

- B2B enquiries
- Customer acquisition
- Negotiation
- Orders
- Collections
- Credit follow-up

Exact role naming can be finalized during implementation.

---

# 7. Workforce Management

## 7.1 Permanent employment

Current default monthly salaries:

| Role | Monthly Salary |
|---|---:|
| Worker | ₹10,000 |
| Senior Worker | ₹15,000 |
| Field Officer | ₹20,000 |
| Office Employee | ₹20,000 |

These are configurable by Admin.

## 7.2 Senior Worker

Senior Worker:

- Works physically
- Manages workers
- Assigns work to workers
- Supervises execution

## 7.3 Incentives and bonuses

Admin controls:

- Amount
- Employee/worker
- Reason
- Payroll month
- Payment status

No automatic performance bonus should be assumed in V1.

## 7.4 Temporary worker application

Flow:

```text
Applicant
   ↓
Temporary Work Application
   ↓
Admin Review
   ├── Rejected
   └── Approved
          ↓
   Temporary Worker Profile
          ↓
      Work Assignment
          ↓
     Work Completion
          ↓
    Payment Calculation
          ↓
       Admin Payment
```

Payment can be:

- Per day
- Per hour
- Per bag
- Per tonne
- Per task
- Other configurable unit

## 7.5 Attendance

Planned:

- Present
- Absent
- Leave
- Half-day
- Overtime
- Attendance correction history

## 7.6 Payroll

Payroll should support:

- Base salary
- Attendance/leave effects once policy is defined
- Overtime if applicable
- Incentives
- Bonuses
- Advances
- Deductions
- Final payable amount
- Payment status

Actual money movement is handled by Finance.

---

# 8. Procurement Module

## 8.1 Procurement sources

TOM can acquire stock through:

1. Farmer directly approaching TOM
2. TOM/field agent approaching farmer
3. Third-party commission agent bringing farmer-owned stock

Important:

A commission agent does not necessarily own the stock.

## 8.2 Procurement requirement

Admin can create a requirement:

```text
Commodity: Maize
Required: 10,000 kg
Available requirement: 10,000 kg
```

A supplier may reserve:

```text
Supplier commits: 1,000 kg
Remaining requirement: 9,000 kg
```

The reservation must have:

- Supplier
- Commodity
- Quantity
- Created time
- Expiry time
- Status

## 8.3 12-hour reservation rule

The reserved quantity is temporarily held.

If the supplier:

- does not bring the stock, or
- does not complete price negotiation

within 12 hours, the reserved quantity automatically returns to the requirement.

```text
Requirement
   ↓
Reservation
   ↓
12-hour window
   ├── Failed/expired → Quantity released
   └── Agreement → Reservation converted to procurement
```

This rule must be implemented as a real domain workflow, not merely as a UI timer.

## 8.4 24-hour delivery window

After a deal is finalized:

- Delivery window = 24 hours
- Accepted stock follows the agreed procurement process
- No renegotiation after finalization

The 12-hour reservation/negotiation window and 24-hour delivery window are separate rules.

## 8.5 Commission agent

Commission may be:

- Negotiated separately
- Quality/price based
- Fixed per farmer regardless of quantity

The commission rule should be stored with the transaction.

## 8.6 Weighment

Stock can be weighed using:

- Dharmakanta/weighbridge
- Labour weighing

Even when Dharmakanta is used:

- Workers still divide stock into 50 kg bags
- Bags are physically stored in warehouses

Standard bag size:

**50 kg**

## 8.7 Quality inspection

Primary quality factors:

- Moisture
- Colour
- Appearance

Grades:

- A+
- A
- B
- C

There is no Grade D.

D-level condition means rejection.

## 8.8 Partial acceptance/rejection

Partial acceptance is supported when incoming stock contains different types/qualities.

Example:

```text
Received: 1,000 kg

Accepted:
800 kg → Grade B

Rejected:
200 kg
```

Rejected stock:

- Does not enter inventory
- Does not become payable as accepted stock

## 8.9 Procurement pricing

Field Officer determines final stock price based on:

- Quality
- Quantity

Once accepted quantity, grade and price are finalized:

- No renegotiation
- Treated as final/fair procurement price

## 8.10 Processing decision

Field Officer decides whether processing is required.

For turmeric, possible processing includes:

```text
Drying → Cleaning → Polishing
```

The exact processing chain should be represented as configurable processing steps rather than hard-coded only for turmeric.

---

# 9. Inventory Management

## 9.1 Warehouse structure

Current structure:

```text
Warehouse
 ├── Rooms
 │    ├── Commodity
 │    │    ├── Grade
 │    │    │    └── Batches
 │    │    │         └── Bags
```

Hero-product warehouses:

- Turmeric
- Maize
- Til/Sesame

Each has separate quality rooms.

General warehouse:

- Other commodities share the warehouse
- Separate rooms by commodity
- Stock is stacked by grade in batches

## 9.2 Stock identity

Use separate identifiers:

### Product/grade code

Examples:

- Turmeric A+
- Turmeric A
- Turmeric B
- Turmeric C
- Maize A
- Maize B

### Batch ID

Example:

```text
TUR-260926-001
```

### Bag ID

Example:

```text
TUR-260926-001-001
```

Bag IDs must remain permanent.

Do not encode warehouse/location in the permanent bag ID.

## 9.3 No scanning in V1

V1:

- Manual IDs
- Manual entry/search

Future:

- QR
- Barcode
- Scanner/mobile camera

The database design should allow future scanning.

## 9.4 Inventory eligibility

```text
Received
   ↓
Inspection
   ↓
Accepted / Rejected
   ↓
Grade
   ↓
Processing if required
   ↓
Inventory Eligible
   ↓
Inventory
```

## 9.5 Stock movement

Stock transfers must be proper logistics transactions.

Example states:

```text
Requested
→ Vehicle Assigned
→ Loading
→ In Transit
→ Received
→ Completed
```

Do not simply change `warehouse_id`.

## 9.6 Weight loss / damage / spoilage

Stock adjustments should support reasons:

- Moisture/weight reduction
- Damaged bags
- Spoilage
- Pest damage
- Processing loss
- Handling loss
- Scrap
- Other

Most stock should not spoil, but the system must support exceptional events.

## 9.7 Batch costing

Batch cost should support:

```text
Purchase Cost
+ Processing Cost
+ Transportation Cost
+ Other Direct Costs
= Total Batch Cost
```

Effective cost:

```text
Effective Cost/kg
= Total Current Batch Cost
  / Current Sellable Quantity
```

Weight loss must therefore affect current quantity and effective cost.

---

# 10. Logistics / Fleet

Reusable logistics module for:

- Procurement pickup
- Warehouse transfers
- B2B delivery
- Future B2C delivery

Vehicle types:

- Auto
- Truck
- Other configurable types

Ownership:

- TOM-owned
- Hired/external

Potential vehicle records:

- Vehicle number
- Type
- Owner
- Driver
- Contact
- Status
- Maintenance information

---

# 11. B2B Sales

## 11.1 Customer acquisition

Sources:

- Customer approaches TOM
- TOM sales team approaches customer

Store source:

- Inbound
- Outbound

## 11.2 Customer ordering

Customer can:

- Call sales team
- Book required stock/quality through website

All channels should converge into one Sales Order model.

## 11.3 B2B order flow

```text
Enquiry
→ Negotiation
→ Order
→ Payment/Credit Decision
→ Invoice
→ Stock Reservation
→ Loading
→ Verification
→ Dispatch
→ Delivery
→ Collection/Settlement
```

## 11.4 Stock reservation

Ordered quantity must be reserved so it cannot be sold elsewhere.

## 11.5 Customer pickup

Customer:

- Brings own vehicle
- Pays no TOM delivery charge

TOM:

- Loads bags
- Loading cost applies

Senior Worker:

- Records bags loaded

Field Officer:

- Verifies physical loading
- Verifies stock
- Authorizes inventory deduction/update

If actual physical count differs from recorded count:

- Do not automatically deduct
- Create exception/verification state

## 11.6 TOM delivery

If TOM delivers:

- Delivery cost applies
- Logistics module manages vehicle/dispatch

## 11.7 B2B payment

Supported:

- Online payment
- Direct payment to Admin
- Credit

Credit can be repaid:

- One-time
- Installments

Target collection period:

- Approximately 15–20 days

## 11.8 Sales collection verification

Sales employee collects:

```text
Customer pays sales employee
        ↓
Sales employee records collection
        ↓
Admin verification
        ↓
Official financial transaction
        ↓
Customer outstanding balance updated
```

## 11.9 Cash reconciliation

For cash collected by sales team:

```text
Expected Cash
vs
Cash Handed to Admin
vs
Verified Cash
```

Discrepancies require resolution.

## 11.10 B2B pricing

Customer-specific negotiation.

Maintain separate concepts:

- Product cost
- Internal/reference price
- Customer-agreed selling price

Admin can be involved in escalation.

## 11.11 Documents

Transaction documents can include:

- Invoice
- Credit agreement
- Signed installment document
- Delivery document
- Signed acknowledgement
- Payment records

---

# 12. B2C Catalogue

V1 is not an online marketplace and is not multi-vendor.

TOM sells its own products.

## V1

Build a product showcase/catalogue website:

- Product listing
- Product details
- Product categories
- Images
- Descriptions
- Quality/grade information where appropriate
- Pack/product information
- Contact/enquiry capability

## Future

Architecture must allow:

```text
Catalogue
→ Cart
→ Checkout
→ Payment Gateway
→ B2C Order
→ Inventory Reservation
→ Packing
→ Dispatch
→ Delivery
```

A separate B2C packing team will be introduced when online sales are enabled.

---

# 13. Finance & Accounting

## 13.1 Admin financial authority

All official business payments are managed by Admin.

Payment methods:

- Cash
- UPI
- Bank transfer
- Cheque
- Future configurable methods

## 13.2 Financial accounts

Do not model money as one generic balance.

Support multiple financial accounts such as:

- Cash
- Bank accounts
- UPI accounts
- Other accounts

Admin can manage these.

## 13.3 Expense categories

Expense categories must be configurable.

Current examples:

- Employees/workers
- Vehicle fuel
- Vehicle maintenance
- Hired vehicle charges
- Electricity
- Warehouse maintenance
- Packaging
- Bags
- Processing machinery
- Repairs
- Storage/pest-control
- Office expenses
- Rent
- Internet/phone
- Taxes
- Commissions
- Loading/unloading
- Transportation
- Bank/payment charges
- Marketing

## 13.4 Expense classification

Each expense can be classified as:

- General business expense
- Inventory/direct cost
- Processing cost
- Logistics cost
- Capital expenditure

## 13.5 Expense record

Recommended fields:

- Category
- Amount
- Date
- Payee/vendor
- Payment method
- Financial account
- Description
- Related batch/order/task if applicable
- Attachment
- Admin/operator
- Verification/payment status

## 13.6 Supplier payments

Supplier payment flow:

```text
Procurement Accepted
→ Supplier Payable
→ Payment Due
→ Admin Payment
→ Payment Recorded
→ Supplier Balance Updated
```

Normal payment:

**15–20 days**

Early payment:

- Supplier may request immediate payment
- Deduction according to configurable TOM policy

## 13.7 Supplier cash payment

If supplier wants cash:

- Supplier takes appointment with Admin
- Admin handles payment
- Payment is recorded

## 13.8 Supplier UPI/bank payment

Supplier can provide:

- UPI details
- Bank details

Payment is made according to policy.

## 13.9 Batch-related finance

Direct costs can be attached to batches:

- Procurement cost
- Processing
- Transportation
- Other direct costs

This feeds batch costing.

---

# 14. Accounting Model

The initial system should maintain operational financial ledgers even if full double-entry accounting is introduced later.

Core ledgers:

- Supplier payable ledger
- Customer receivable ledger
- Expense ledger
- Payroll payable
- Payment ledger
- Cash ledger
- Bank/UPI ledger
- Batch cost ledger
- Commission ledger

A future accounting layer can introduce full double-entry bookkeeping without redesigning operational transactions.

---

# 15. Documents

Central document service should support:

- Invoices
- Agreements
- Signed documents
- Receipts
- Supplier documents
- Employee documents
- Payment proof
- Delivery documents
- Other attachments

Documents must be linked to business entities.

Example:

```text
Customer Payment
   └── Payment Proof

Credit Sale
   ├── Invoice
   └── Signed Credit Document
```

---

# 16. Notifications

The system should eventually support notifications for:

- Procurement reservation expiring
- Negotiation timeout
- Delivery deadlines
- Pending verification
- Pending customer collections
- Supplier payments due
- Task deadlines
- Temporary worker application
- Payroll/payment events

Notifications should be configurable.

---

# 17. Internal Communication

The procurement process requires communication between Field Officers and Admin for exceptional negotiations.

Potential V1/V2 communication:

- Conversation/thread
- Related business transaction
- Messages
- Attachments
- Participants
- Read status
- Audit history

Example:

```text
Procurement Deal
    ↓
Field Officer escalates
    ↓
Admin ↔ Field Officer chat
    ↓
Decision recorded
```

Do not make chat the source of truth for important business decisions. Important decisions must also be stored as structured transaction data.

---

# 18. Audit System

Audit important actions.

Examples:

```text
Admin changed salary
Admin approved temporary worker
Field Officer changed procurement grade
Field Officer confirmed accepted quantity
Admin approved customer payment
Admin recorded supplier payment
Senior Worker completed loading record
Admin changed credit terms
```

Audit record:

```text
actor
action
entity_type
entity_id
old_value
new_value
timestamp
reason
```

---

# 19. Core Domain Entities

Initial entity list:

## Organization

- Organization
- User
- Role
- Permission
- RolePermission

## Workforce

- Employee
- Worker
- Employment
- EmploymentHistory
- TemporaryWorkerApplication
- SalaryStructure
- Payroll
- PayrollItem
- Incentive
- Bonus
- Advance
- Attendance
- Leave
- WorkTask
- WorkAssignment
- WorkerAvailability

## Procurement

- Supplier
- Farmer
- Trader
- CommissionAgent
- ProcurementRequirement
- ProcurementReservation
- ProcurementDeal
- ProcurementBatch
- GoodsReceipt
- Weighment
- QualityInspection
- QualityGrade
- AcceptanceRecord
- RejectionRecord
- SupplierPayable
- CommissionRecord

## Processing

- ProcessingOrder
- ProcessingStep
- ProcessingExecution
- ProcessingLoss

## Inventory

- Product
- ProductVariant
- Grade
- Warehouse
- Room
- Batch
- Bag
- StockLedger
- StockMovement
- StockAdjustment
- ScrapRecord
- StorageTreatment

## Logistics

- Vehicle
- Driver
- VehicleAssignment
- Shipment
- LoadingRecord
- DeliveryRecord
- Transfer

## Sales

- Customer
- CustomerContact
- SalesEnquiry
- SalesNegotiation
- SalesOrder
- SalesOrderItem
- SalesReservation
- Invoice
- CreditSale
- CustomerPayment
- CustomerReceivable
- Collection
- Delivery

## Finance

- FinancialAccount
- Payment
- Expense
- ExpenseCategory
- SupplierPayment
- CustomerCollection
- CashReconciliation
- BatchCost
- CostAllocation

## Documents

- Document
- DocumentLink

## Communication

- Conversation
- Message
- MessageAttachment

## Platform

- Notification
- AuditLog
- SystemSetting
- BusinessPolicy

---

# 20. Important State Machines

The system should use explicit states.

## Procurement Requirement

```text
OPEN
→ PARTIALLY_RESERVED
→ FULLY_RESERVED
→ CLOSED
```

## Reservation

```text
ACTIVE
→ NEGOTIATING
→ AGREED
→ CONVERTED
```

or:

```text
ACTIVE
→ EXPIRED
→ RELEASED
```

## Procurement

```text
NEGOTIATION
→ AGREED
→ DELIVERY_PENDING
→ RECEIVED
→ INSPECTING
→ ACCEPTED
→ PROCESSING
→ INVENTORY
```

Alternative rejection branch:

```text
INSPECTING
→ REJECTED
```

## Stock Transfer

```text
REQUESTED
→ VEHICLE_ASSIGNED
→ LOADING
→ IN_TRANSIT
→ RECEIVED
→ COMPLETED
```

## B2B Order

```text
ENQUIRY
→ NEGOTIATION
→ CONFIRMED
→ RESERVED
→ PAYMENT_PENDING / CREDIT_APPROVED
→ INVOICED
→ LOADING
→ VERIFIED
→ DISPATCHED
→ DELIVERED
→ CLOSED
```

## Temporary Worker

```text
APPLIED
→ UNDER_REVIEW
→ APPROVED
→ ACTIVE
→ WORK_COMPLETED
→ PAYMENT_PENDING
→ PAID
```

---

# 21. Database Design Principles

## 21.1 Avoid duplicated truth

Examples:

- Inventory quantity should derive from stock transactions/ledger rather than arbitrary manual updates.
- Customer outstanding should be based on sales and verified payments.
- Supplier payable should be based on accepted procurement and payments.
- Payroll payable should derive from payroll records.

## 21.2 Use transaction boundaries

Critical operations must be atomic.

Example:

When confirming a customer pickup:

1. Validate loading record
2. Validate Field Officer verification
3. Validate available stock
4. Create stock deduction
5. Update order
6. Commit

If any critical step fails, the transaction should roll back.

## 21.3 Money

Never use floating-point numbers for financial values.

Use:

- Decimal / BigDecimal
- Explicit currency
- Proper rounding policy

## 21.4 Quantities

Commodity quantities should support precise units.

Recommended:

- kg as base inventory unit
- tonnes as display/conversion unit
- bags as physical packaging unit

Example:

```text
1 tonne = 1,000 kg
1 standard bag = 50 kg
```

Actual bag weight must still be recorded where needed.

---

# 22. API Structure

Use REST APIs grouped by domain.

Example:

```text
/api/auth
/api/users
/api/workforce
/api/attendance
/api/tasks

/api/procurement
/api/procurement/requirements
/api/procurement/reservations
/api/procurement/deals
/api/procurement/receipts
/api/procurement/quality

/api/inventory
/api/inventory/products
/api/inventory/batches
/api/inventory/bags
/api/inventory/movements
/api/inventory/adjustments

/api/logistics
/api/vehicles
/api/transfers
/api/deliveries

/api/sales
/api/customers
/api/orders
/api/invoices
/api/collections

/api/finance
/api/expenses
/api/payments
/api/accounts
/api/payroll
/api/reconciliation

/api/documents
/api/notifications
/api/audit
/api/reports
```

---

# 23. Backend Package Structure

Recommended modular package structure:

```text
com.tom

├── auth
├── workforce
├── procurement
├── quality
├── processing
├── inventory
├── logistics
├── sales
├── b2c
├── finance
├── documents
├── notifications
├── communication
├── audit
├── reporting
└── common
```

Each module should contain its own:

```text
controller
service
repository
domain/entity
dto
mapper
validation
exception
```

Do not create one giant controller/service/repository package containing everything.

---

# 24. Frontend Structure

The frontend should be role-aware.

## Admin Dashboard

- Business overview
- Procurement
- Inventory
- Sales
- Finance
- Workforce
- Reports
- Approvals
- Settings
- Audit

## Office Employee Dashboard

- Assigned operational work
- Field Officer assignments
- Senior Worker assignments
- Task progress
- Relevant customer/supplier workflows

## Field Officer Dashboard

- Assigned inspections
- Procurement deals
- Quality inspection
- Processing decisions
- Loading verification
- Escalations

## Senior Worker Dashboard

Mobile-friendly:

- Assigned work
- Worker list
- Worker assignment
- Loading/unloading
- Task completion
- Issue reporting

## Worker Dashboard

Simple mobile UI:

- Assigned tasks
- Task details
- Start/complete
- Quantity completed
- Issue reporting

## Temporary Worker

- Apply for temporary work
- View application status
- View assigned work
- View completed work
- View payment status

---

# 25. Dashboard KPIs

Admin dashboard can eventually include:

## Procurement

- Today's procurement
- Pending requirements
- Active reservations
- Expiring reservations
- Pending inspections
- Accepted/rejected quantities

## Inventory

- Total stock
- Stock by commodity
- Stock by grade
- Stock by warehouse
- In-transit stock
- Scrap/loss

## Sales

- Open orders
- Reserved stock
- Sales value
- Receivables
- Overdue payments

## Finance

- Cash balance
- Bank/UPI balances
- Payables
- Receivables
- Expenses
- Payroll payable

## Workforce

- Active workers
- Attendance
- Open tasks
- Completed tasks
- Temporary worker applications

---

# 26. Security

Implement:

- Authentication
- Role-based authorization
- Permission-based authorization where needed
- Password hashing
- Session/token security
- HTTPS in production
- Input validation
- SQL injection protection through JPA/parameterized queries
- File upload validation
- Audit logging
- Sensitive financial access restrictions

Never allow frontend-only authorization. Backend must enforce permissions.

---

# 27. Data Integrity Rules

Examples:

### Inventory

A bag cannot:

- Exist in two warehouses simultaneously
- Be sold after being scrapped
- Be deducted twice
- Enter inventory before acceptance

### Procurement

A rejected quantity cannot:

- Become inventory
- Become accepted supplier payable

### Reservations

An expired reservation must not continue reducing available requirement.

### Sales

Reserved stock cannot be allocated to another order unless released.

### Payments

An unverified sales collection must not reduce customer outstanding.

### Payroll

A paid payroll record should not silently change without an audited correction process.

---

# 28. Reporting

Planned reports:

## Procurement

- Procurement by commodity
- Supplier-wise procurement
- Farmer-wise procurement
- Agent commissions
- Accepted/rejected quantity
- Grade distribution
- Procurement price analysis

## Inventory

- Current stock
- Batch stock
- Grade stock
- Warehouse stock
- Stock movement
- Weight loss
- Scrap
- Processing loss

## Sales

- Customer-wise sales
- Product-wise sales
- Revenue
- Credit sales
- Collections
- Outstanding
- Overdue

## Finance

- Expenses by category
- Cash flow
- Account balances
- Supplier payables
- Customer receivables
- Payroll
- Batch cost
- Profitability

## Workforce

- Attendance
- Work completed
- Payroll
- Incentives
- Bonuses
- Temporary worker payments

---

# 29. Implementation Roadmap

Do not build everything simultaneously.

## Phase 0 — Foundation

Build:

- Project structure
- MySQL
- Flyway
- Authentication
- Users
- Roles
- Permissions
- Audit foundation
- Common error handling
- Logging
- Docker development environment

## Phase 1 — Workforce

Build:

- Employees
- Workers
- Employment
- Salary structures
- Temporary worker applications
- Admin approval
- Work assignments
- Senior Worker management
- Attendance
- Payroll foundation
- Incentives
- Bonuses

## Phase 2 — Procurement

Build:

- Suppliers/farmers
- Commission agents
- Requirements
- 12-hour reservation
- Negotiation
- 24-hour delivery window
- Goods receipt
- Weighment
- Quality inspection
- Grades
- Acceptance/rejection
- Procurement pricing
- Supplier payable

## Phase 3 — Processing

Build:

- Processing decision
- Processing orders
- Processing steps
- Execution
- Processing loss
- Cost capture

## Phase 4 — Inventory

Build:

- Products
- Grades
- Warehouses
- Rooms
- Batches
- Bags
- Stock ledger
- Stock adjustments
- Weight loss
- Scrap
- Stock transfers

## Phase 5 — Logistics

Build:

- Vehicles
- Drivers
- Vehicle assignments
- Loading
- Transfers
- Delivery

## Phase 6 — B2B Sales

Build:

- Customers
- Enquiries
- Negotiation
- Orders
- Stock reservation
- Pricing
- Invoices
- Credit
- Collections
- Pickup verification
- Delivery

## Phase 7 — Finance

Build:

- Financial accounts
- Expenses
- Payments
- Supplier payments
- Customer collections
- Cash reconciliation
- Payroll payments
- Batch costing
- Financial reports

## Phase 8 — B2C Catalogue

Build:

- Product catalogue
- Public website
- Product pages
- Enquiry/contact flow

Keep checkout disabled in V1.

## Phase 9 — Advanced Features

Potential future features:

- Online B2C payments
- B2C order management
- Packing team
- QR/barcode
- Mobile scanning
- Advanced analytics
- Automated notifications
- Full double-entry accounting
- External integrations

---

# 30. Development Rules for Codex / Developers

When implementing the project:

1. Do not invent business rules.
2. Use this document as the requirements baseline.
3. If a requirement is ambiguous, mark it as an open decision rather than silently choosing a business rule.
4. Keep modules separated.
5. Use DTOs between API and domain.
6. Validate inputs at the API boundary.
7. Enforce authorization in backend services/controllers.
8. Use database transactions for multi-step business operations.
9. Use Flyway for every schema change.
10. Never manually edit production database schema.
11. Avoid hard-coded policy values.
12. Create configuration entities/settings for business policies.
13. Keep audit history for important actions.
14. Do not allow direct inventory quantity manipulation without a stock transaction/adjustment record.
15. Use BigDecimal for money.
16. Keep identifiers stable and location-independent.
17. Keep physical execution separate from business decisions.
18. Keep financial authorization separate from operational recording.
19. Write automated tests for important workflows, not only CRUD endpoints.
20. Build one module completely enough to be usable before starting the next major module.

---

# 31. Testing Strategy

## Unit tests

Test:

- Business rules
- Price calculations
- Reservation expiry
- Wage calculations
- Batch costing
- Payment calculations
- Quantity conversions

## Integration tests

Test:

- Procurement → inventory
- Sales → inventory
- Payroll → finance
- Payment → receivable/payable
- Processing → batch cost
- Stock transfer → inventory

## Workflow tests

Important end-to-end scenarios:

### Procurement

```text
Requirement
→ Reservation
→ Negotiation
→ Expiry
→ Requirement restored
```

### Successful procurement

```text
Requirement
→ Reservation
→ Agreement
→ Delivery
→ Inspection
→ Acceptance
→ Processing
→ Inventory
→ Supplier payable
→ Payment
```

### B2B customer pickup

```text
Order
→ Stock reservation
→ Loading
→ Senior Worker records
→ Field Officer verifies
→ Inventory deduction
→ Invoice/payment
```

### Temporary worker

```text
Application
→ Admin approval
→ Rate configured
→ Work assignment
→ Work completion
→ Payment calculation
→ Admin payment
```

---

# 32. Open Decisions to Finalize Later

These should remain configurable or explicitly decided before implementing the affected feature.

## Workforce

- Salary impact of leave/absence
- Overtime policy
- Attendance capture method
- Salary payment date
- Advance rules
- Final settlement rules

## Procurement

- Exact negotiation limits per Field Officer
- Exact commission calculation rules
- Exact supplier payment deduction policy
- Exact reservation expiry handling around weekends/holidays

## Inventory

- Whether different procurement batches can be physically mixed in the same stack
- Exact stock-count procedure
- Exact treatment of processing losses

## B2B

- Customer credit limit
- Exact due-date rules
- Late-payment policy
- Delivery confirmation requirements
- Refund/cancellation policy

## Finance

- Full accounting/double-entry requirement
- Tax/GST workflow and reporting requirements
- Bank reconciliation depth
- Financial year configuration

## B2C

- Online payment provider
- Delivery partners
- Returns
- Refunds
- Cancellation rules
- Packaging standards

Do not guess these rules during implementation.

---

# 33. Recommended Build Order

The recommended dependency order is:

```text
Foundation
    ↓
Authentication / RBAC
    ↓
Workforce
    ↓
Procurement
    ↓
Quality
    ↓
Processing
    ↓
Inventory
    ↓
Logistics
    ↓
B2B Sales
    ↓
Finance
    ↓
B2C Catalogue
    ↓
Reports / Analytics
    ↓
Advanced automation
```

However, the database and domain boundaries should be designed from the beginning so later modules do not require major rewrites.

---

# 34. Definition of Done for Each Module

A module should not be considered complete just because CRUD screens exist.

A module is complete when it has:

- Domain model
- Database migration
- Business rules
- REST APIs
- Authorization
- Validation
- Error handling
- Audit logging where required
- UI
- Important workflow states
- Integration with dependent modules
- Unit tests
- Integration tests
- Seed/demo data where useful
- Documentation

---

# 35. Final System Vision

The final TOM system should operate as one connected business platform:

```text
                    ┌──────────────┐
                    │    ADMIN     │
                    └──────┬───────┘
                           │
          ┌────────────────┼─────────────────┐
          ▼                ▼                 ▼
     Workforce         Finance           Configuration
          │                │
          ▼                │
   Office Employees        │
          │                │
     ┌────┴─────┐          │
     ▼          ▼          │
Field Officer  Senior      │
     │         Worker      │
     │            │        │
     │         Workers     │
     │                     │
     └──────────┬──────────┘
                ▼
           OPERATIONS
                │
     ┌──────────┼───────────┐
     ▼          ▼           ▼
 Procurement  Processing  Logistics
     │          │           │
     └──────────┼───────────┘
                ▼
             Inventory
                │
                ▼
             B2B Sales
                │
                ▼
             Customers

       B2C Catalogue
              │
       Future E-commerce
```

The most important architectural concept is that **operations, inventory, sales, workforce and finance are interconnected but have clear ownership boundaries**.

This allows TOM to start with a manageable system while keeping the foundation strong enough for future online B2C sales, scanning, advanced analytics, accounting, and automation.

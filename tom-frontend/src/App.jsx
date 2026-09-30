import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { OperationalDataProvider } from './context/OperationalDataContext'
import { ProtectedRoute } from './components/ui/ProtectedRoute'
import AppLayout from './components/layout/AppLayout'

// Pages
import LoginPage from './pages/auth/LoginPage'
import Dashboard from './pages/admin/Dashboard'
import ProcurementPage from './pages/procurement/ProcurementPage'
import QualityPage from './pages/quality/QualityPage'
import ProcessingPage from './pages/processing/ProcessingPage'
import InventoryPage from './pages/inventory/InventoryPage'
import LogisticsPage from './pages/logistics/LogisticsPage'
import SalesPage from './pages/sales/SalesPage'
import FinancePage from './pages/finance/FinancePage'
import WorkforcePage from './pages/workforce/WorkforcePage'
import PayrollPage from './pages/payroll/PayrollPage'
import ReportsPage from './pages/reports/ReportsPage'
import AuditPage from './pages/audit/AuditPage'
import SettingsPage from './pages/settings/SettingsPage'
import B2CCataloguePage from './pages/catalogue/B2CCataloguePage'
import DocumentsPage from './pages/documents/DocumentsPage'
import React, { Component } from 'react'
import FloorOperationsPage from './pages/floor/FloorOperationsPage'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-xl font-bold text-zinc-950 shadow-sm">
            !
          </div>
          <div>
            <h2 className="text-xl font-bold text-zinc-950 font-sans tracking-tight">Console Sync Required</h2>
            <p className="text-sm text-zinc-600 max-w-md mx-auto mt-1">
              Click below to reload and continue your work.
            </p>
          </div>
          <button
            onClick={() => {
              this.setState({ hasError: false })
              window.location.reload()
            }}
            className="btn-primary text-xs px-4 py-2"
          >
            Reload Console
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

function LayoutRoute({ children, allowedRoles, permission }) {
  return (
    <ProtectedRoute allowedRoles={allowedRoles} requiredPermission={permission}>
      <AppLayout>{children}</AppLayout>
    </ProtectedRoute>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <OperationalDataProvider>
        <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#27272a',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            },
          }}
        />
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          {/* Role-Aware Dashboard — Tailored for Admin, Office, Field Officer, Senior Worker, Sales */}
          <Route
            path="/admin/dashboard"
            element={
              <LayoutRoute allowedRoles={['ADMIN', 'OFFICE_EMPLOYEE', 'FIELD_OFFICER', 'SENIOR_WORKER', 'WORKER', 'SALES']}>
                <Dashboard />
              </LayoutRoute>
            }
          />

          {/* Operations: Procurement — Admin, Office, Field Officer */}
          <Route
            path="/procurement"
            element={
              <LayoutRoute allowedRoles={['ADMIN', 'OFFICE_EMPLOYEE', 'FIELD_OFFICER']}>
                <ProcurementPage />
              </LayoutRoute>
            }
          />

          {/* Operations: Quality Lab — Admin, Field Officer, Plant Supervisor */}
          <Route
            path="/quality"
            element={
              <LayoutRoute allowedRoles={['ADMIN', 'FIELD_OFFICER', 'SENIOR_WORKER']}>
                <QualityPage />
              </LayoutRoute>
            }
          />

          {/* Operations: Processing & Expellers — Admin, Senior Worker, Worker */}
          <Route
            path="/processing"
            element={
              <LayoutRoute allowedRoles={['ADMIN', 'SENIOR_WORKER', 'WORKER']}>
                <ProcessingPage />
              </LayoutRoute>
            }
          />

          {/* Operations: Senior Worker Floor Tasks & Cockpit — Admin, Senior Worker, Worker, Office */}
          <Route
            path="/floor-operations"
            element={
              <LayoutRoute allowedRoles={['ADMIN', 'SENIOR_WORKER', 'WORKER', 'OFFICE_EMPLOYEE']}>
                <FloorOperationsPage />
              </LayoutRoute>
            }
          />

          {/* Operations: Inventory & Godowns — Admin, Office, Field Officer, Supervisor, Sales */}
          <Route
            path="/inventory"
            element={
              <LayoutRoute allowedRoles={['ADMIN', 'OFFICE_EMPLOYEE', 'FIELD_OFFICER', 'SENIOR_WORKER', 'SALES']}>
                <InventoryPage />
              </LayoutRoute>
            }
          />

          {/* Operations: Logistics & Weighbridge — Admin, Office, Field Officer, Supervisor */}
          <Route
            path="/logistics"
            element={
              <LayoutRoute allowedRoles={['ADMIN', 'OFFICE_EMPLOYEE', 'FIELD_OFFICER', 'SENIOR_WORKER']}>
                <LogisticsPage />
              </LayoutRoute>
            }
          />

          {/* Sales & Finance: B2B Sales — Admin, Office, Sales Executive */}
          <Route
            path="/sales"
            element={
              <LayoutRoute allowedRoles={['ADMIN', 'OFFICE_EMPLOYEE', 'SALES']}>
                <SalesPage />
              </LayoutRoute>
            }
          />

          {/* B2C Product Showcase / Catalogue — All Mill Staff & Sales */}
          <Route
            path="/catalogue"
            element={
              <LayoutRoute allowedRoles={['ADMIN', 'OFFICE_EMPLOYEE', 'SALES', 'FIELD_OFFICER', 'SENIOR_WORKER', 'WORKER']}>
                <B2CCataloguePage />
              </LayoutRoute>
            }
          />

          {/* Sales & Finance: Finance & Bank Accounts — Strictly Admin & Office Accountant */}
          <Route
            path="/finance"
            element={
              <LayoutRoute allowedRoles={['ADMIN', 'OFFICE_EMPLOYEE']}>
                <FinancePage />
              </LayoutRoute>
            }
          />

          {/* People: Workforce Management — Admin & Office */}
          <Route
            path="/workforce"
            element={
              <LayoutRoute allowedRoles={['ADMIN', 'OFFICE_EMPLOYEE']}>
                <WorkforcePage />
              </LayoutRoute>
            }
          />

          {/* People: Payroll & Salary Disbursement — Confidential: Strictly Admin */}
          <Route
            path="/payroll"
            element={
              <LayoutRoute allowedRoles={['ADMIN']}>
                <PayrollPage />
              </LayoutRoute>
            }
          />

          {/* System: BI Reports & P&L — Admin & Office */}
          <Route
            path="/reports"
            element={
              <LayoutRoute allowedRoles={['ADMIN', 'OFFICE_EMPLOYEE']}>
                <ReportsPage />
              </LayoutRoute>
            }
          />

          {/* System: Tamper-Evident Audit Trail — Strictly Admin */}
          <Route
            path="/audit"
            element={
              <LayoutRoute allowedRoles={['ADMIN']}>
                <AuditPage />
              </LayoutRoute>
            }
          />

          {/* System: Central Document Repository — Section 15 */}
          <Route
            path="/documents"
            element={
              <LayoutRoute allowedRoles={['ADMIN', 'OFFICE_EMPLOYEE', 'FIELD_OFFICER', 'SALES']}>
                <DocumentsPage />
              </LayoutRoute>
            }
          />

          {/* System: Enterprise Settings & Hardware Sensors — Strictly Admin */}
          <Route
            path="/settings"
            element={
              <LayoutRoute allowedRoles={['ADMIN']}>
                <SettingsPage />
              </LayoutRoute>
            }
          />

          <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </OperationalDataProvider>
  </AuthProvider>
</ErrorBoundary>
)
}

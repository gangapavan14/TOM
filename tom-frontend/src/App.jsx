import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
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

function LayoutRoute({ children, permission }) {
  return (
    <ProtectedRoute requiredPermission={permission}>
      <AppLayout>{children}</AppLayout>
    </ProtectedRoute>
  )
}

export default function App() {
  return (
    <AuthProvider>
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

          <Route
            path="/admin/dashboard"
            element={
              <LayoutRoute>
                <Dashboard />
              </LayoutRoute>
            }
          />

          <Route
            path="/procurement"
            element={
              <LayoutRoute>
                <ProcurementPage />
              </LayoutRoute>
            }
          />

          <Route
            path="/quality"
            element={
              <LayoutRoute>
                <QualityPage />
              </LayoutRoute>
            }
          />

          <Route
            path="/processing"
            element={
              <LayoutRoute>
                <ProcessingPage />
              </LayoutRoute>
            }
          />

          <Route
            path="/inventory"
            element={
              <LayoutRoute>
                <InventoryPage />
              </LayoutRoute>
            }
          />

          <Route
            path="/logistics"
            element={
              <LayoutRoute>
                <LogisticsPage />
              </LayoutRoute>
            }
          />

          <Route
            path="/sales"
            element={
              <LayoutRoute>
                <SalesPage />
              </LayoutRoute>
            }
          />

          <Route
            path="/finance"
            element={
              <LayoutRoute>
                <FinancePage />
              </LayoutRoute>
            }
          />

          <Route
            path="/workforce"
            element={
              <LayoutRoute>
                <WorkforcePage />
              </LayoutRoute>
            }
          />

          <Route
            path="/payroll"
            element={
              <LayoutRoute>
                <PayrollPage />
              </LayoutRoute>
            }
          />

          <Route
            path="/reports"
            element={
              <LayoutRoute>
                <ReportsPage />
              </LayoutRoute>
            }
          />

          <Route
            path="/audit"
            element={
              <LayoutRoute>
                <AuditPage />
              </LayoutRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <LayoutRoute>
                <SettingsPage />
              </LayoutRoute>
            }
          />

          <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authApi } from '../api/endpoints'

const AuthContext = createContext(null)

export const ROLE_PRESETS = {
  ADMIN: {
    id: 1,
    username: 'admin',
    fullName: 'System Administrator (Owner)',
    role: 'ADMIN',
    permissions: [
      'ALL', 'AUTH_MANAGE_USERS', 'AUTH_MANAGE_ROLES', 'AUTH_VIEW_AUDIT',
      'WORKFORCE_VIEW', 'WORKFORCE_MANAGE', 'WORKFORCE_MANAGE_PAYROLL',
      'PROCUREMENT_VIEW', 'PROCUREMENT_CREATE_REQ', 'INVENTORY_VIEW',
      'INVENTORY_MANAGE', 'SALES_VIEW', 'SALES_CREATE_ORDER', 'FINANCE_VIEW',
      'FINANCE_MANAGE', 'REPORTS_VIEW_ALL'
    ]
  },
  SALES: {
    id: 2,
    username: 'suresh.sales',
    fullName: 'Suresh Kumar (Sales)',
    role: 'SALES',
    permissions: [
      'SALES_VIEW', 'SALES_MANAGE_ENQUIRY', 'SALES_CREATE_ORDER',
      'SALES_COLLECT_PAYMENT', 'INVENTORY_VIEW'
    ]
  },
  FIELD_OFFICER: {
    id: 3,
    username: 'ramesh.field',
    fullName: 'K. Ramesh (Field Officer)',
    role: 'FIELD_OFFICER',
    permissions: [
      'PROCUREMENT_VIEW', 'PROCUREMENT_NEGOTIATE', 'PROCUREMENT_INSPECT',
      'PROCUREMENT_ACCEPT_REJECT', 'INVENTORY_VIEW', 'INVENTORY_VERIFY_LOADING',
      'WORKFORCE_VIEW'
    ]
  },
  SENIOR_WORKER: {
    id: 4,
    username: 'venkat.rao',
    fullName: 'N. Venkata Rao (Plant Supervisor)',
    role: 'SENIOR_WORKER',
    permissions: [
      'INVENTORY_VIEW', 'WORKFORCE_VIEW', 'WORKFORCE_COMPLETE_TASKS', 'PROCUREMENT_VIEW'
    ]
  },
  OFFICE_EMPLOYEE: {
    id: 5,
    username: 'lakshmi.office',
    fullName: 'K. Lakshmi (Office Coordinator)',
    role: 'OFFICE_EMPLOYEE',
    permissions: [
      'WORKFORCE_VIEW', 'WORKFORCE_MANAGE', 'WORKFORCE_ASSIGN_TASKS',
      'PROCUREMENT_VIEW', 'INVENTORY_VIEW', 'SALES_VIEW',
      'SALES_MANAGE_ENQUIRY', 'REPORTS_VIEW_OPERATIONAL'
    ]
  }
}

const ROLE_DASH = {
  ADMIN:           '/admin/dashboard',
  OFFICE_EMPLOYEE: '/admin/dashboard',
  FIELD_OFFICER:   '/procurement',
  SENIOR_WORKER:   '/processing',
  WORKER:          '/processing',
  TEMP_WORKER:     '/workforce',
  SALES:           '/sales',
}

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  // Restore session on mount
  useEffect(() => {
    // Check URL params for direct SSO/handoff
    const params = new URLSearchParams(window.location.search)
    const urlToken = params.get('token')
    const urlUser = params.get('user')
    if (urlToken && urlUser) {
      try {
        const parsed = JSON.parse(decodeURIComponent(urlUser))
        localStorage.setItem('tom_token', urlToken)
        localStorage.setItem('tom_user', JSON.stringify(parsed))
        setUser(parsed)
        setLoading(false)
        return
      } catch (e) {}
    }

    const stored = localStorage.getItem('tom_user')
    const token  = localStorage.getItem('tom_token') || localStorage.getItem('tom_access_token')
    if (stored && token) {
      try {
        setUser(JSON.parse(stored))
      } catch (e) {
        setUser(null)
      }
    } else {
      // Auto-initialize as standard ADMIN if no previous session
      const defaultAdmin = ROLE_PRESETS.ADMIN
      localStorage.setItem('tom_token', 'dev-session-token')
      localStorage.setItem('tom_user', JSON.stringify(defaultAdmin))
      setUser(defaultAdmin)
    }
    setLoading(false)
  }, [])

  const login = useCallback(async (username, password) => {
    const { data } = await authApi.login(username, password)
    if (!data.success) throw new Error(data.message || 'Login failed')
    const u = data.data
    localStorage.setItem('tom_token',   u.accessToken)
    localStorage.setItem('tom_refresh', u.refreshToken)
    const userData = {
      id: u.userId, username: u.username, fullName: u.fullName,
      role: u.role, permissions: u.permissions || [],
    }
    localStorage.setItem('tom_user', JSON.stringify(userData))
    setUser(userData)
    return ROLE_DASH[u.role] || '/admin/dashboard'
  }, [])

  const switchRole = useCallback((roleName) => {
    const preset = ROLE_PRESETS[roleName] || ROLE_PRESETS.ADMIN
    localStorage.setItem('tom_user', JSON.stringify(preset))
    localStorage.setItem('tom_token', `token-${roleName.toLowerCase()}`)
    setUser(preset)
    return ROLE_DASH[roleName] || '/admin/dashboard'
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('tom_token')
    localStorage.removeItem('tom_refresh')
    localStorage.removeItem('tom_user')
    localStorage.removeItem('tom_access_token')
    setUser(null)
  }, [])

  const can = useCallback((permission) => {
    if (user?.role === 'ADMIN' || user?.permissions?.includes('ALL')) return true
    return user?.permissions?.includes(permission) ?? false
  }, [user])

  const isRole = useCallback((role) => user?.role === role, [user])

  return (
    <AuthContext.Provider value={{ user, loading, login, switchRole, logout, can, isRole }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

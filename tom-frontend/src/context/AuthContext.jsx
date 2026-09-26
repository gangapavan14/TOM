import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authApi } from '../api/endpoints'

const AuthContext = createContext(null)

const ROLE_DASH = {
  ADMIN:           '/admin/dashboard',
  OFFICE_EMPLOYEE: '/office/dashboard',
  FIELD_OFFICER:   '/field/dashboard',
  SENIOR_WORKER:   '/worker/dashboard',
  WORKER:          '/worker/dashboard',
  TEMP_WORKER:     '/worker/dashboard',
  SALES:           '/sales/dashboard',
}

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  // Restore session on mount
  useEffect(() => {
    const stored = localStorage.getItem('tom_user')
    const token  = localStorage.getItem('tom_token')
    if (stored && token) {
      setUser(JSON.parse(stored))
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

  const logout = useCallback(() => {
    localStorage.clear()
    setUser(null)
  }, [])

  const can = useCallback((permission) => {
    return user?.permissions?.includes(permission) ?? false
  }, [user])

  const isRole = useCallback((role) => user?.role === role, [user])

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, can, isRole }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Avatar } from '../ui'
import {
  LayoutDashboard, Package, CheckSquare, Settings2, Truck, ShoppingCart,
  CreditCard, Users, FileText, BarChart3, ClipboardList, LogOut,
  Bell, Menu, X, ChevronRight, Shield, ShieldCheck, UserCheck, AlertCircle
} from 'lucide-react'
import toast from 'react-hot-toast'

const navSections = [
  {
    label: 'Overview',
    items: [
      { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard', allowedRoles: ['ADMIN', 'OFFICE_EMPLOYEE'] },
    ],
  },
  {
    label: 'Operations',
    items: [
      { to: '/procurement',  icon: Package,       label: 'Procurement', allowedRoles: ['ADMIN', 'OFFICE_EMPLOYEE', 'FIELD_OFFICER'] },
      { to: '/quality',      icon: CheckSquare,   label: 'Quality',     allowedRoles: ['ADMIN', 'FIELD_OFFICER', 'SENIOR_WORKER'] },
      { to: '/processing',   icon: Settings2,     label: 'Processing',  allowedRoles: ['ADMIN', 'SENIOR_WORKER', 'WORKER'] },
      { to: '/inventory',    icon: ClipboardList, label: 'Inventory',   allowedRoles: ['ADMIN', 'OFFICE_EMPLOYEE', 'FIELD_OFFICER', 'SENIOR_WORKER', 'SALES'] },
      { to: '/logistics',    icon: Truck,         label: 'Logistics',   allowedRoles: ['ADMIN', 'OFFICE_EMPLOYEE', 'FIELD_OFFICER', 'SENIOR_WORKER'] },
    ],
  },
  {
    label: 'Sales & Finance',
    items: [
      { to: '/sales',    icon: ShoppingCart, label: 'B2B Sales', allowedRoles: ['ADMIN', 'OFFICE_EMPLOYEE', 'SALES'] },
      { to: '/finance',  icon: CreditCard,   label: 'Finance',   allowedRoles: ['ADMIN', 'OFFICE_EMPLOYEE'] },
    ],
  },
  {
    label: 'People',
    items: [
      { to: '/workforce', icon: Users,     label: 'Workforce', allowedRoles: ['ADMIN', 'OFFICE_EMPLOYEE'] },
      { to: '/payroll',   icon: FileText,  label: 'Payroll',   allowedRoles: ['ADMIN'] },
    ],
  },
  {
    label: 'System & Governance',
    items: [
      { to: '/reports',  icon: BarChart3, label: 'Reports',   allowedRoles: ['ADMIN', 'OFFICE_EMPLOYEE'] },
      { to: '/audit',    icon: Shield,    label: 'Audit Log', allowedRoles: ['ADMIN'] },
      { to: '/settings', icon: Settings2, label: 'Settings',  allowedRoles: ['ADMIN'] },
    ],
  },
]

const AVAILABLE_ROLES = [
  { role: 'ADMIN', label: '👑 Admin (Owner)', desc: 'Unrestricted full access across all 14 modules' },
  { role: 'SALES', label: '💼 Sales Executive', desc: 'Can only view/create sales orders & stock' },
  { role: 'FIELD_OFFICER', label: '🌾 Field Officer', desc: 'Can only view/manage procurement & quality' },
  { role: 'SENIOR_WORKER', label: '⚙️ Plant Supervisor', desc: 'Can only control expellers, runs & inventory' },
  { role: 'OFFICE_EMPLOYEE', label: '🏢 Office Accountant', desc: 'Manages operations, sales & finance' },
]

export default function AppLayout({ children }) {
  const { user, logout, switchRole } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [roleModalOpen, setRoleModalOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleRoleSwitch = (targetRole) => {
    const nextRoute = switchRole(targetRole)
    setRoleModalOpen(false)
    toast.success(`Active persona switched to ${targetRole.replace('_', ' ')}`)
    navigate(nextRoute)
  }

  // Filter sections by current user's role
  const filteredNavSections = navSections
    .map(section => ({
      ...section,
      items: section.items.filter(item => {
        if (!item.allowedRoles) return true
        return item.allowedRoles.includes(user?.role)
      })
    }))
    .filter(section => section.items.length > 0)

  return (
    <div className="flex min-h-screen bg-surface-0">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden"
             onClick={() => setSidebarOpen(false)} />
      )}

      {/* ===== SIDEBAR ===== */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-surface-1 border-r border-white/[0.07]
        flex flex-col z-50 transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
      `}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/[0.07]">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-800 flex items-center justify-center text-lg shadow-brand flex-shrink-0">
            🌿
          </div>
          <div className="leading-tight flex-1 min-w-0">
            <p className="font-display font-bold text-white text-sm">TOM System</p>
            <p className="text-zinc-500 text-xs truncate">Tirumala Oil Mill</p>
          </div>
          <button className="ml-auto lg:hidden text-zinc-400 hover:text-white"
                  onClick={() => setSidebarOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Role Badge & Quick Switch */}
        <div className="px-4 py-3 bg-surface-2/60 border-b border-white/[0.05] flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <ShieldCheck size={14} className="text-amber-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Active Role</p>
              <p className="text-xs font-bold text-white truncate">{user?.role?.replace('_', ' ')}</p>
            </div>
          </div>
          <button
            onClick={() => setRoleModalOpen(true)}
            className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 transition-colors"
            title="Switch role to test security permissions"
          >
            Switch
          </button>
        </div>

        {/* Nav with strict RBAC filtering */}
        <nav className="flex-1 overflow-y-auto py-3">
          {filteredNavSections.map(section => (
            <div key={section.label} className="mb-2">
              <p className="px-5 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
                {section.label}
              </p>
              {section.items.map(({ to, icon: Icon, label, badge }) => (
                <NavLink key={to} to={to}
                  className={({ isActive }) =>
                    `nav-item ${isActive ? 'active' : ''}`
                  }
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon size={16} className="flex-shrink-0 opacity-70" />
                  <span className="flex-1">{label}</span>
                  {badge != null && (
                    <span className="ml-auto bg-brand-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="p-4 border-t border-white/[0.07]">
          <div className="flex items-center gap-3 mb-3">
            <Avatar name={user?.fullName ?? 'User'} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.fullName}</p>
              <p className="text-xs text-zinc-500 truncate">@{user?.username}</p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium
                       text-zinc-400 border border-white/10 hover:bg-red-500/10 hover:text-red-400
                       hover:border-red-500/30 transition-all">
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ===== MAIN ===== */}
      <div className="flex-1 flex flex-col lg:ml-64 min-h-screen">

        {/* Topbar */}
        <header className="sticky top-0 z-30 h-16 bg-surface-1/90 backdrop-blur border-b border-white/[0.07] flex items-center px-6 gap-4">
          <button className="lg:hidden text-zinc-400 hover:text-white transition-colors"
                  onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <span className="hidden sm:inline">Permission Level:</span>
            <span className="font-mono text-amber-400 font-bold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
              {user?.role?.replace('_', ' ')}
            </span>
          </div>

          <div className="flex-1" />

          <div className="flex items-center gap-3">
            {/* Quick role test dropdown */}
            <button
              onClick={() => setRoleModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-2 border border-white/10 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-surface-3 transition-colors"
            >
              <UserCheck size={14} className="text-amber-400" />
              <span>Test Role</span>
            </button>

            <button className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-surface-2 border border-white/10 text-zinc-400 hover:text-white transition-colors">
              <Bell size={16} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">3</span>
            </button>

            <div
              onClick={() => setRoleModalOpen(true)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-surface-2 border border-white/10 cursor-pointer hover:bg-surface-3 transition-colors"
            >
              <Avatar name={user?.fullName ?? 'U'} size="sm" />
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-white leading-none">{user?.fullName}</p>
                <p className="text-[11px] text-zinc-500 mt-0.5">{user?.role?.replace('_', ' ')}</p>
              </div>
              <ChevronRight size={14} className="text-zinc-500" />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* ===== ROLE TESTING MODAL ===== */}
      {roleModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setRoleModalOpen(false)}>
          <div className="bg-surface-1 border border-white/10 rounded-2xl w-full max-w-lg p-6 space-y-5" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-display font-bold text-white text-lg">Role-Based Security Demo</h3>
                <p className="text-zinc-400 text-xs mt-1">Switch persona to inspect which menus, sensitive data, and controls are restricted.</p>
              </div>
              <button onClick={() => setRoleModalOpen(false)} className="text-zinc-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-2.5">
              {AVAILABLE_ROLES.map(({ role, label, desc }) => {
                const isActive = user?.role === role
                return (
                  <button
                    key={role}
                    onClick={() => handleRoleSwitch(role)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start justify-between ${
                      isActive
                        ? 'bg-amber-500/10 border-amber-500/40 text-white shadow-sm'
                        : 'bg-surface-2 border-white/5 text-zinc-300 hover:bg-surface-3 hover:border-white/10'
                    }`}
                  >
                    <div>
                      <p className={`font-semibold text-sm ${isActive ? 'text-amber-400 font-bold' : 'text-white'}`}>{label}</p>
                      <p className="text-xs text-zinc-400 mt-0.5">{desc}</p>
                    </div>
                    {isActive && (
                      <span className="text-xs font-bold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            <div className="p-3 bg-surface-2 rounded-xl text-xs text-zinc-500 flex items-center gap-2">
              <AlertCircle size={14} className="text-amber-400 flex-shrink-0" />
              <span>Restricted modules are stripped from the sidebar and protected by 403 route firewalls.</span>
            </div>

            <div className="flex justify-end pt-2">
              <button onClick={() => setRoleModalOpen(false)} className="btn-secondary text-xs">Close</button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

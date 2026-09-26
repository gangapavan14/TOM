import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Avatar } from '../ui'
import {
  LayoutDashboard, Package, CheckSquare, Settings2, Truck, ShoppingCart, ShoppingBag,
  CreditCard, Users, FileText, BarChart3, ClipboardList, LogOut,
  Bell, Menu, X, ChevronRight, Shield, ShieldCheck, UserCheck, AlertCircle
} from 'lucide-react'
import toast from 'react-hot-toast'

const navSections = [
  {
    label: 'Overview',
    items: [
      { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
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
    label: 'Sales & Commerce',
    items: [
      { to: '/sales',     icon: ShoppingCart, label: 'B2B Sales',     allowedRoles: ['ADMIN', 'OFFICE_EMPLOYEE', 'SALES'] },
      { to: '/catalogue', icon: ShoppingBag,  label: 'B2C Showcase',  allowedRoles: ['ADMIN', 'OFFICE_EMPLOYEE', 'SALES', 'FIELD_OFFICER', 'SENIOR_WORKER'] },
      { to: '/finance',   icon: CreditCard,   label: 'Finance',       allowedRoles: ['ADMIN', 'OFFICE_EMPLOYEE'] },
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
      { to: '/documents', icon: FileText,  label: 'Documents', allowedRoles: ['ADMIN', 'OFFICE_EMPLOYEE', 'FIELD_OFFICER', 'SALES'] },
      { to: '/reports',   icon: BarChart3, label: 'Reports',   allowedRoles: ['ADMIN', 'OFFICE_EMPLOYEE'] },
      { to: '/audit',     icon: Shield,    label: 'Audit Log', allowedRoles: ['ADMIN'] },
      { to: '/settings',  icon: Settings2, label: 'Settings',  allowedRoles: ['ADMIN'] },
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
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Procurement Reservation Expiring', desc: '1,000 kg Maize reservation for Sri Rama Agros expires in 42 minutes (12-hr rule).', time: '10m ago', unread: true, type: 'warning' },
    { id: 2, title: 'Pending Customer Pickup Verification', desc: 'Heritage Foods truck AP 21 TY 4521 loading complete. Field Officer signoff required.', time: '25m ago', unread: true, type: 'info' },
    { id: 3, title: 'Sales Cash Handover Waiting', desc: 'Suresh Kumar collected ₹45,000 cash from Tirupati Refineries. Admin count verification needed.', time: '1h ago', unread: true, type: 'warning' },
    { id: 4, title: 'Supplier Payment Due (Prompt Discount)', desc: 'Sri Rama Agros ₹1,80,000 eligible for 2% prompt payment discount if settled today.', time: '2h ago', unread: false, type: 'brand' },
  ])
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
    <div className="flex min-h-screen bg-[#fbfbfb]">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden"
             onClick={() => setSidebarOpen(false)} />
      )}

      {/* ===== SIDEBAR ===== */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-[#fafafa] border-r border-zinc-200
        flex flex-col z-50 transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
      `}>
        {/* Logo — Console Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-200">
          <div className="w-8 h-8 rounded-lg bg-zinc-950 p-1 flex items-center justify-center shadow-sm flex-shrink-0">
            <img src="/tom_logo.png" alt="TOM Logo" className="w-full h-full object-contain filter invert" />
          </div>
          <div className="leading-tight flex-1 min-w-0">
            <p className="font-sans font-bold text-zinc-950 text-sm tracking-tight">TOM</p>
            <p className="text-zinc-500 text-xs">Console</p>
          </div>
          <button className="ml-auto lg:hidden text-zinc-400 hover:text-zinc-950"
                  onClick={() => setSidebarOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Role Badge & Quick Switch */}
        <div className="mx-3 mt-3 px-3 py-2 bg-white border border-zinc-200 rounded-lg flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2 min-w-0">
            <ShieldCheck size={14} className="text-zinc-600 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">Active Role</p>
              <p className="text-xs font-bold text-zinc-900 truncate">{user?.role?.replace('_', ' ')}</p>
            </div>
          </div>
          <button
            onClick={() => setRoleModalOpen(true)}
            className="text-[11px] font-medium text-zinc-700 hover:text-zinc-950 px-2 py-0.5 rounded border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 transition-colors"
            title="Switch role to test security permissions"
          >
            Switch
          </button>
        </div>

        {/* Nav with strict RBAC filtering */}
        <nav className="flex-1 overflow-y-auto px-3 py-3">
          {filteredNavSections.map(section => (
            <div key={section.label} className="mb-3">
              <p className="px-2 py-1 text-[11px] font-semibold text-zinc-400">
                {section.label}
              </p>
              <div className="space-y-0.5">
                {section.items.map(({ to, icon: Icon, label, badge }) => (
                  <NavLink key={to} to={to}
                    className={({ isActive }) =>
                      `nav-item ${isActive ? 'active' : ''}`
                    }
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon size={16} className="flex-shrink-0 opacity-70" />
                    <span className="flex-1 truncate">{label}</span>
                    {badge != null && (
                      <span className="ml-auto bg-zinc-900 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
                        {badge}
                      </span>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* User Account Footer (matching screenshot BS user pill) */}
        <div className="p-3 border-t border-zinc-200 bg-[#fafafa]">
          <div
            onClick={() => setRoleModalOpen(true)}
            className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-zinc-200/60 transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-zinc-200 border border-zinc-300 text-zinc-800 font-semibold text-xs flex items-center justify-center flex-shrink-0">
              {user?.fullName?.split(' ').map(n=>n[0]).join('').slice(0, 2) || 'AD'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-zinc-900 truncate leading-tight">{user?.fullName}</p>
              <p className="text-[11px] text-zinc-500 truncate">{user?.username ? `${user.username}@tirumalaoil.com` : 'admin@tirumalaoil.com'}</p>
            </div>
            <ChevronRight size={14} className="text-zinc-400 flex-shrink-0" />
          </div>
          <button onClick={handleLogout}
            className="w-full mt-2 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                       text-zinc-600 border border-zinc-200 bg-white hover:bg-red-50 hover:text-red-600
                       hover:border-red-200 transition-all shadow-sm">
            <LogOut size={13} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ===== MAIN ===== */}
      <div className="flex-1 flex flex-col lg:ml-64 min-h-screen">

        {/* Topbar */}
        <header className="sticky top-0 z-30 h-14 bg-white/90 backdrop-blur border-b border-zinc-200 flex items-center px-6 gap-4">
          <button className="lg:hidden text-zinc-500 hover:text-zinc-950 transition-colors"
                  onClick={() => setSidebarOpen(true)}>
            <Menu size={18} />
          </button>

          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <span className="hidden sm:inline">Permission:</span>
            <span className="font-mono text-zinc-900 font-medium px-2 py-0.5 rounded bg-zinc-100 border border-zinc-200">
              {user?.role?.replace('_', ' ')}
            </span>
          </div>

          <div className="flex-1" />

          <div className="flex items-center gap-3">
            {/* Quick role test dropdown */}
            <button
              onClick={() => setRoleModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-zinc-200 text-xs font-medium text-zinc-700 hover:text-zinc-950 hover:bg-zinc-50 shadow-sm transition-colors"
            >
              <UserCheck size={14} className="text-zinc-500" />
              <span>Test Role</span>
            </button>

            {/* Notification Bell & Dropdown (Section 16) */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-zinc-200 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50 shadow-sm transition-colors"
                title="Operational Notifications (Section 16)"
              >
                <Bell size={15} />
                {notifications.filter(n => n.unread).length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center shadow">
                    {notifications.filter(n => n.unread).length}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-white border border-zinc-200 shadow-xl z-50 overflow-hidden animate-fade-in">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 bg-zinc-50">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-zinc-950 uppercase tracking-wider">Operational Alerts</p>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-200 text-zinc-800 font-medium">Section 16</span>
                    </div>
                    <button
                      onClick={() => {
                        setNotifications(notifications.map(n => ({ ...n, unread: false })))
                        toast.success('All alerts marked as read')
                      }}
                      className="text-[11px] text-zinc-500 hover:text-zinc-900 transition-colors"
                    >
                      Mark all read
                    </button>
                  </div>

                  <div className="divide-y divide-zinc-100 max-h-80 overflow-y-auto">
                    {notifications.map(n => (
                      <div
                        key={n.id}
                        className={`p-3.5 hover:bg-zinc-50 transition-colors cursor-pointer ${n.unread ? 'bg-zinc-50/60' : ''}`}
                        onClick={() => {
                          setNotifications(notifications.map(item => item.id === n.id ? { ...item, unread: false } : item))
                          setNotificationsOpen(false)
                        }}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-xs font-semibold ${n.unread ? 'text-zinc-950' : 'text-zinc-700'}`}>
                            {n.title}
                          </p>
                          <span className="text-[10px] text-zinc-400 whitespace-nowrap">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-zinc-500 mt-1 leading-snug">{n.desc}</p>
                      </div>
                    ))}
                  </div>

                  <div className="p-2.5 bg-zinc-50 border-t border-zinc-200 text-center">
                    <p className="text-[10px] text-zinc-500">Automated event listeners for 12h expiry & delivery deadlines</p>
                  </div>
                </div>
              )}
            </div>

            <div
              onClick={() => setRoleModalOpen(true)}
              className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white border border-zinc-200 cursor-pointer hover:bg-zinc-50 shadow-sm transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-700 font-semibold text-xs flex items-center justify-center">
                {user?.fullName?.split(' ').map(n=>n[0]).join('').slice(0, 2) || 'AD'}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-zinc-900 leading-tight">{user?.fullName}</p>
                <p className="text-[10px] text-zinc-500">{user?.role?.replace('_', ' ')}</p>
              </div>
              <ChevronRight size={13} className="text-zinc-400" />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 lg:p-8 bg-[#fbfbfb]">
          {children}
        </main>
      </div>

      {/* ===== ROLE TESTING MODAL ===== */}
      {roleModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setRoleModalOpen(false)}>
          <div className="bg-white border border-zinc-200 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-sans font-bold text-zinc-950 text-lg tracking-tight">Role-Based Security Demo</h3>
                <p className="text-zinc-500 text-xs mt-1">Switch persona to inspect which menus, sensitive data, and controls are restricted.</p>
              </div>
              <button onClick={() => setRoleModalOpen(false)} className="text-zinc-400 hover:text-zinc-950">✕</button>
            </div>

            <div className="space-y-2">
              {AVAILABLE_ROLES.map(({ role, label, desc }) => {
                const isActive = user?.role === role
                return (
                  <button
                    key={role}
                    onClick={() => handleRoleSwitch(role)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-start justify-between ${
                      isActive
                        ? 'bg-zinc-100 border-zinc-300 text-zinc-950 shadow-sm'
                        : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300'
                    }`}
                  >
                    <div>
                      <p className={`font-semibold text-sm ${isActive ? 'text-zinc-950 font-bold' : 'text-zinc-800'}`}>{label}</p>
                      <p className="text-xs text-zinc-500 mt-0.5">{desc}</p>
                    </div>
                    {isActive && (
                      <span className="text-xs font-semibold text-white bg-zinc-900 px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-600 flex items-center gap-2">
              <AlertCircle size={14} className="text-zinc-500 flex-shrink-0" />
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

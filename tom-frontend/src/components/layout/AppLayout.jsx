import { useState, useMemo } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useOperationalData } from '../../context/OperationalDataContext'
import { Avatar } from '../ui'
import {
  LayoutDashboard, Package, CheckSquare, Settings2, Truck, ShoppingCart, ShoppingBag,
  CreditCard, Users, FileText, BarChart3, ClipboardList, LogOut,
  Bell, Menu, X, ChevronRight, Shield, ShieldCheck, UserCheck, AlertCircle, HardHat
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
      { to: '/floor-operations', icon: HardHat,       label: 'Floor Tasks (Senior Worker)', allowedRoles: ['ADMIN', 'SENIOR_WORKER', 'WORKER', 'OFFICE_EMPLOYEE'] },
      { to: '/procurement',      icon: Package,       label: 'Procurement', allowedRoles: ['ADMIN', 'OFFICE_EMPLOYEE', 'FIELD_OFFICER'] },
      { to: '/quality',          icon: CheckSquare,   label: 'Quality',     allowedRoles: ['ADMIN', 'FIELD_OFFICER', 'SENIOR_WORKER'] },
      { to: '/processing',       icon: Settings2,     label: 'Processing',  allowedRoles: ['ADMIN', 'SENIOR_WORKER', 'WORKER'] },
      { to: '/inventory',        icon: ClipboardList, label: 'Inventory',   allowedRoles: ['ADMIN', 'OFFICE_EMPLOYEE', 'FIELD_OFFICER', 'SENIOR_WORKER', 'SALES'] },
      { to: '/logistics',        icon: Truck,         label: 'Logistics',   allowedRoles: ['ADMIN', 'OFFICE_EMPLOYEE', 'FIELD_OFFICER', 'SENIOR_WORKER'] },
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
  { role: 'ADMIN', label: 'Admin (Executive)', desc: 'Unrestricted full access across all 15 modules' },
  { role: 'SALES', label: 'Sales Executive', desc: 'Can only view/create sales orders & stock' },
  { role: 'FIELD_OFFICER', label: 'Field Officer', desc: 'Can only view/manage procurement & quality' },
  { role: 'SENIOR_WORKER', label: 'Senior Worker (Supervisor)', desc: 'Controls expellers, worker task checklists & physical loading count' },
  { role: 'OFFICE_EMPLOYEE', label: 'Office Accountant', desc: 'Manages operations, sales & finance' },
]

export default function AppLayout({ children }) {
  const { user, logout, switchRole } = useAuth()
  const { loadingDocket, cashHandovers, deals, tempApps } = useOperationalData()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [roleModalOpen, setRoleModalOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [dismissedIds, setDismissedIds] = useState([])

  const notifications = useMemo(() => {
    const list = []
    
    // 1. Rule 6 Loading Signoff
    if (loadingDocket?.status === 'READY_FOR_FO_SIGNOFF') {
      list.push({
        id: 'notif-load-fo',
        title: 'Rule 6: FO Loading Signoff Pending',
        desc: `${loadingDocket.client} (${loadingDocket.vehicle}) loading recorded (${loadingDocket.currentCount} bags). Field Officer signoff required to deduct inventory.`,
        time: 'Active now',
        unread: !dismissedIds.includes('notif-load-fo'),
        type: 'warning',
        link: '/floor-operations'
      })
    }

    // 2. Rule 7 Sales Cash Handover
    const unverifiedHandovers = Array.isArray(cashHandovers) ? cashHandovers.filter(c => !c.verified) : [];
    unverifiedHandovers.forEach(ch => {
      const id = `notif-ch-${ch.id}`;
      list.push({
        id,
        title: 'Rule 7: Cash Handover Needs Admin Verification',
        desc: `${ch.salesPerson} submitted ₹${(ch.amount || 0).toLocaleString('en-IN')} cash from ${ch.customer}. Customer ledger will not adjust until Admin physically verifies.`,
        time: ch.collectedAt || 'Pending',
        unread: !dismissedIds.includes(id),
        type: 'warning',
        link: '/sales'
      });
    });

    // 3. Procurement Rate Escalation
    const escalatedDeals = Array.isArray(deals) ? deals.filter(d => d.escalated) : [];
    escalatedDeals.forEach(deal => {
      const id = `notif-deal-${deal.id || deal.dealCode}`;
      list.push({
        id,
        title: 'Procurement Rate Escalated',
        desc: `Deal #${deal.dealCode || deal.id} (${deal.commodity}) exceeds Field Officer ceiling cap. Admin price exception required.`,
        time: 'Pending approval',
        unread: !dismissedIds.includes(id),
        type: 'danger',
        link: '/procurement'
      });
    });

    // 4. Temp Worker Application
    const pendingTempApps = Array.isArray(tempApps) ? tempApps.filter(t => t.status === 'PENDING') : [];
    pendingTempApps.forEach(app => {
      const id = `notif-tmp-${app.id}`;
      list.push({
        id,
        title: 'Daily Wage Worker Application',
        desc: `${app.name} (${app.role || 'Worker'}) applied for daily wage RFID badge. Admin signoff needed.`,
        time: app.appliedAt || 'Pending',
        unread: !dismissedIds.includes(id),
        type: 'info',
        link: '/workforce'
      });
    });

    // Default system guidance if no pending approvals
    if (list.length === 0) {
      list.push({
        id: 'notif-default-1',
        title: 'All Systems Operational',
        desc: 'All role approvals up to date. Invariant Rules 1-8 active and replicated.',
        time: 'Just now',
        unread: false,
        type: 'success',
        link: '/admin/dashboard'
      })
    }

    return list
  }, [loadingDocket, cashHandovers, deals, tempApps, dismissedIds])
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
              <p className="px-2 py-1.5 text-xs font-bold text-zinc-950 uppercase tracking-wider">
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
                       text-zinc-600 border border-zinc-200 bg-white hover:bg-zinc-950 hover:text-white
                       hover:border-zinc-950 active:scale-[0.98] transition-all shadow-sm cursor-pointer">
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
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-zinc-200 text-xs font-medium text-zinc-700 hover:text-zinc-950 hover:bg-zinc-50 shadow-sm active:scale-[0.98] transition-all cursor-pointer"
            >
              <UserCheck size={14} className="text-zinc-500" />
              <span>Test Role</span>
            </button>

            {/* Notification Bell & Dropdown (Section 16) */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-zinc-200 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50 shadow-sm active:scale-[0.98] transition-all cursor-pointer"
                title="Operational Notifications (Section 16)"
              >
                <Bell size={15} />
                {notifications.filter(n => n.unread).length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-zinc-950 rounded-full text-[10px] font-bold text-white flex items-center justify-center shadow-xs">
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
                        setDismissedIds(notifications.map(n => n.id))
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
                          setDismissedIds(prev => [...prev, n.id])
                          setNotificationsOpen(false)
                          if (n.link) navigate(n.link)
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

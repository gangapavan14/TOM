import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Avatar } from '../ui'
import {
  LayoutDashboard, Package, CheckSquare, Settings2, Truck, ShoppingCart,
  CreditCard, Users, FileText, BarChart3, ClipboardList, LogOut,
  Bell, Menu, X, ChevronRight, Shield
} from 'lucide-react'

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
      { to: '/procurement',  icon: Package,       label: 'Procurement',  badge: null },
      { to: '/quality',      icon: CheckSquare,   label: 'Quality'       },
      { to: '/processing',   icon: Settings2,     label: 'Processing'    },
      { to: '/inventory',    icon: ClipboardList, label: 'Inventory'     },
      { to: '/logistics',    icon: Truck,         label: 'Logistics'     },
    ],
  },
  {
    label: 'Sales & Finance',
    items: [
      { to: '/sales',    icon: ShoppingCart, label: 'B2B Sales'   },
      { to: '/finance',  icon: CreditCard,   label: 'Finance'     },
    ],
  },
  {
    label: 'People',
    items: [
      { to: '/workforce', icon: Users,     label: 'Workforce' },
      { to: '/payroll',   icon: FileText,  label: 'Payroll'   },
    ],
  },
  {
    label: 'System',
    items: [
      { to: '/reports',  icon: BarChart3, label: 'Reports'  },
      { to: '/audit',    icon: Shield,    label: 'Audit Log' },
      { to: '/settings', icon: Settings2, label: 'Settings'  },
    ],
  },
]

export default function AppLayout({ children }) {
  const { user, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

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
          <div className="leading-tight">
            <p className="font-display font-bold text-white text-sm">TOM System</p>
            <p className="text-zinc-500 text-xs">{user?.role?.replace('_', ' ')}</p>
          </div>
          <button className="ml-auto lg:hidden text-zinc-400 hover:text-white"
                  onClick={() => setSidebarOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3">
          {navSections.map(section => (
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
              <p className="text-xs text-zinc-500 truncate">{user?.username}</p>
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

          <div className="flex-1" />

          <div className="flex items-center gap-3">
            <button className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-surface-2 border border-white/10 text-zinc-400 hover:text-white transition-colors">
              <Bell size={16} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">3</span>
            </button>
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-surface-2 border border-white/10 cursor-pointer hover:bg-surface-3 transition-colors">
              <Avatar name={user?.fullName ?? 'U'} size="sm" />
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-white leading-none">{user?.fullName}</p>
                <p className="text-xs text-zinc-500">{user?.role}</p>
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
    </div>
  )
}

// Reusable UI primitives — Monochrome Light Console Theme
import { Inbox, AlertCircle, CheckCircle2 } from 'lucide-react'

export function Badge({ variant = 'muted', children }) {
  const cls = {
    brand:   'badge bg-zinc-950 text-white border-zinc-950 shadow-sm',
    success: 'badge bg-zinc-100 text-zinc-950 border-zinc-300 font-semibold',
    warning: 'badge bg-zinc-50 text-zinc-800 border-zinc-400 border-dashed font-medium',
    danger:  'badge bg-zinc-900 text-white border-zinc-900 font-semibold',
    info:    'badge bg-white text-zinc-900 border-zinc-200 font-medium',
    muted:   'badge bg-zinc-100/70 text-zinc-500 border-zinc-200',
  }
  return <span className={cls[variant] ?? cls.muted}>{children}</span>
}

export function Spinner({ size = 'md' }) {
  const sz = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10' }
  return (
    <div className={`${sz[size]} border-2 border-zinc-200 border-t-zinc-950 rounded-full animate-spin`} />
  )
}

export function EmptyState({ icon, title, subtitle }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
      <div className="w-12 h-12 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-500 mb-1">
        {icon || <Inbox className="w-6 h-6 text-zinc-400" />}
      </div>
      <p className="text-zinc-900 font-semibold text-sm">{title}</p>
      {subtitle && <span className="text-zinc-500 text-xs max-w-sm">{subtitle}</span>}
    </div>
  )
}

export function Card({ children, className = '' }) {
  return (
    <div className={`tom-card transition-all duration-200 hover:border-zinc-300 ${className}`}>
      {children}
    </div>
  )
}

export function CardHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200/80 bg-zinc-50/50 rounded-t-xl gap-3">
      <div className="min-w-0 flex-1">
        <h3 className="font-sans font-bold text-zinc-950 text-base tracking-tight leading-normal truncate">{title}</h3>
        {subtitle && <p className="text-zinc-500 text-xs mt-0.5 leading-relaxed truncate">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0 flex items-center gap-2">{action}</div>}
    </div>
  )
}

export function StatusBadge({ status }) {
  const map = {
    ACTIVE:         { v: 'success', label: 'Active' },
    OPEN:           { v: 'info',    label: 'Open' },
    CONFIRMED:      { v: 'success', label: 'Confirmed' },
    PENDING:        { v: 'warning', label: 'Pending' },
    EXPIRED:        { v: 'danger',  label: 'Expired' },
    REJECTED:       { v: 'danger',  label: 'Rejected' },
    APPROVED:       { v: 'success', label: 'Approved' },
    IN_PROGRESS:    { v: 'info',    label: 'In Progress' },
    COMPLETED:      { v: 'success', label: 'Completed' },
    PAID:           { v: 'success', label: 'Paid' },
    UNPAID:         { v: 'warning', label: 'Unpaid' },
    CLOSED:         { v: 'muted',   label: 'Closed' },
    CREDIT_APPROVED:{ v: 'info',    label: 'Credit' },
  }
  const cfg = map[status] ?? { v: 'muted', label: status ?? '—' }
  return <Badge variant={cfg.v}>{cfg.label}</Badge>
}

export function Avatar({ name = '', size = 'md' }) {
  const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
  const sz = { sm: 'w-7 h-7 text-xs', md: 'w-9 h-9 text-sm', lg: 'w-12 h-12 text-base' }
  return (
    <div className={`${sz[size]} rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center font-semibold text-zinc-900 flex-shrink-0 shadow-sm leading-none select-none`}>
      {initials}
    </div>
  )
}

export function Modal({ open, isOpen, onClose, title, children, footer }) {
  const visible = open ?? isOpen
  if (!visible) return null
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-200" onClick={onClose}>
      <div className="bg-white border border-zinc-200 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl transition-transform duration-200 scale-100"
           onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-zinc-50/50 rounded-t-2xl gap-3">
          <h3 className="font-sans font-bold text-zinc-950 text-base tracking-tight leading-snug truncate">{title}</h3>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-zinc-100 text-zinc-500 hover:bg-zinc-950 hover:text-white transition-colors cursor-pointer leading-none text-xs font-bold flex-shrink-0 select-none"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="p-6 text-zinc-800">{children}</div>
        {footer && <div className="flex justify-end gap-2 px-6 py-4 border-t border-zinc-200 bg-zinc-50/50 rounded-b-2xl">{footer}</div>}
      </div>
    </div>
  )
}

export function FormField({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs font-semibold text-zinc-800">{label}</label>}
      {children}
      {error && <p className="text-xs text-zinc-900 font-semibold">{error}</p>}
    </div>
  )
}

export function StatCard({ icon, label, value, sub }) {
  return (
    <div className="kpi-card group bg-white border border-zinc-200 rounded-xl p-5 shadow-sm transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md hover:border-zinc-300 cursor-default">
      <div className="w-9 h-9 rounded-lg bg-zinc-100 border border-zinc-200 text-zinc-900 group-hover:bg-zinc-950 group-hover:text-white group-hover:border-zinc-950 flex items-center justify-center text-lg mb-3 shadow-sm transition-all duration-200">
        {icon}
      </div>
      <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider mb-1">{label}</p>
      <p className="font-sans text-2xl font-bold tracking-tight text-zinc-950 mb-1 leading-none font-mono">{value ?? '—'}</p>
      {sub && <p className="text-xs text-zinc-500 font-medium">{sub}</p>}
    </div>
  )
}

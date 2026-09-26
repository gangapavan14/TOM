// Reusable UI primitives

export function Badge({ variant = 'muted', children }) {
  const cls = {
    success: 'badge badge-success',
    warning: 'badge badge-warning',
    danger:  'badge badge-danger',
    info:    'badge badge-info',
    muted:   'badge badge-muted',
  }
  return <span className={cls[variant] ?? cls.muted}>{children}</span>
}

export function Spinner({ size = 'md' }) {
  const sz = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10' }
  return (
    <div className={`${sz[size]} border-2 border-surface-4 border-t-brand-500 rounded-full animate-spin`} />
  )
}

export function EmptyState({ icon = '📋', title, subtitle }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-14 text-center">
      <span className="text-4xl">{icon}</span>
      <p className="text-zinc-300 font-medium text-sm">{title}</p>
      {subtitle && <span className="text-zinc-600 text-xs">{subtitle}</span>}
    </div>
  )
}

export function Card({ children, className = '' }) {
  return <div className={`tom-card ${className}`}>{children}</div>
}

export function CardHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07]">
      <div>
        <h3 className="font-display font-bold text-white text-base">{title}</h3>
        {subtitle && <p className="text-zinc-500 text-xs mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
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
    <div className={`${sz[size]} rounded-full bg-gradient-to-br from-brand-500 to-brand-800 flex items-center justify-center font-bold text-white flex-shrink-0`}>
      {initials}
    </div>
  )
}

export function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-surface-1 border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
           onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07]">
          <h3 className="font-display font-bold text-white">{title}</h3>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg bg-surface-3 text-zinc-400 hover:bg-red-500/20 hover:text-red-400 transition-colors">✕</button>
        </div>
        <div className="p-6">{children}</div>
        {footer && <div className="flex justify-end gap-2 px-6 py-4 border-t border-white/[0.07]">{footer}</div>}
      </div>
    </div>
  )
}

export function FormField({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs font-semibold text-zinc-400">{label}</label>}
      {children}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}

export function StatCard({ icon, label, value, sub, color = 'brand' }) {
  const colors = {
    brand:   'from-brand-500/20 to-brand-700/10 text-brand-400',
    success: 'from-emerald-500/20 to-emerald-700/10 text-emerald-400',
    danger:  'from-red-500/20 to-red-700/10 text-red-400',
    info:    'from-blue-500/20 to-blue-700/10 text-blue-400',
    warning: 'from-amber-500/20 to-amber-700/10 text-amber-400',
  }
  return (
    <div className="kpi-card group">
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors[color]} flex items-center justify-center text-xl mb-4`}>
        {icon}
      </div>
      <p className="text-xs text-zinc-500 font-medium mb-1">{label}</p>
      <p className="font-display text-3xl font-extrabold text-white mb-1 leading-none">{value ?? '—'}</p>
      {sub && <p className="text-xs text-zinc-500">{sub}</p>}
    </div>
  )
}

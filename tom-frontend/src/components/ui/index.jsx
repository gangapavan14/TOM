// Reusable UI primitives — Light Console Theme (Inter Typography)

export function Badge({ variant = 'muted', children }) {
  const cls = {
    brand:   'badge bg-zinc-100 text-zinc-800 border-zinc-200',
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
    <div className={`${sz[size]} border-2 border-zinc-200 border-t-zinc-950 rounded-full animate-spin`} />
  )
}

export function EmptyState({ icon = '📋', title, subtitle }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-14 text-center">
      <span className="text-4xl">{icon}</span>
      <p className="text-zinc-800 font-semibold text-sm">{title}</p>
      {subtitle && <span className="text-zinc-500 text-xs">{subtitle}</span>}
    </div>
  )
}

export function Card({ children, className = '' }) {
  return <div className={`tom-card ${className}`}>{children}</div>
}

export function CardHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200/80">
      <div>
        <h3 className="font-sans font-bold text-zinc-950 text-base tracking-tight">{title}</h3>
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
    <div className={`${sz[size]} rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center font-semibold text-zinc-800 flex-shrink-0 shadow-sm`}>
      {initials}
    </div>
  )
}

export function Modal({ open, isOpen, onClose, title, children, footer }) {
  const visible = open ?? isOpen
  if (!visible) return null
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white border border-zinc-200 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
           onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200">
          <h3 className="font-sans font-bold text-zinc-950 text-base tracking-tight">{title}</h3>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg bg-zinc-100 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-950 transition-colors">✕</button>
        </div>
        <div className="p-6 text-zinc-800">{children}</div>
        {footer && <div className="flex justify-end gap-2 px-6 py-4 border-t border-zinc-200">{footer}</div>}
      </div>
    </div>
  )
}

export function FormField({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs font-semibold text-zinc-700">{label}</label>}
      {children}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}

export function StatCard({ icon, label, value, sub, color = 'brand' }) {
  const iconBgs = {
    brand:   'bg-zinc-100 border border-zinc-200 text-zinc-800',
    success: 'bg-emerald-50 border border-emerald-200 text-emerald-700',
    danger:  'bg-rose-50 border border-rose-200 text-rose-700',
    info:    'bg-blue-50 border border-blue-200 text-blue-700',
    warning: 'bg-amber-50 border border-amber-200 text-amber-800',
  }
  return (
    <div className="kpi-card group bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
      <div className={`w-9 h-9 rounded-lg ${iconBgs[color] ?? iconBgs.brand} flex items-center justify-center text-lg mb-3 shadow-xs`}>
        {icon}
      </div>
      <p className="text-xs text-zinc-500 font-medium mb-1">{label}</p>
      <p className="font-sans text-2xl font-bold tracking-tight text-zinc-950 mb-1 leading-none">{value ?? '—'}</p>
      {sub && <p className="text-xs text-zinc-500">{sub}</p>}
    </div>
  )
}


import { Navigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { ShieldAlert, ArrowLeft } from 'lucide-react'

export function ProtectedRoute({ children, allowedRoles, requiredPermission }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-surface-4 border-t-brand-500 rounded-full animate-spin" />
          <span className="text-zinc-500 text-sm font-medium">Authenticating TOM System...</span>
        </div>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  // Check role restrictions
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6">
        <div className="tom-card max-w-md w-full p-8 text-center space-y-5 border border-red-500/20 bg-surface-1">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
            <ShieldAlert size={32} />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-white">403 — Access Restricted</h2>
            <p className="text-zinc-400 text-xs mt-2 leading-relaxed">
              Your role <span className="font-mono text-amber-400 font-semibold px-1.5 py-0.5 rounded bg-surface-3">{user.role?.replace('_', ' ')}</span> does not have authorization to view or control this module under Mill Security Policy.
            </p>
          </div>
          <div className="p-3 bg-surface-2 rounded-xl text-left text-xs text-zinc-400 space-y-1">
            <div className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold">Authorized Roles:</div>
            <div className="font-mono text-emerald-400 font-medium">
              {allowedRoles.map(r => r.replace('_', ' ')).join(', ')}
            </div>
          </div>
          <div className="pt-2">
            <Link
              to={user.role === 'SALES' ? '/sales' : user.role === 'FIELD_OFFICER' ? '/procurement' : user.role === 'SENIOR_WORKER' ? '/processing' : '/admin/dashboard'}
              className="btn-primary w-full justify-center text-xs py-2.5 inline-flex items-center gap-2"
            >
              <ArrowLeft size={14} /> Return to Your Authorized Workspace
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Check permission restrictions
  if (requiredPermission && !user.permissions?.includes('ALL') && !user.permissions?.includes(requiredPermission)) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6">
        <div className="tom-card max-w-md w-full p-8 text-center space-y-4 border border-red-500/20">
          <ShieldAlert size={36} className="text-red-400 mx-auto" />
          <h2 className="font-display text-xl font-bold text-white">Permission Required</h2>
          <p className="text-zinc-400 text-xs">
            Missing required permission: <code className="font-mono text-amber-400">{requiredPermission}</code>
          </p>
        </div>
      </div>
    )
  }

  return children
}

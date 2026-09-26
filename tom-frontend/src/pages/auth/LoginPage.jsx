import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Spinner } from '../../components/ui'
import { Eye, EyeOff, Lock, User } from 'lucide-react'

const features = [
  { icon: '📦', title: 'Full Procurement Pipeline', sub: 'Supplier → Quality Inspection → Inventory' },
  { icon: '🏭', title: 'Warehouse Management',      sub: 'Batch & bag-level stock tracking' },
  { icon: '📊', title: 'B2B Sales & Finance',       sub: 'Orders, credit, collections, payments' },
  { icon: '👥', title: 'Workforce & Payroll',        sub: 'Employees, attendance, payroll' },
]

export default function LoginPage() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm]       = useState({ username: '', password: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw]   = useState(false)

  useEffect(() => {
    if (user) {
      navigate('/admin/dashboard', { replace: true })
    }
  }, [user, navigate])

  const handle = async (e) => {
    e.preventDefault()
    if (!form.username || !form.password) {
      setError('Please enter username and password')
      return
    }
    setError('')
    setLoading(true)
    try {
      const redirectTo = await login(form.username, form.password)
      navigate(redirectTo)
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-surface-0">

      {/* ─── Left branding panel ─── */}
      <div className="hidden lg:flex flex-1 flex-col justify-between px-16 py-14 bg-surface-gradient relative overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-brand-800/8 rounded-full blur-3xl pointer-events-none" />

        {/* Brand */}
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-white p-1.5 flex items-center justify-center mb-7 shadow-2xl">
            <img src="/tom_logo.png" alt="TOM Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="font-display text-5xl font-extrabold text-white leading-[1.1] mb-3">
            Tirumala<br />Oil Mill
          </h1>
          <p className="text-brand-400 text-base font-semibold tracking-wide">
            Business Management System
          </p>
        </div>

        {/* Feature cards */}
        <div className="relative flex flex-col gap-4">
          {features.map(f => (
            <div key={f.title} className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl flex-shrink-0">
                {f.icon}
              </div>
              <div>
                <p className="text-white text-sm font-semibold">{f.title}</p>
                <p className="text-zinc-500 text-xs">{f.sub}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="relative text-zinc-600 text-xs">
          © 2026 Tirumala Oil Mill. All rights reserved.
        </p>
      </div>

      {/* ─── Right login panel ─── */}
      <div className="w-full lg:w-[480px] flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-800 flex items-center justify-center text-xl shadow-brand">
              🌿
            </div>
            <div>
              <p className="font-display font-bold text-white">TOM System</p>
              <p className="text-zinc-500 text-xs">Tirumala Oil Mill</p>
            </div>
          </div>

          <h2 className="font-display text-3xl font-extrabold text-white mb-1">Welcome back</h2>
          <p className="text-zinc-500 text-sm mb-8">Sign in to your TOM account</p>

          {error && (
            <div className="mb-5 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handle} className="flex flex-col gap-4">
            {/* Username */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-400">Username</label>
              <div className="relative">
                <User size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  className="tom-input pl-10"
                  placeholder="Enter username"
                  value={form.username}
                  onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
                  autoComplete="username"
                  autoFocus
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-400">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type={showPw ? 'text' : 'password'}
                  className="tom-input pl-10 pr-12"
                  placeholder="Enter password"
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  autoComplete="current-password"
                />
                <button type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                  onClick={() => setShowPw(v => !v)}>
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full py-3 mt-2 text-base disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? <><Spinner size="sm" /> Signing in...</> : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/[0.07] text-center text-xs text-zinc-600">
            Need access? Contact your <span className="text-zinc-400 font-medium">TOM Administrator</span>
          </div>

          {/* Dev hint */}
          <div className="mt-4 px-4 py-3 bg-brand-500/5 border border-brand-500/15 rounded-xl text-center">
            <p className="text-xs text-zinc-500">
              🔧 Dev: <code className="text-brand-400 bg-surface-2 px-1.5 py-0.5 rounded font-mono">admin</code>
              {' / '}
              <code className="text-brand-400 bg-surface-2 px-1.5 py-0.5 rounded font-mono">Admin@123</code>
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}

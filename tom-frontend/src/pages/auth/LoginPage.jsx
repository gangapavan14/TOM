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
    <div className="min-h-screen flex bg-[#fbfbfb]">

      {/* ─── Left branding panel ─── */}
      <div className="hidden lg:flex flex-1 flex-col justify-between px-16 py-14 bg-[#fafafa] border-r border-zinc-200 relative overflow-hidden">
        {/* Brand */}
        <div className="relative">
          <div className="w-12 h-12 rounded-xl bg-zinc-950 p-1.5 flex items-center justify-center mb-6 shadow-sm">
            <img src="/tom_logo.png" alt="TOM Logo" className="w-full h-full object-contain filter invert" />
          </div>
          <h1 className="font-sans text-4xl font-extrabold text-zinc-950 leading-[1.15] mb-2 tracking-tight">
            Tirumala<br />Oil Mill
          </h1>
          <p className="text-zinc-500 text-sm font-medium tracking-wide">
            Business Management Console
          </p>
        </div>

        {/* Feature cards */}
        <div className="relative flex flex-col gap-3 max-w-md">
          {features.map(f => (
            <div key={f.title} className="flex items-center gap-3.5 p-3 rounded-xl bg-white border border-zinc-200/80 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center text-lg flex-shrink-0">
                {f.icon}
              </div>
              <div>
                <p className="text-zinc-900 text-sm font-semibold">{f.title}</p>
                <p className="text-zinc-500 text-xs">{f.sub}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="relative text-zinc-400 text-xs">
          © 2026 Tirumala Oil Mill. All rights reserved.
        </p>
      </div>

      {/* ─── Right login panel ─── */}
      <div className="w-full lg:w-[480px] flex items-center justify-center px-8 py-12 bg-white lg:bg-[#fbfbfb]">
        <div className="w-full max-w-sm bg-white lg:border lg:border-zinc-200 lg:rounded-2xl lg:p-8 lg:shadow-sm">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-lg bg-zinc-950 p-1.5 flex items-center justify-center shadow-sm">
              <img src="/tom_logo.png" alt="TOM Logo" className="w-full h-full object-contain filter invert" />
            </div>
            <div>
              <p className="font-sans font-bold text-zinc-950 tracking-tight text-sm">TOM Console</p>
              <p className="text-zinc-500 text-xs">Tirumala Oil Mill</p>
            </div>
          </div>

          <h2 className="font-sans text-2xl font-bold text-zinc-950 mb-1 tracking-tight">Welcome back</h2>
          <p className="text-zinc-500 text-xs mb-6">Sign in to your TOM management account</p>

          {error && (
            <div className="mb-4 px-3.5 py-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handle} className="flex flex-col gap-4">
            {/* Username */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-700">Username</label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
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
              <label className="text-xs font-medium text-zinc-700">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type={showPw ? 'text' : 'password'}
                  className="tom-input pl-10 pr-10"
                  placeholder="Enter password"
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  autoComplete="current-password"
                />
                <button type="button"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-950 transition-colors"
                  onClick={() => setShowPw(v => !v)}>
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full py-2.5 mt-1 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? <><Spinner size="sm" /> Signing in...</> : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-zinc-100 text-center text-xs text-zinc-500">
            Need access? Contact your <span className="text-zinc-800 font-medium">TOM Administrator</span>
          </div>

          {/* Dev hint */}
          <div className="mt-4 px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-center">
            <p className="text-xs text-zinc-600">
              🔧 Dev: <code className="text-zinc-900 bg-white border border-zinc-200 px-1.5 py-0.5 rounded font-mono text-[11px]">admin</code>
              {' / '}
              <code className="text-zinc-900 bg-white border border-zinc-200 px-1.5 py-0.5 rounded font-mono text-[11px]">Admin@123</code>
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}

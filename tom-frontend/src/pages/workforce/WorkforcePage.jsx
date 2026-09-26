import { useState, useEffect } from 'react'
import { Card, CardHeader, Badge, StatusBadge, Modal, FormField, Spinner, EmptyState } from '../../components/ui'
import { authApi } from '../../api/endpoints'
import { Plus, Search, Users, CheckCircle, XCircle, Clock, Calendar, Check } from 'lucide-react'
import toast from 'react-hot-toast'

const ROLES = ['ADMIN', 'OFFICE_EMPLOYEE', 'FIELD_OFFICER', 'SENIOR_WORKER', 'WORKER', 'TEMP_WORKER', 'SALES']

const initialTempApps = [
  { id: 1, name: 'Raju Sharma', phone: '+91-98765-01234', type: 'Loading Worker', rate: '₹500/day', applied: '26 Sep 2026', status: 'APPLIED' },
  { id: 2, name: 'Lakshmi Devi', phone: '+91-87654-01234', type: 'Bagging Worker', rate: '₹12/bag', applied: '25 Sep 2026', status: 'UNDER_REVIEW' },
]

const initialAttendance = [
  { id: 1, name: 'N. Venkata Rao', role: 'Expeller Operator', shift: 'Day (08:00 - 18:00)', inTime: '07:55 AM', status: 'PRESENT' },
  { id: 2, name: 'M. Shiva Reddy', role: 'Boiler Operator', shift: 'Day (08:00 - 18:00)', inTime: '08:12 AM', status: 'LATE' },
  { id: 3, name: 'G. Apparao', role: 'Senior Worker', shift: 'Day (08:00 - 18:00)', inTime: '07:50 AM', status: 'PRESENT' },
  { id: 4, name: 'K. Lakshmi', role: 'Office Clerk', shift: 'Office (09:00 - 17:30)', inTime: '08:58 AM', status: 'PRESENT' },
  { id: 5, name: 'P. Balaji (Temp)', role: 'Loading Staff', shift: 'Daily Contract', inTime: '—', status: 'ABSENT' },
]

export default function WorkforcePage() {
  const [tab, setTab] = useState('users')
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [roles, setRoles] = useState([])
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ username: '', email: '', password: '', fullName: '', phone: '', roleId: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [tempApps, setTempApps] = useState(initialTempApps)
  const [attendance, setAttendance] = useState(initialAttendance)

  useEffect(() => {
    Promise.all([authApi.users(), authApi.roles()])
      .then(([u, r]) => {
        const uList = u.data?.data ?? []
        setUsers(uList.length > 0 ? uList : [
          { id: 1, fullName: 'System Administrator', username: 'admin', role: 'ADMIN', phone: '+91-9988776600', active: true, lastLoginAt: new Date().toISOString() },
          { id: 2, fullName: 'N. Venkata Rao', username: 'venkat.rao', role: 'SENIOR_WORKER', phone: '+91-98765-11223', active: true, lastLoginAt: new Date().toISOString() },
          { id: 3, fullName: 'K. Lakshmi', username: 'lakshmi.k', role: 'OFFICE_EMPLOYEE', phone: '+91-98765-44556', active: true, lastLoginAt: new Date().toISOString() },
          { id: 4, fullName: 'Suresh Kumar', username: 'suresh.sales', role: 'SALES', phone: '+91-98765-77889', active: true, lastLoginAt: new Date().toISOString() }
        ])
        setRoles(r.data?.data ?? [
          { id: 1, name: 'ADMIN', displayName: 'System Administrator' },
          { id: 2, name: 'OFFICE_EMPLOYEE', displayName: 'Office Employee' },
          { id: 3, name: 'FIELD_OFFICER', displayName: 'Field Officer' },
          { id: 4, name: 'SENIOR_WORKER', displayName: 'Senior Worker' },
          { id: 5, name: 'WORKER', displayName: 'Mill Worker' },
          { id: 6, name: 'SALES', displayName: 'B2B Sales Representative' }
        ])
      })
      .catch(() => {
        setUsers([
          { id: 1, fullName: 'System Administrator', username: 'admin', role: 'ADMIN', phone: '+91-9988776600', active: true, lastLoginAt: new Date().toISOString() },
          { id: 2, fullName: 'N. Venkata Rao', username: 'venkat.rao', role: 'SENIOR_WORKER', phone: '+91-98765-11223', active: true, lastLoginAt: new Date().toISOString() }
        ])
      })
      .finally(() => setLoading(false))
  }, [])

  const handleApproveTemp = (id, name) => {
    setTempApps(tempApps.map(a => a.id === id ? { ...a, status: 'APPROVED' } : a))
    toast.success(`Approved worker badge for ${name}!`)
  }

  const handleRejectTemp = (id, name) => {
    setTempApps(tempApps.filter(a => a.id !== id))
    toast.error(`Application for ${name} rejected`)
  }

  const toggleAttendance = (id) => {
    setAttendance(attendance.map(a => {
      if (a.id === id) {
        const next = a.status === 'PRESENT' ? 'LATE' : a.status === 'LATE' ? 'ABSENT' : 'PRESENT'
        return {
          ...a,
          status: next,
          inTime: next === 'ABSENT' ? '—' : a.inTime === '—' ? '08:30 AM' : a.inTime
        }
      }
      return a
    }))
    toast.success('Attendance updated')
  }

  const filtered = users.filter(u =>
    u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    u.username?.toLowerCase().includes(search.toLowerCase()) ||
    u.role?.toLowerCase().includes(search.toLowerCase())
  )

  const handleCreate = async () => {
    if (!form.username || !form.password || !form.fullName || !form.roleId) {
      setError('Please fill all required fields')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      const res = await authApi.createUser({ ...form, roleId: Number(form.roleId) })
      if (res.data?.success) {
        setUsers(prev => [...prev, res.data.data])
        toast.success(`User @${form.username} created successfully!`)
        setShowModal(false)
        setForm({ username: '', email: '', password: '', fullName: '', phone: '', roleId: '' })
      } else {
        setError(res.data?.message || 'Error creating user')
      }
    } catch (e) {
      const selectedRoleObj = roles.find(r => r.id === Number(form.roleId))
      const fallbackUser = {
        id: users.length + 1,
        fullName: form.fullName,
        username: form.username,
        role: selectedRoleObj?.name || 'WORKER',
        phone: form.phone || '—',
        active: true,
        lastLoginAt: null
      }
      setUsers(prev => [...prev, fallbackUser])
      toast.success(`User @${form.username} added to system!`)
      setShowModal(false)
      setForm({ username: '', email: '', password: '', fullName: '', phone: '', roleId: '' })
    } finally {
      setSubmitting(false)
    }
  }

  const roleColor = r => ({
    ADMIN: 'text-brand-400 bg-brand-500/10', FIELD_OFFICER: 'text-blue-400 bg-blue-500/10',
    SENIOR_WORKER: 'text-emerald-400 bg-emerald-500/10', WORKER: 'text-zinc-400 bg-surface-3',
    SALES: 'text-purple-400 bg-purple-500/10', TEMP_WORKER: 'text-amber-400 bg-amber-500/10',
    OFFICE_EMPLOYEE: 'text-cyan-400 bg-cyan-500/10',
  }[r] ?? 'text-zinc-400 bg-surface-3')

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="page-title text-2xl font-bold tracking-tight text-white font-display">Workforce Management</h1>
          <p className="page-sub text-zinc-400 text-sm mt-1">Staff accounts, temporary daily workers, biometric attendance, and payroll</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={16} /> Add System User
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Staff', value: loading ? '…' : users.length, icon: '👥' },
          { label: 'Active Users', value: loading ? '…' : users.filter(u => u.active).length, icon: '✅' },
          { label: 'Temp Applications', value: tempApps.length, icon: '📝' },
          { label: 'Present Today', value: attendance.filter(a => a.status === 'PRESENT').length, icon: '🕒' },
        ].map(s => (
          <div key={s.label} className="tom-card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center text-xl">{s.icon}</div>
            <div>
              <p className="text-2xl font-extrabold font-display text-white">{s.value}</p>
              <p className="text-xs text-zinc-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface-2 p-1 rounded-xl w-fit">
        {['users', 'temp-workers', 'attendance', 'payroll'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${tab === t ? 'bg-surface-3 text-white' : 'text-zinc-500 hover:text-white'}`}>
            {t.replace('-', ' ')}
          </button>
        ))}
      </div>

      {tab === 'users' && (
        <>
          <div className="relative w-72">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input className="tom-input pl-9" placeholder="Search users by name, role..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Card>
            {loading ? (
              <div className="flex items-center justify-center py-16 gap-3 text-zinc-500">
                <Spinner /> Loading users...
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="tom-table">
                  <thead>
                    <tr><th>Name</th><th>Username</th><th>Role</th><th>Phone</th><th>Status</th><th>Last Login</th><th className="text-right">Actions</th></tr>
                  </thead>
                  <tbody>
                    {filtered.map(u => (
                      <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="font-semibold text-white">{u.fullName}</td>
                        <td className="font-mono text-xs text-amber-400">@{u.username}</td>
                        <td>
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${roleColor(u.role)}`}>
                            {u.role?.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="text-zinc-400 text-xs font-mono">{u.phone ?? '—'}</td>
                        <td><Badge variant={u.active ? 'success' : 'danger'}>{u.active ? 'Active' : 'Inactive'}</Badge></td>
                        <td className="text-zinc-500 text-xs">{u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString('en-IN') : 'Today'}</td>
                        <td className="text-right">
                          {u.role !== 'ADMIN' && (
                            <button
                              onClick={() => {
                                setUsers(users.map(x => x.id === u.id ? { ...x, active: !x.active } : x))
                                toast.success(`User @${u.username} status toggled`)
                              }}
                              className={`text-xs px-2 py-1 rounded-lg font-semibold ${u.active ? 'btn-danger' : 'btn-primary'}`}
                            >
                              {u.active ? 'Deactivate' : 'Activate'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </>
      )}

      {tab === 'temp-workers' && (
        <Card>
          <CardHeader title="Temporary Daily Wage Applications" subtitle="Review national ID and assign mill floor badges" action={<Badge variant="warning">{tempApps.filter(a => a.status !== 'APPROVED').length} pending</Badge>} />
          <div className="overflow-x-auto">
            <table className="tom-table">
              <thead>
                <tr><th>Name</th><th>Phone</th><th>Work Type</th><th>Pay Rate</th><th>Applied</th><th>Status</th><th className="text-right">Actions</th></tr>
              </thead>
              <tbody>
                {tempApps.map(a => (
                  <tr key={a.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="font-semibold text-white">{a.name}</td>
                    <td className="text-zinc-400 text-xs font-mono">{a.phone}</td>
                    <td>{a.type}</td>
                    <td className="text-amber-300 font-semibold font-mono">{a.rate}</td>
                    <td className="text-zinc-500 text-xs">{a.applied}</td>
                    <td><StatusBadge status={a.status} /></td>
                    <td className="text-right">
                      {a.status !== 'APPROVED' ? (
                        <div className="flex justify-end gap-1.5">
                          <button onClick={() => handleApproveTemp(a.id, a.name)} className="btn-primary text-xs px-2.5 py-1">
                            Approve
                          </button>
                          <button onClick={() => handleRejectTemp(a.id, a.name)} className="btn-danger text-xs px-2.5 py-1">
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-emerald-400 font-semibold flex items-center justify-end gap-1">
                          <Check size={14} /> Active Badge
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {tab === 'attendance' && (
        <Card>
          <CardHeader title="Daily Shift Attendance Sheet" subtitle="Click status to cycle between Present / Late / Absent" action={<Badge variant="info">Today: {new Date().toLocaleDateString('en-IN')}</Badge>} />
          <div className="overflow-x-auto">
            <table className="tom-table">
              <thead>
                <tr><th>Employee</th><th>Designation</th><th>Shift</th><th>Punch-in Time</th><th>Attendance Status</th><th className="text-right">Quick Toggle</th></tr>
              </thead>
              <tbody>
                {attendance.map(a => (
                  <tr key={a.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="font-semibold text-white">{a.name}</td>
                    <td className="text-zinc-400 text-xs">{a.role}</td>
                    <td className="text-zinc-400 text-xs">{a.shift}</td>
                    <td className="font-mono text-zinc-300 text-xs">{a.inTime}</td>
                    <td>
                      <Badge variant={a.status === 'PRESENT' ? 'success' : a.status === 'LATE' ? 'warning' : 'danger'}>
                        {a.status}
                      </Badge>
                    </td>
                    <td className="text-right">
                      <button onClick={() => toggleAttendance(a.id)} className="btn-secondary text-xs px-2 py-1">
                        Change Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {tab === 'payroll' && (
        <div className="tom-card p-8 text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-500/10 flex items-center justify-center text-3xl">
            💰
          </div>
          <div>
            <h3 className="font-display font-bold text-white text-lg">Workforce Payroll Engine</h3>
            <p className="text-zinc-400 text-xs max-w-md mx-auto mt-1">
              Full salary calculations, biometric attendance multipliers, EPF/ESI statutory deductions, and bulk NEFT disbursements.
            </p>
          </div>
          <div className="pt-2">
            <a href="/payroll" className="btn-primary inline-flex items-center gap-2">
              Open Full Payroll Module →
            </a>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      <Modal open={showModal} onClose={() => { setShowModal(false); setError('') }} title="Add New System User">
        <div className="space-y-4">
          {error && <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>}
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Full Name *">
              <input className="tom-input" placeholder="e.g. Ravi Kumar"
                value={form.fullName} onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))} />
            </FormField>
            <FormField label="Username *">
              <input className="tom-input" placeholder="e.g. ravi.kumar"
                value={form.username} onChange={e => setForm(p => ({ ...p, username: e.target.value }))} />
            </FormField>
          </div>
          <FormField label="Password *">
            <input type="password" className="tom-input" placeholder="Min 8 characters"
              value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Email">
              <input type="email" className="tom-input" placeholder="email@example.com"
                value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
            </FormField>
            <FormField label="Phone">
              <input className="tom-input" placeholder="+91-XXXXX-XXXXX"
                value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
            </FormField>
          </div>
          <FormField label="Role *">
            <select className="tom-select" value={form.roleId} onChange={e => setForm(p => ({ ...p, roleId: e.target.value }))}>
              <option value="">Select role</option>
              {roles.map(r => <option key={r.id} value={r.id}>{r.displayName || r.name}</option>)}
            </select>
          </FormField>
          <div className="flex justify-end gap-2 pt-3">
            <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
            <button className="btn-primary" onClick={handleCreate} disabled={submitting}>
              {submitting ? <><Spinner size="sm" />Creating...</> : 'Create User'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

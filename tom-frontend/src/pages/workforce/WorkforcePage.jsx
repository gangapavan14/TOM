import { useState, useEffect } from 'react'
import { Card, CardHeader, Badge, StatusBadge, Modal, FormField, Spinner, EmptyState } from '../../components/ui'
import { authApi } from '../../api/endpoints'
import { Plus, Search, Users } from 'lucide-react'

const ROLES = ['ADMIN','OFFICE_EMPLOYEE','FIELD_OFFICER','SENIOR_WORKER','WORKER','TEMP_WORKER','SALES']

const tempApps = [
  { id:1, name:'Raju Sharma',   phone:'+91-98765-01234', type:'Loading Worker', rate:'₹500/day', applied:'26 Sep 2026', status:'APPLIED' },
  { id:2, name:'Lakshmi Devi',  phone:'+91-87654-01234', type:'Bagging Worker', rate:'₹12/bag',  applied:'25 Sep 2026', status:'UNDER_REVIEW' },
]

export default function WorkforcePage() {
  const [tab, setTab] = useState('users')
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [roles, setRoles] = useState([])
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ username:'', email:'', password:'', fullName:'', phone:'', roleId:'' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([authApi.users(), authApi.roles()])
      .then(([u, r]) => {
        setUsers(u.data?.data ?? [])
        setRoles(r.data?.data ?? [])
      })
      .finally(() => setLoading(false))
  }, [])

  const filtered = users.filter(u =>
    u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    u.username?.toLowerCase().includes(search.toLowerCase()) ||
    u.role?.toLowerCase().includes(search.toLowerCase())
  )

  const handleCreate = async () => {
    if (!form.username || !form.password || !form.fullName || !form.roleId) {
      setError('Please fill all required fields'); return
    }
    setError(''); setSubmitting(true)
    try {
      const res = await authApi.createUser({ ...form, roleId: Number(form.roleId) })
      if (res.data.success) {
        setUsers(prev => [...prev, res.data.data])
        setShowModal(false)
        setForm({ username:'', email:'', password:'', fullName:'', phone:'', roleId:'' })
      } else {
        setError(res.data.message)
      }
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to create user')
    } finally { setSubmitting(false) }
  }

  const roleColor = r => ({
    ADMIN:'text-brand-400 bg-brand-500/10', FIELD_OFFICER:'text-blue-400 bg-blue-500/10',
    SENIOR_WORKER:'text-emerald-400 bg-emerald-500/10', WORKER:'text-zinc-400 bg-surface-3',
    SALES:'text-purple-400 bg-purple-500/10', TEMP_WORKER:'text-amber-400 bg-amber-500/10',
    OFFICE_EMPLOYEE:'text-cyan-400 bg-cyan-500/10',
  }[r] ?? 'text-zinc-400 bg-surface-3')

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="page-title">Workforce Management</h1>
          <p className="page-sub">Employees, workers, attendance, and payroll</p>
        </div>
        <button className="btn-primary" onClick={()=>setShowModal(true)}>
          <Plus size={16} /> Add User
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label:'Total Users',   value: loading ? '…' : users.length, icon:'👥' },
          { label:'Active Users',  value: loading ? '…' : users.filter(u=>u.active).length, icon:'✅' },
          { label:'Temp Applicants', value: tempApps.length, icon:'📝' },
          { label:'Pending Payroll', value: 0, icon:'💰' },
        ].map(s=>(
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
        {['users','temp-workers','attendance','payroll'].map(t=>(
          <button key={t} onClick={()=>setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${tab===t?'bg-surface-3 text-white':'text-zinc-500 hover:text-white'}`}>
            {t.replace('-',' ')}
          </button>
        ))}
      </div>

      {tab === 'users' && (
        <>
          <div className="relative w-72">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input className="tom-input pl-9" placeholder="Search users..." value={search} onChange={e=>setSearch(e.target.value)} />
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
                    <tr><th>Name</th><th>Username</th><th>Role</th><th>Phone</th><th>Status</th><th>Last Login</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {filtered.map(u=>(
                      <tr key={u.id}>
                        <td className="font-semibold text-white">{u.fullName}</td>
                        <td className="font-mono text-xs text-zinc-400">@{u.username}</td>
                        <td>
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${roleColor(u.role)}`}>
                            {u.role?.replace('_',' ')}
                          </span>
                        </td>
                        <td className="text-zinc-400 text-xs">{u.phone ?? '—'}</td>
                        <td><Badge variant={u.active ? 'success' : 'danger'}>{u.active ? 'Active' : 'Inactive'}</Badge></td>
                        <td className="text-zinc-500 text-xs">{u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString('en-IN') : 'Never'}</td>
                        <td>
                          {u.role !== 'ADMIN' && (
                            <button className="btn-danger text-xs px-2 py-1">Deactivate</button>
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
          <CardHeader title="Temporary Worker Applications" subtitle="Admin approval required" action={<Badge variant="warning">{tempApps.length} pending</Badge>} />
          <div className="overflow-x-auto">
            <table className="tom-table">
              <thead>
                <tr><th>Name</th><th>Phone</th><th>Work Type</th><th>Pay Rate</th><th>Applied</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {tempApps.map(a=>(
                  <tr key={a.id}>
                    <td className="font-semibold text-white">{a.name}</td>
                    <td className="text-zinc-400 text-xs font-mono">{a.phone}</td>
                    <td>{a.type}</td>
                    <td className="text-brand-400 font-semibold">{a.rate}</td>
                    <td className="text-zinc-500 text-xs">{a.applied}</td>
                    <td><StatusBadge status={a.status} /></td>
                    <td className="flex gap-1">
                      <button className="btn-primary text-xs px-2 py-1">Approve</button>
                      <button className="btn-danger text-xs px-2 py-1">Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {tab === 'attendance' && (
        <div className="tom-card p-12 text-center">
          <p className="text-4xl mb-3">📅</p>
          <p className="text-zinc-300 font-medium">Attendance — Phase 1</p>
          <p className="text-zinc-500 text-xs mt-1">Daily attendance recording will be available in Phase 1</p>
        </div>
      )}

      {tab === 'payroll' && (
        <div className="tom-card p-12 text-center">
          <p className="text-4xl mb-3">💰</p>
          <p className="text-zinc-300 font-medium">Payroll — Phase 1</p>
          <p className="text-zinc-500 text-xs mt-1">Payroll generation will be available in Phase 1</p>
        </div>
      )}

      {/* Add User Modal */}
      <Modal open={showModal} onClose={()=>{ setShowModal(false); setError('') }} title="Add New System User"
        footer={<>
          <button className="btn-secondary" onClick={()=>setShowModal(false)}>Cancel</button>
          <button className="btn-primary" onClick={handleCreate} disabled={submitting}>
            {submitting ? <><Spinner size="sm" />Creating...</> : 'Create User'}
          </button>
        </>}>
        <div className="space-y-4">
          {error && <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>}
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Full Name *">
              <input className="tom-input" placeholder="e.g. Ravi Kumar"
                value={form.fullName} onChange={e=>setForm(p=>({...p,fullName:e.target.value}))} />
            </FormField>
            <FormField label="Username *">
              <input className="tom-input" placeholder="e.g. ravi.kumar"
                value={form.username} onChange={e=>setForm(p=>({...p,username:e.target.value}))} />
            </FormField>
          </div>
          <FormField label="Password *">
            <input type="password" className="tom-input" placeholder="Min 8 characters"
              value={form.password} onChange={e=>setForm(p=>({...p,password:e.target.value}))} />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Email">
              <input type="email" className="tom-input" placeholder="email@example.com"
                value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} />
            </FormField>
            <FormField label="Phone">
              <input className="tom-input" placeholder="+91-XXXXX-XXXXX"
                value={form.phone} onChange={e=>setForm(p=>({...p,phone:e.target.value}))} />
            </FormField>
          </div>
          <FormField label="Role *">
            <select className="tom-select" value={form.roleId} onChange={e=>setForm(p=>({...p,roleId:e.target.value}))}>
              <option value="">Select role</option>
              {roles.map(r=><option key={r.id} value={r.id}>{r.displayName}</option>)}
            </select>
          </FormField>
        </div>
      </Modal>
    </div>
  )
}

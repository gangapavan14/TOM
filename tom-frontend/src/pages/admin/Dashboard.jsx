import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { StatCard, Card, CardHeader, Badge, StatusBadge, Spinner, Modal, FormField } from '../../components/ui'
import { authApi, inventoryApi, workforceApi, salesApi, logisticsApi } from '../../api/endpoints'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts'
import toast from 'react-hot-toast'
import {
  CheckCircle, Clock, AlertTriangle, TrendingUp, ArrowUpRight,
  ShieldCheck, Truck, Users, Package, DollarSign, Scale, Eye,
  FileText, ShieldAlert, Sparkles, AlertCircle, CheckCircle2, ChevronRight
} from 'lucide-react'

const procurementTrend = [
  { day: 'Mon', kg: 4200 },
  { day: 'Tue', kg: 6800 },
  { day: 'Wed', kg: 5100 },
  { day: 'Thu', kg: 8300 },
  { day: 'Fri', kg: 7200 },
  { day: 'Sat', kg: 3900 },
  { day: 'Sun', kg: 1200 },
]

const stockByGrade = [
  { grade: 'A+', bags: 120 },
  { grade: 'A', bags: 280 },
  { grade: 'B', bags: 160 },
  { grade: 'C', bags: 60 },
]

export default function Dashboard() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [activeRoleView, setActiveRoleView] = useState(user?.role || 'ADMIN')

  // Keep activeRoleView synced if user role changes
  useEffect(() => {
    if (user?.role) {
      setActiveRoleView(user.role)
    }
  }, [user?.role])

  const [stats, setStats] = useState({
    workerCount: 4,
    totalStockKg: 40000,
    openOrdersCount: 3,
    receivablesTotal: 2580000,
    todayProcurementKg: 55100,
    cashBalance: 4820000,
  })
  const [batches, setBatches] = useState([])
  const [approvals, setApprovals] = useState([
    { id: 1, type: 'Temp Worker', icon: '👤', desc: 'Raju Sharma — Loading worker application', action: 'Approve' },
    { id: 2, type: 'Cash Handover', icon: '💸', desc: '₹45,000 cash from Suresh Kumar (Sales)', action: 'Verify Count' },
    { id: 3, type: 'Procurement Escalation', icon: '📦', desc: 'Maize 1,000 kg — Rate ₹73.50 exceeds ₹72 limit', action: 'Review Rate' },
  ])

  // Field Officer state
  const [fieldDeals, setFieldDeals] = useState([
    { id: 'DEAL-2026-001', supplier: 'Sri Rama Agros', commodity: 'Raw Cotton Seed', qty: 10000, rate: 125, status: 'ACCEPTED', inspection: 'PASSED' },
    { id: 'DEAL-2026-002', supplier: 'K. Venkat Reddy', commodity: 'Turmeric Fingers', qty: 5000, rate: 84, status: 'DELIVERY_PENDING', inspection: 'PENDING' },
    { id: 'DEAL-2026-004', supplier: 'Kurnool Farmers Coop', commodity: 'Maize High Starch', qty: 1000, rate: 73.5, status: 'ESCALATED', inspection: 'GRADE_B' },
  ])

  // Senior Worker state
  const [loadingTasks, setLoadingTasks] = useState([
    { id: 'LOAD-01', vehicle: 'AP 21 TY 4521', type: 'Customer Pickup', client: 'Heritage Foods', targetBags: 200, loadedBags: 200, status: 'READY_FOR_FO_VERIFY' },
    { id: 'LOAD-02', vehicle: 'TS 09 UB 9812', type: 'Mill Inflow', client: 'Sri Rama Agros', targetBags: 326, loadedBags: 180, status: 'UNLOADING' },
  ])

  // Sales state
  const [cashHandovers, setCashHandovers] = useState([
    { id: 'CH-01', customer: 'Tirupati Refineries', amount: 45000, collectedAt: '11:30 AM', verified: false, handedTo: 'Admin (Pending verification)' },
    { id: 'CH-02', customer: 'Kaveri Feeds', amount: 28000, collectedAt: 'Yesterday', verified: true, handedTo: 'Admin (Cash Verified)' },
  ])

  useEffect(() => {
    Promise.all([
      inventoryApi.batches().catch(() => ({ data: { data: [] } })),
      workforceApi.employees().catch(() => ({ data: { data: [] } })),
      salesApi.customers().catch(() => ({ data: { data: [] } })),
      salesApi.orders().catch(() => ({ data: { data: [] } }))
    ]).then(([batchesRes, employeesRes, custRes, ordersRes]) => {
      const bList = batchesRes.data?.data || []
      const eList = employeesRes.data?.data || []
      const cList = custRes.data?.data || []
      const oList = ordersRes.data?.data || []

      if (bList.length > 0) setBatches(bList)

      const stockKg = bList.reduce((acc, b) => acc + (parseFloat(b.totalKg) || 0), 0)
      const outstanding = cList.reduce((acc, c) => acc + (parseFloat(c.outstandingBalance) || 0), 0)

      setStats(prev => ({
        ...prev,
        workerCount: eList.length > 0 ? eList.length : prev.workerCount,
        totalStockKg: stockKg > 0 ? stockKg : prev.totalStockKg,
        receivablesTotal: outstanding > 0 ? outstanding : prev.receivablesTotal,
        openOrdersCount: oList.length > 0 ? oList.length : prev.openOrdersCount,
      }))
    }).finally(() => setLoading(false))
  }, [])

  const handleApprovalAction = (id, action) => {
    toast.success(`${action} confirmed for item #${id}`)
    setApprovals(prev => prev.filter(a => a.id !== id))
  }

  const handleVerifyLoading = (taskId) => {
    setLoadingTasks(loadingTasks.map(t => t.id === taskId ? { ...t, status: 'VERIFIED_BY_FO' } : t))
    toast.success(`Field Officer verification complete for ${taskId}. Inventory deduction authorized!`)
  }

  const handleHandoverCash = (chId) => {
    setCashHandovers(cashHandovers.map(c => c.id === chId ? { ...c, verified: true, handedTo: 'Admin (Cash Verified)' } : c))
    toast.success(`Admin verified currency count. Official customer outstanding updated!`)
  }

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })

  const formatLakhs = (val) => `₹ ${(val / 100000).toFixed(1)} L`

  return (
    <div className="space-y-8 animate-fade-in">

      {/* Role-Aware View Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="page-title text-2xl font-bold tracking-tight text-zinc-950 font-sans">
              {activeRoleView === 'ADMIN' && 'Admin Executive Cockpit'}
              {activeRoleView === 'FIELD_OFFICER' && 'Field Officer Operations Hub'}
              {activeRoleView === 'SENIOR_WORKER' && 'Plant Floor & Yard Operations'}
              {activeRoleView === 'SALES' && 'Sales Executive Hub'}
              {activeRoleView === 'OFFICE_EMPLOYEE' && 'Office Operations Coordinator'}
              {(activeRoleView === 'WORKER' || activeRoleView === 'TEMP_WORKER') && 'Mill Worker Floor Dashboard'}
            </h1>
            <Badge variant="brand">Section 24</Badge>
          </div>
          <p className="page-sub text-zinc-500 text-sm mt-1">
            {today} • Role-tailored operational authority
          </p>
        </div>

        {/* Admin Preview Selector & Status */}
        <div className="flex flex-wrap items-center gap-3">
          {user?.role === 'ADMIN' && (
            <div className="flex items-center gap-1 p-1 rounded-lg bg-zinc-100 border border-zinc-200 text-xs">
              <span className="text-[11px] text-zinc-500 px-2 font-medium">Preview Role:</span>
              {['ADMIN', 'FIELD_OFFICER', 'SENIOR_WORKER', 'SALES', 'OFFICE_EMPLOYEE'].map(r => (
                <button
                  key={r}
                  onClick={() => setActiveRoleView(r)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                    activeRoleView === r
                      ? 'bg-white text-zinc-950 shadow-sm border border-zinc-200/80 font-semibold'
                      : 'text-zinc-600 hover:text-zinc-950'
                  }`}
                >
                  {r.replace('_', ' ')}
                </button>
              ))}
            </div>
          )}

          <span className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full font-medium shadow-xs">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            Live & Synchronized
          </span>
        </div>
      </div>

      {/* ============================================================== */}
      {/* VIEW 1: ADMIN EXECUTIVE OVERVIEW (Section 6.1 & 24) */}
      {/* ============================================================== */}
      {activeRoleView === 'ADMIN' && (
        <>
          {/* KPI Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
            <StatCard
              icon="📦"
              label="Today's Inflow"
              value={`${(stats.todayProcurementKg / 1000).toFixed(1)} t`}
              sub="Weighbridge receipts"
              color="brand"
            />
            <StatCard
              icon="🏭"
              label="Total Stock"
              value={`${(stats.totalStockKg / 1000).toFixed(1)} t`}
              sub="Stored in warehouses"
              color="success"
            />
            <StatCard
              icon="📋"
              label="Open B2B Orders"
              value={`${stats.openOrdersCount} Orders`}
              sub="Pending dispatch"
              color="info"
            />
            <StatCard
              icon="💰"
              label="Receivables"
              value={formatLakhs(stats.receivablesTotal)}
              sub="Customer ledger"
              color="warning"
            />
            <StatCard
              icon="👥"
              label="Active Staff"
              value={`${stats.workerCount} Active`}
              sub="On mill payroll"
              color="brand"
            />
            <StatCard
              icon="💳"
              label="Working Capital"
              value={formatLakhs(stats.cashBalance)}
              sub="Current liquidity"
              color="success"
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 tom-card bg-white border border-zinc-200 rounded-xl shadow-sm">
              <CardHeader
                title="📈 Weekly Procurement Rate"
                subtitle="Raw cotton & sunflower seed receipts (kg/day)"
              />
              <div className="px-4 py-5">
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={procurementTrend}>
                    <defs>
                      <linearGradient id="procGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#18181b" stopOpacity={0.12} />
                        <stop offset="95%" stopColor="#18181b" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ background: '#ffffff', border: '1px solid #e4e4e7', borderRadius: 8, color: '#09090b', fontSize: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
                      cursor={{ stroke: '#71717a', strokeWidth: 1, strokeDasharray: '4 4' }}
                    />
                    <Area type="monotone" dataKey="kg" stroke="#18181b" strokeWidth={2} fill="url(#procGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="tom-card bg-white border border-zinc-200 rounded-xl shadow-sm">
              <CardHeader
                title="🏷️ Bag Stock by Grade"
                subtitle="Current warehouse distribution (Section 8.7)"
              />
              <div className="px-4 py-5">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={stockByGrade} barSize={28}>
                    <XAxis dataKey="grade" tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ background: '#ffffff', border: '1px solid #e4e4e7', borderRadius: 8, color: '#09090b', fontSize: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
                      cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                    />
                    <Bar dataKey="bags" fill="#18181b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Approvals + Activity Feed */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white border border-zinc-200 rounded-xl shadow-sm">
              <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200/80">
                <div>
                  <h3 className="font-semibold text-zinc-950 text-base">✅ Actionable Pending Approvals</h3>
                  <p className="text-xs text-zinc-500 mt-0.5">Section 2.3: Admin is the supreme financial & employment authority</p>
                </div>
                {approvals.length > 0 && (
                  <span className="badge badge-warning">{approvals.length} pending</span>
                )}
              </div>
              <div className="divide-y divide-zinc-100">
                {approvals.length === 0 ? (
                  <div className="p-8 text-center text-sm text-zinc-500">
                    🎉 All operational tasks and approvals are up to date!
                  </div>
                ) : (
                  approvals.map(a => (
                    <div key={a.id} className="flex items-center justify-between px-6 py-4 hover:bg-zinc-50/70 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="w-9 h-9 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center text-lg">{a.icon}</span>
                        <div>
                          <p className="text-sm font-semibold text-zinc-900">{a.type}</p>
                          <p className="text-xs text-zinc-500">{a.desc}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleApprovalAction(a.id, a.action)}
                        className="btn-primary text-xs px-3.5 py-1.5 shadow-sm"
                      >
                        {a.action}
                      </button>
                    </div>
                  ))
                )}
              </div>
            </Card>

            <Card className="bg-white border border-zinc-200 rounded-xl shadow-sm">
              <CardHeader title="🕐 Live Mill Activity Feed" subtitle="Traceable domain events in the last 24 hours" />
              <div className="divide-y divide-zinc-100">
                {[
                  { color: 'bg-amber-500', text: 'Procurement requirement created: Cotton Seed 5,000 kg', time: '2 min ago' },
                  { color: 'bg-emerald-500', text: 'Electronic weighment slip issued: WB-260926-001 (16.3t net)', time: '12 min ago' },
                  { color: 'bg-blue-500', text: 'B2B Order placed: Heritage Foods — 200 bags cake', time: '28 min ago' },
                  { color: 'bg-amber-500', text: 'Expeller #1 runtime reached: 112°C normal operation', time: '35 min ago' },
                  { color: 'bg-emerald-500', text: 'Disbursed September salary advances to 4 operators', time: '1 hr ago' },
                  { color: 'bg-indigo-500', text: 'Quality lab approval: Lot #TUR-001 moisture 7.8% (Passed)', time: '2 hr ago' },
                ].map((a, i) => (
                  <div key={i} className="flex items-start gap-3 px-6 py-3.5 hover:bg-zinc-50/70 transition-colors">
                    <div className={`w-2 h-2 rounded-full ${a.color} mt-1.5 flex-shrink-0 shadow-xs`} />
                    <div className="flex-1">
                      <p className="text-sm text-zinc-800">{a.text}</p>
                      <p className="text-xs text-zinc-400 mt-0.5">{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </>
      )}

      {/* ============================================================== */}
      {/* VIEW 2: FIELD OFFICER OPERATIONS (Section 6.3 & 24) */}
      {/* ============================================================== */}
      {activeRoleView === 'FIELD_OFFICER' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-surface-1 border border-white/[0.07]">
              <p className="text-xs text-zinc-400">Assigned Inspections</p>
              <p className="text-xl font-bold text-amber-400 mt-1">2 Pending</p>
              <p className="text-[11px] text-zinc-500 mt-0.5">Section 8.7 Lab grading</p>
            </div>
            <div className="p-4 rounded-xl bg-surface-1 border border-white/[0.07]">
              <p className="text-xs text-zinc-400">Active Deals in Yard</p>
              <p className="text-xl font-bold text-white mt-1">3 Deals</p>
              <p className="text-[11px] text-zinc-500 mt-0.5">Under 24h delivery window</p>
            </div>
            <div className="p-4 rounded-xl bg-surface-1 border border-white/[0.07]">
              <p className="text-xs text-zinc-400">FO Negotiation Ceiling</p>
              <p className="text-xl font-bold text-emerald-400 mt-1">±₹3.00/kg</p>
              <p className="text-[11px] text-zinc-500 mt-0.5">Beyond cap: Escalate to Admin</p>
            </div>
            <div className="p-4 rounded-xl bg-surface-1 border border-white/[0.07]">
              <p className="text-xs text-zinc-400">Pickup Authorizations</p>
              <p className="text-xl font-bold text-indigo-400 mt-1">1 Vehicle</p>
              <p className="text-[11px] text-zinc-500 mt-0.5">Section 11.5 Loading verify</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Deals & Price Limit Queue */}
            <Card>
              <CardHeader
                title="🌾 Procurement Deals & Quality Decisions"
                subtitle="Field Officer authority: Grade assignment, Price decisions within cap, Escalation"
              />
              <div className="divide-y divide-white/[0.05]">
                {fieldDeals.map(d => (
                  <div key={d.id} className="p-4 flex items-center justify-between hover:bg-white/[0.02]">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white text-sm">{d.supplier}</span>
                        <Badge variant={d.status === 'ACCEPTED' ? 'success' : d.status === 'ESCALATED' ? 'danger' : 'warning'}>
                          {d.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-zinc-400 mt-1">
                        {d.commodity} • {d.qty.toLocaleString()} kg @ ₹{d.rate}/kg
                      </p>
                      <p className="text-[11px] text-zinc-500 mt-0.5">Lab Inspection: {d.inspection}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {d.status === 'ESCALATED' ? (
                        <span className="text-xs text-red-400 font-semibold px-2.5 py-1 rounded bg-red-500/10 border border-red-500/20">
                          Awaiting Admin Signoff
                        </span>
                      ) : (
                        <button
                          onClick={() => toast.success(`Quality inspection form loaded for ${d.id}`)}
                          className="btn-secondary text-xs py-1.5 px-3"
                        >
                          Grade / Inspect
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Section 11.5 Loading Verification */}
            <Card>
              <CardHeader
                title="🚛 Customer Pickup Loading Verification"
                subtitle="Section 11.5: Inventory cannot be deducted until Field Officer verifies physical count"
              />
              <div className="p-4 space-y-3">
                <div className="p-4 rounded-xl bg-surface-2 border border-white/[0.06] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white text-sm">AP 21 TY 4521 — Heritage Foods</p>
                      <p className="text-xs text-zinc-400 mt-0.5">Order ORD-2026-104 (Cotton Oil Cake)</p>
                    </div>
                    <Badge variant="warning">Loading Completed by Worker</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs p-3 rounded-lg bg-surface-3">
                    <div>
                      <span className="text-zinc-500">Recorded by Senior Worker:</span>
                      <p className="font-bold text-white text-sm">200 bags (10,000 kg)</p>
                    </div>
                    <div>
                      <span className="text-zinc-500">Physical Seal Check:</span>
                      <p className="font-bold text-emerald-400 text-sm">Intact & Weighed</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleVerifyLoading('LOAD-01')}
                    className="btn-primary w-full text-xs py-2.5 flex items-center justify-center gap-2 shadow-sm"
                  >
                    <CheckCircle2 size={16} />
                    Sign & Authorize Inventory Deduction (Field Officer Signoff)
                  </button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* VIEW 3: SENIOR WORKER FLOOR COCKPIT (Section 6.4 & 24) */}
      {/* ============================================================== */}
      {activeRoleView === 'SENIOR_WORKER' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-surface-1 border border-white/[0.07]">
              <p className="text-xs text-zinc-400">Floor Workers on Shift</p>
              <p className="text-xl font-bold text-white mt-1">8 Present</p>
              <p className="text-[11px] text-zinc-500 mt-0.5">Day Shift (08:00 - 18:00)</p>
            </div>
            <div className="p-4 rounded-xl bg-surface-1 border border-white/[0.07]">
              <p className="text-xs text-zinc-400">Active Heavy Expellers</p>
              <p className="text-xl font-bold text-emerald-400 mt-1">2 Running</p>
              <p className="text-[11px] text-emerald-500/80 mt-0.5">Temp 112°C • 1,250 kg/h</p>
            </div>
            <div className="p-4 rounded-xl bg-surface-1 border border-white/[0.07]">
              <p className="text-xs text-zinc-400">Loading / Unloading</p>
              <p className="text-xl font-bold text-amber-400 mt-1">2 Vehicles</p>
              <p className="text-[11px] text-zinc-500 mt-0.5">Yard bays 1 & 2</p>
            </div>
            <div className="p-4 rounded-xl bg-surface-1 border border-white/[0.07]">
              <p className="text-xs text-zinc-400">Standard Packaging Unit</p>
              <p className="text-xl font-bold text-indigo-400 mt-1">50 kg / bag</p>
              <p className="text-[11px] text-zinc-500 mt-0.5">Section 8.6 Standard</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Shift Worker Assignment Board */}
            <Card>
              <CardHeader
                title="👷 Plant Floor Worker Management"
                subtitle="Senior Worker role: Physical execution, worker assignment, task supervision"
              />
              <div className="divide-y divide-white/[0.05]">
                {[
                  { name: 'N. Venkata Rao', role: 'Expeller Master', task: 'Feed hopper monitoring (EXP-01)', status: 'ACTIVE' },
                  { name: 'M. Shiva Reddy', role: 'Boiler Tech', task: 'Husk steam pressure maintain (10 bar)', status: 'ACTIVE' },
                  { name: 'G. Apparao', role: 'Loading Staff', task: 'Customer truck bag loading (AP 21 TY 4521)', status: 'IN_PROGRESS' },
                  { name: 'Raju Sharma (Temp)', role: 'Bagging Staff', task: '50kg seed bag stitching & tagging', status: 'IN_PROGRESS' },
                ].map((w, idx) => (
                  <div key={idx} className="p-4 flex items-center justify-between hover:bg-white/[0.02]">
                    <div>
                      <p className="text-sm font-semibold text-white">{w.name}</p>
                      <p className="text-xs text-zinc-400">{w.role} • {w.task}</p>
                    </div>
                    <Badge variant={w.status === 'ACTIVE' ? 'success' : 'brand'}>
                      {w.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>

            {/* Loading / Unloading Physical Count Recorder */}
            <Card>
              <CardHeader
                title="📦 Physical Loading Count Recorder"
                subtitle="Senior Worker records physical bags loaded before FO signoff"
              />
              <div className="p-4 space-y-4">
                <div className="p-4 rounded-xl bg-surface-2 border border-white/[0.06] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white text-sm">Vehicle: AP 21 TY 4521</p>
                      <p className="text-xs text-zinc-400">Customer Pickup (Heritage Foods)</p>
                    </div>
                    <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded">200 Bags Target</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      defaultValue={200}
                      className="input-field text-center font-bold text-lg w-28"
                      disabled
                    />
                    <div className="text-xs text-zinc-400">
                      Standard 50kg bags verified physically onto truck bay.
                    </div>
                  </div>

                  <button
                    onClick={() => toast.success('Loading count transmitted to Field Officer for signoff!')}
                    className="btn-secondary w-full text-xs py-2 flex items-center justify-center gap-1.5"
                  >
                    Transmit Count to Field Officer
                  </button>
                </div>

                <button
                  onClick={() => toast.error('Floor incident reported to Plant Manager!')}
                  className="w-full py-2.5 px-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 text-xs font-semibold hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2"
                >
                  <AlertTriangle size={15} />
                  Report Floor Issue / Machine Breakdown (Section 6.4)
                </button>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* VIEW 4: SALES EXECUTIVE HUB (Section 6.7, 11 & 24) */}
      {/* ============================================================== */}
      {activeRoleView === 'SALES' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-surface-1 border border-white/[0.07]">
              <p className="text-xs text-zinc-400">Active B2B Enquiries</p>
              <p className="text-xl font-bold text-amber-400 mt-1">5 Leads</p>
              <p className="text-[11px] text-zinc-500 mt-0.5">Section 11.2 Inbound/Outbound</p>
            </div>
            <div className="p-4 rounded-xl bg-surface-1 border border-white/[0.07]">
              <p className="text-xs text-zinc-400">Orders in Dispatch</p>
              <p className="text-xl font-bold text-white mt-1">3 Orders</p>
              <p className="text-[11px] text-zinc-500 mt-0.5">Reserved inventory</p>
            </div>
            <div className="p-4 rounded-xl bg-surface-1 border border-white/[0.07]">
              <p className="text-xs text-zinc-400">Cash Waiting Admin Count</p>
              <p className="text-xl font-bold text-red-400 mt-1">₹45,000</p>
              <p className="text-[11px] text-red-500/80 mt-0.5">Section 11.9 Reconciliation</p>
            </div>
            <div className="p-4 rounded-xl bg-surface-1 border border-white/[0.07]">
              <p className="text-xs text-zinc-400">Customer Receivables</p>
              <p className="text-xl font-bold text-emerald-400 mt-1">₹25.8 L</p>
              <p className="text-[11px] text-zinc-500 mt-0.5">15-20 days target cycle</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales Cash Reconciliation Handover (Section 11.8 & 11.9) */}
            <Card>
              <CardHeader
                title="💵 Cash Handover & Admin Reconciliation"
                subtitle="Section 11.8: Customer outstanding does NOT reduce until Admin verifies physical cash"
              />
              <div className="divide-y divide-white/[0.05]">
                {cashHandovers.map(ch => (
                  <div key={ch.id} className="p-4 flex items-center justify-between hover:bg-white/[0.02]">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white text-sm">{ch.customer}</span>
                        <span className="font-mono font-bold text-amber-400">₹{ch.amount.toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-0.5">Collected at: {ch.collectedAt}</p>
                      <p className="text-[11px] text-zinc-500 mt-0.5">{ch.handedTo}</p>
                    </div>

                    <div>
                      {ch.verified ? (
                        <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full font-medium inline-flex items-center gap-1">
                          <CheckCircle2 size={12} />
                          Admin Verified
                        </span>
                      ) : (
                        <button
                          onClick={() => handleHandoverCash(ch.id)}
                          className="btn-primary text-xs py-1.5 px-3"
                        >
                          Hand Cash to Admin
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* B2B Orders Pipeline */}
            <Card>
              <CardHeader
                title="📑 B2B Sales Orders in Progress"
                subtitle="Section 11.3: Negotiation → Reserved → Loading → FO Verification → Invoice"
              />
              <div className="divide-y divide-white/[0.05]">
                {[
                  { code: 'ORD-2026-104', cust: 'Heritage Foods', product: 'Cotton Oil Cake', bags: 200, status: 'LOADING_VERIFIED' },
                  { code: 'ORD-2026-105', cust: 'Tirupati Refineries', product: 'Crude Cotton Oil', bags: 'Tanker 12t', status: 'STOCK_RESERVED' },
                  { code: 'ORD-2026-106', cust: 'Kaveri Feeds', product: 'Sunflower Meal', bags: 150, status: 'CREDIT_APPROVED' },
                ].map(o => (
                  <div key={o.code} className="p-4 flex items-center justify-between hover:bg-white/[0.02]">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-amber-400 font-semibold">{o.code}</span>
                        <span className="text-sm font-semibold text-white">{o.cust}</span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-1">{o.product} • {o.bags} bags</p>
                    </div>
                    <Badge variant={o.status === 'LOADING_VERIFIED' ? 'success' : 'info'}>
                      {o.status.replace('_', ' ')}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* VIEW 5: OFFICE EMPLOYEE COORDINATION (Section 6.2 & 24) */}
      {/* ============================================================== */}
      {activeRoleView === 'OFFICE_EMPLOYEE' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-surface-1 border border-white/[0.07]">
              <p className="text-xs text-zinc-400">Assigned Field Tasks</p>
              <p className="text-xl font-bold text-white mt-1">6 Active</p>
              <p className="text-[11px] text-zinc-500 mt-0.5">3 Field Officers on road</p>
            </div>
            <div className="p-4 rounded-xl bg-surface-1 border border-white/[0.07]">
              <p className="text-xs text-zinc-400">Senior Worker Shifts</p>
              <p className="text-xl font-bold text-emerald-400 mt-1">2 Shifts</p>
              <p className="text-[11px] text-zinc-500 mt-0.5">Expeller Plant & Yard</p>
            </div>
            <div className="p-4 rounded-xl bg-surface-1 border border-white/[0.07]">
              <p className="text-xs text-zinc-400">Staff Attendance</p>
              <p className="text-xl font-bold text-indigo-400 mt-1">12 / 14</p>
              <p className="text-[11px] text-zinc-500 mt-0.5">2 on planned leave</p>
            </div>
            <div className="p-4 rounded-xl bg-surface-1 border border-white/[0.07]">
              <p className="text-xs text-zinc-400">Supplier Enquiries</p>
              <p className="text-xl font-bold text-amber-400 mt-1">4 Enquiries</p>
              <p className="text-[11px] text-zinc-500 mt-0.5">Maize & cotton harvest</p>
            </div>
          </div>

          <Card>
            <CardHeader
              title="📋 Operational Dispatch & Task Progress"
              subtitle="Office Employee role: Coordinate operations, monitor tasks, support field hierarchy"
            />
            <div className="p-4">
              <div className="divide-y divide-white/[0.05]">
                {[
                  { task: 'Field Inspection at Sattenapalli Yard', assignee: 'K. Ramesh (FO)', status: 'IN_TRANSIT', time: 'Started 09:15 AM' },
                  { task: 'Yard Loading Supervision Bay 2', assignee: 'N. Venkata Rao (Senior Worker)', status: 'ACTIVE', time: 'In progress' },
                  { task: 'Customer Credit Ledger Check', assignee: 'K. Lakshmi (Office)', status: 'COMPLETED', time: '10:30 AM' },
                ].map((t, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white">{t.task}</p>
                      <p className="text-xs text-zinc-400 mt-0.5">Assigned to: {t.assignee} • {t.time}</p>
                    </div>
                    <Badge variant={t.status === 'COMPLETED' ? 'success' : 'warning'}>
                      {t.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Warehouse Inventory Stock Summary (Visible across views) */}
      <Card>
        <CardHeader
          title="🏭 Warehouse Inventory Stock & Batch Valuation"
          subtitle="Section 9.7: Real-time bag count, physical weight, and dynamic effective cost per kg"
          action={
            <span className="text-xs text-zinc-400">
              {batches.length > 0 ? `${batches.length} Active Batches` : 'Sample Batches'}
            </span>
          }
        />
        <div className="overflow-x-auto">
          <table className="tom-table">
            <thead>
              <tr>
                <th>Batch Code</th>
                <th>Commodity</th>
                <th>Grade</th>
                <th>Location</th>
                <th className="text-right">Bags</th>
                <th className="text-right">Weight (kg)</th>
                <th className="text-right">Eff. Cost / kg</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {(batches.length > 0 ? batches : [
                { batchCode: 'TUR-260926-001', commodity: 'Raw Cotton Seed', grade: 'A+', roomSection: 'Warehouse 1 — Room A', bags: 120, totalKg: 6000, costPerKg: 125, status: 'IN_STOCK' },
                { batchCode: 'TUR-260926-002', commodity: 'Raw Cotton Seed', grade: 'A', roomSection: 'Warehouse 1 — Room B', bags: 80, totalKg: 4000, costPerKg: 118, status: 'IN_STOCK' },
                { batchCode: 'SUN-260926-001', commodity: 'Sunflower Seed', grade: 'A', roomSection: 'Warehouse 1 — Room C', bags: 200, totalKg: 10000, costPerKg: 72, status: 'IN_STOCK' },
                { batchCode: 'CAK-260926-001', commodity: 'Cotton Oil Cake', grade: 'Standard', roomSection: 'Warehouse 2 — Room A', bags: 400, totalKg: 20000, costPerKg: 31, status: 'IN_STOCK' },
              ]).map((r) => (
                <tr key={r.batchCode || r.id}>
                  <td className="font-mono text-xs text-amber-400 font-semibold">{r.batchCode}</td>
                  <td className="font-semibold text-white">{r.commodity}</td>
                  <td>
                    <Badge variant={r.grade === 'A+' ? 'success' : r.grade === 'A' ? 'info' : r.grade === 'B' ? 'warning' : 'muted'}>
                      {r.grade}
                    </Badge>
                  </td>
                  <td className="text-zinc-400">{r.roomSection || (r.warehouse ? r.warehouse.name : 'Main Bay')}</td>
                  <td className="text-right font-mono text-zinc-200">{Number(r.bags).toLocaleString('en-IN')}</td>
                  <td className="text-right font-mono text-zinc-200">{Number(r.totalKg).toLocaleString('en-IN')}</td>
                  <td className="text-right font-mono font-bold text-amber-300">₹{Number(r.costPerKg).toFixed(2)}</td>
                  <td>
                    <Badge variant={r.status === 'IN_STOCK' ? 'success' : 'warning'}>
                      {r.status?.replace('_', ' ')}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

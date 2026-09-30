import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useOperationalData } from '../../context/OperationalDataContext'
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
  FileText, ShieldAlert, Sparkles, AlertCircle, CheckCircle2, ChevronRight,
  Boxes, Shield, Layers, Calendar, BarChart2, HardHat, ArrowRight
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
  const {
    batches = [],
    loadingDocket,
    cashHandovers,
    deals: opDeals,
    tempApps,
    customers,
    cashBalance,
    totalStockKg,
    totalReceivables,
    updateLoadingDocketCount,
    transmitLoadingDocketToFO,
    verifyAndSignLoadingDeduction,
    verifyCashHandover,
    approveEscalatedDeal,
    approveTempWorker
  } = useOperationalData()

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
    openOrdersCount: 3,
    todayProcurementKg: 55100,
  })

  // Dynamic Live Approvals queue combining all cross-role queues
  const pendingApprovals = [
    ...tempApps.filter(t => t.status === 'PENDING').map(t => ({
      id: `temp-${t.id}`,
      originalId: t.id,
      category: 'TEMP_WORKER',
      type: 'Temp Worker Application',
      icon: <Users className="w-4 h-4 text-zinc-900" />,
      desc: `${t.name} — ${t.role} (${t.phone})`,
      action: 'Approve & Issue Badge',
      handler: () => approveTempWorker(t.id)
    })),
    ...cashHandovers.filter(c => !c.verified).map(c => ({
      id: `cash-${c.id}`,
      originalId: c.id,
      category: 'CASH_HANDOVER',
      type: 'Cash Handover (Rule 7)',
      icon: <DollarSign className="w-4 h-4 text-zinc-900" />,
      desc: `₹${c.amount.toLocaleString('en-IN')} cash from ${c.salesPerson} (${c.customer})`,
      action: 'Verify Physical Count',
      handler: () => verifyCashHandover(c.id)
    })),
    ...opDeals.filter(d => d.escalated).map(d => ({
      id: `deal-${d.id}`,
      originalId: d.id,
      category: 'ESCALATION',
      type: 'Procurement Rate Escalation',
      icon: <Package className="w-4 h-4 text-zinc-900" />,
      desc: `${d.commodity} (${d.qty.toLocaleString()} kg) — Rate ₹${d.agreedPrice} exceeds FO cap`,
      action: 'Approve Exception Rate',
      handler: () => approveEscalatedDeal(d.id)
    }))
  ]

  useEffect(() => {
    Promise.all([
      inventoryApi.batches().catch(() => ({ data: { data: [] } })),
      workforceApi.employees().catch(() => ({ data: { data: [] } })),
      salesApi.customers().catch(() => ({ data: { data: [] } })),
      salesApi.orders().catch(() => ({ data: { data: [] } }))
    ]).then(([batchesRes, employeesRes, custRes, ordersRes]) => {
      const eList = employeesRes.data?.data || []
      const oList = ordersRes.data?.data || []

      setStats(prev => ({
        ...prev,
        workerCount: eList.length > 0 ? eList.length : prev.workerCount,
        openOrdersCount: oList.length > 0 ? oList.length : prev.openOrdersCount,
      }))
    }).finally(() => setLoading(false))
  }, [])

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
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                    activeRoleView === r
                      ? 'bg-zinc-950 text-white shadow-sm font-semibold'
                      : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/50'
                  }`}
                >
                  {r.replace('_', ' ')}
                </button>
              ))}
            </div>
          )}

          <span className="flex items-center gap-2 text-xs text-zinc-900 bg-white border border-zinc-200 px-3 py-1 rounded-full font-semibold shadow-sm">
            <span className="w-2 h-2 bg-zinc-950 rounded-full animate-pulse" />
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
              icon={<Package className="w-4 h-4" />}
              label="Today's Inflow"
              value={`${(stats.todayProcurementKg / 1000).toFixed(1)} t`}
              sub="Weighbridge receipts"
            />
            <StatCard
              icon={<Truck className="w-4 h-4" />}
              label="Total Stock"
              value={`${(totalStockKg / 1000).toFixed(1)} t`}
              sub="Stored in warehouses"
            />
            <StatCard
              icon={<FileText className="w-4 h-4" />}
              label="Open B2B Orders"
              value={`${stats.openOrdersCount} Orders`}
              sub="Pending dispatch"
            />
            <StatCard
              icon={<DollarSign className="w-4 h-4" />}
              label="Receivables"
              value={formatLakhs(totalReceivables)}
              sub="Customer ledger"
            />
            <StatCard
              icon={<Users className="w-4 h-4" />}
              label="Active Staff"
              value={`${stats.workerCount} Active`}
              sub="On mill payroll"
            />
            <StatCard
              icon={<Scale className="w-4 h-4" />}
              label="Working Capital"
              value={formatLakhs(cashBalance)}
              sub="Current liquidity"
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 tom-card bg-white border border-zinc-200 rounded-xl shadow-sm">
              <CardHeader
                title={
                  <span className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-zinc-900" />
                    Weekly Procurement Rate
                  </span>
                }
                subtitle="Raw cotton & sunflower seed receipts (kg/day)"
              />
              <div className="px-4 py-5">
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={procurementTrend}>
                    <defs>
                      <linearGradient id="procGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#09090b" stopOpacity={0.12} />
                        <stop offset="95%" stopColor="#09090b" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ background: '#ffffff', border: '1px solid #e4e4e7', borderRadius: 8, color: '#09090b', fontSize: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
                      cursor={{ stroke: '#71717a', strokeWidth: 1, strokeDasharray: '4 4' }}
                    />
                    <Area type="monotone" dataKey="kg" stroke="#09090b" strokeWidth={2} fill="url(#procGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="tom-card bg-white border border-zinc-200 rounded-xl shadow-sm">
              <CardHeader
                title={
                  <span className="flex items-center gap-2">
                    <Boxes className="w-4 h-4 text-zinc-900" />
                    Bag Stock by Grade
                  </span>
                }
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
                    <Bar dataKey="bags" fill="#09090b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Approvals + Activity Feed */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white border border-zinc-200 rounded-xl shadow-sm">
              <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200/80 bg-zinc-50/50 rounded-t-xl">
                <div>
                  <h3 className="font-semibold text-zinc-950 text-base flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-zinc-900" />
                    Actionable Pending Approvals
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5">Section 2.3: Admin is the supreme financial & employment authority</p>
                </div>
                {pendingApprovals.length > 0 && (
                  <Badge variant="warning">{pendingApprovals.length} pending</Badge>
                )}
              </div>
              <div className="divide-y divide-zinc-100">
                {pendingApprovals.length === 0 ? (
                  <div className="p-8 text-center text-sm text-zinc-500">
                    All operational tasks and approvals are up to date across all portals.
                  </div>
                ) : (
                  pendingApprovals.map(a => (
                    <div key={a.id} className="flex items-center justify-between px-6 py-4 hover:bg-zinc-50/70 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-900">{a.icon}</span>
                        <div>
                          <p className="text-sm font-semibold text-zinc-900">{a.type}</p>
                          <p className="text-xs text-zinc-500">{a.desc}</p>
                        </div>
                      </div>
                      <button
                        onClick={a.handler}
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
              <CardHeader 
                title={
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-zinc-900" />
                    Live Mill Activity Feed
                  </span>
                } 
                subtitle="Traceable domain events in the last 24 hours" 
              />
              <div className="divide-y divide-zinc-100">
                {[
                  { dot: 'bg-zinc-950', text: 'Procurement requirement created: Cotton Seed 5,000 kg', time: '2 min ago' },
                  { dot: 'bg-zinc-800', text: 'Electronic weighment slip issued: WB-260926-001 (16.3t net)', time: '12 min ago' },
                  { dot: 'bg-zinc-600', text: 'B2B Order placed: Heritage Foods — 200 bags cake', time: '28 min ago' },
                  { dot: 'bg-zinc-900', text: 'Expeller #1 runtime reached: 112°C normal operation', time: '35 min ago' },
                  { dot: 'bg-zinc-700', text: 'Disbursed September salary advances to 4 operators', time: '1 hr ago' },
                  { dot: 'bg-zinc-500', text: 'Quality lab approval: Lot #TUR-001 moisture 7.8% (Passed)', time: '2 hr ago' },
                ].map((a, i) => (
                  <div key={i} className="flex items-start gap-3 px-6 py-3.5 hover:bg-zinc-50/70 transition-colors">
                    <div className={`w-2 h-2 rounded-full ${a.dot} mt-1.5 flex-shrink-0 shadow-sm`} />
                    <div className="flex-1">
                      <p className="text-sm text-zinc-900 font-medium">{a.text}</p>
                      <p className="text-xs text-zinc-400 font-mono mt-0.5">{a.time}</p>
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
            <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-sm">
              <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Assigned Inspections</p>
              <p className="text-xl font-bold text-zinc-950 font-mono mt-1">2 Pending</p>
              <p className="text-[11px] text-zinc-400 mt-0.5">Section 8.7 Lab grading</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-sm">
              <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Active Deals in Yard</p>
              <p className="text-xl font-bold text-zinc-950 font-mono mt-1">3 Deals</p>
              <p className="text-[11px] text-zinc-400 mt-0.5">Under 24h delivery window</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-sm">
              <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">FO Negotiation Ceiling</p>
              <p className="text-xl font-bold text-zinc-950 font-mono mt-1">±₹3.00/kg</p>
              <p className="text-[11px] text-zinc-400 mt-0.5">Beyond cap: Escalate to Admin</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-sm">
              <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Pickup Authorizations</p>
              <p className="text-xl font-bold text-zinc-950 font-mono mt-1">1 Vehicle</p>
              <p className="text-[11px] text-zinc-400 mt-0.5">Section 11.5 Loading verify</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Deals & Price Limit Queue */}
            <Card>
              <CardHeader
                title={
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-zinc-900" />
                    Procurement Deals & Quality Decisions
                  </span>
                }
                subtitle="Field Officer authority: Grade assignment, Price decisions within cap, Escalation"
              />
              <div className="divide-y divide-zinc-100">
                {opDeals.map(d => (
                  <div key={d.id} className="p-4 flex items-center justify-between hover:bg-zinc-50/70 transition-colors">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-zinc-900 text-sm">{d.supplier}</span>
                        <Badge variant={d.status === 'ACCEPTED' ? 'success' : d.status === 'ESCALATED' ? 'danger' : 'warning'}>
                          {d.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-zinc-500 mt-1">
                        {d.commodity} • {d.qty.toLocaleString()} kg @ ₹{d.agreedPrice || d.targetPrice}/kg
                      </p>
                      <p className="text-[11px] text-zinc-400 mt-0.5">Lab Inspection: {d.inspection} • {d.deliveryWindowRemaining}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {d.status === 'ESCALATED' ? (
                        <Badge variant="danger">
                          Awaiting Admin Signoff
                        </Badge>
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
                title={
                  <span className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-zinc-900" />
                    Customer Pickup Loading Verification (Rule 6)
                  </span>
                }
                subtitle="Section 11.5: Inventory cannot be deducted until Field Officer verifies physical count"
              />
              <div className="p-4 space-y-3">
                <div className="p-4 rounded-xl bg-zinc-50/60 border border-zinc-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-zinc-950 text-sm">{loadingDocket.vehicle} — {loadingDocket.client}</p>
                      <p className="text-xs text-zinc-500 mt-0.5">Order {loadingDocket.orderId} ({loadingDocket.commodity})</p>
                    </div>
                    <Badge variant={loadingDocket.status === 'VERIFIED_BY_FO' ? 'success' : 'warning'}>
                      {loadingDocket.status === 'VERIFIED_BY_FO' ? 'Verified & Deducted' : 'Loading Recorded by Senior Worker'}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs p-3 rounded-lg bg-white border border-zinc-200">
                    <div>
                      <span className="text-zinc-500">Recorded by Senior Worker:</span>
                      <p className="font-bold text-zinc-900 font-mono text-sm">{loadingDocket.currentCount} bags ({(loadingDocket.currentCount * 50).toLocaleString()} kg)</p>
                    </div>
                    <div>
                      <span className="text-zinc-500">Physical Seal Check:</span>
                      <p className="font-bold text-zinc-900 font-mono text-sm">{loadingDocket.sealNumber}</p>
                    </div>
                  </div>

                  {loadingDocket.status === 'VERIFIED_BY_FO' ? (
                    <div className="p-3 bg-zinc-100 rounded-lg text-xs text-zinc-800 flex items-center justify-between">
                      <span className="font-semibold">Signoff Complete by: {loadingDocket.foSign}</span>
                      <span className="text-zinc-500">{loadingDocket.verifiedAt}</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => verifyAndSignLoadingDeduction('K. Ramesh (Field Officer)')}
                      className="btn-primary w-full text-xs py-2.5 flex items-center justify-center gap-2 shadow-sm"
                    >
                      <CheckCircle2 size={16} />
                      Sign & Authorize Inventory Deduction (Field Officer Signoff)
                    </button>
                  )}
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
          {/* Dedicated Senior Worker & Floor Operations Hub Launch Banner */}
          <div className="p-5 rounded-2xl bg-zinc-950 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm border border-zinc-900">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white flex-shrink-0">
                <HardHat size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-white tracking-tight">Senior Worker & Floor Operations Module</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white text-zinc-950 uppercase tracking-wider">Dedicated Module</span>
                </div>
                <p className="text-xs text-zinc-300 mt-1">
                  Interactive "What Worker Needs to Do" shift checklists, physical bag loading counter (Rule 6), and expeller telemetry.
                </p>
              </div>
            </div>
            <Link
              to="/floor-operations"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white text-zinc-950 text-xs font-bold hover:bg-zinc-100 transition-all active:scale-[0.98] shadow-sm flex-shrink-0"
            >
              <span>Open Floor Tasks Module</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-sm">
              <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Floor Workers on Shift</p>
              <p className="text-xl font-bold text-zinc-950 font-mono mt-1">8 Present</p>
              <p className="text-[11px] text-zinc-400 mt-0.5">Day Shift (08:00 - 18:00)</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-sm">
              <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Active Heavy Expellers</p>
              <p className="text-xl font-bold text-zinc-950 font-mono mt-1">2 Running</p>
              <p className="text-[11px] text-zinc-400 mt-0.5">Temp 112°C • 1,250 kg/h</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-sm">
              <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Loading / Unloading</p>
              <p className="text-xl font-bold text-zinc-950 font-mono mt-1">2 Vehicles</p>
              <p className="text-[11px] text-zinc-400 mt-0.5">Yard bays 1 & 2</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-sm">
              <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Standard Packaging Unit</p>
              <p className="text-xl font-bold text-zinc-950 font-mono mt-1">50 kg / bag</p>
              <p className="text-[11px] text-zinc-400 mt-0.5">Section 8.6 Standard</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Shift Worker Assignment Board */}
            <Card>
              <CardHeader
                title={
                  <span className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-zinc-900" />
                    Plant Floor Worker Management
                  </span>
                }
                subtitle="Senior Worker role: Physical execution, worker assignment, task supervision"
              />
              <div className="divide-y divide-zinc-100">
                {[
                  { name: 'N. Venkata Rao', role: 'Expeller Master', task: 'Feed hopper monitoring (EXP-01)', status: 'ACTIVE' },
                  { name: 'M. Shiva Reddy', role: 'Boiler Tech', task: 'Husk steam pressure maintain (10 bar)', status: 'ACTIVE' },
                  { name: 'G. Apparao', role: 'Loading Staff', task: 'Customer truck bag loading (AP 21 TY 4521)', status: 'IN_PROGRESS' },
                  { name: 'Raju Sharma (Temp)', role: 'Bagging Staff', task: '50kg seed bag stitching & tagging', status: 'IN_PROGRESS' },
                ].map((w, idx) => (
                  <div key={idx} className="p-4 flex items-center justify-between hover:bg-zinc-50/70 transition-colors">
                    <div>
                      <p className="text-sm font-semibold text-zinc-900">{w.name}</p>
                      <p className="text-xs text-zinc-500">{w.role} • {w.task}</p>
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
                title={
                  <span className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-zinc-900" />
                    Physical Loading Count Recorder
                  </span>
                }
                subtitle="Senior Worker records physical bags loaded before FO signoff"
              />
              <div className="p-4 space-y-4">
                <div className="p-4 rounded-xl bg-zinc-50/60 border border-zinc-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-zinc-950 text-sm">Vehicle: {loadingDocket.vehicle}</p>
                      <p className="text-xs text-zinc-500">{loadingDocket.client} ({loadingDocket.orderId})</p>
                    </div>
                    <Badge variant={loadingDocket.status === 'VERIFIED_BY_FO' ? 'success' : 'brand'}>
                      {loadingDocket.status === 'VERIFIED_BY_FO' ? 'Deduction Signed Off' : `${loadingDocket.targetBags} Bags Target`}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateLoadingDocketCount(-5)}
                        className="px-2 py-1 bg-zinc-100 border border-zinc-200 rounded text-xs font-bold hover:bg-zinc-200 transition-colors"
                      >
                        -5
                      </button>
                      <button
                        onClick={() => updateLoadingDocketCount(-1)}
                        className="px-2 py-1 bg-zinc-100 border border-zinc-200 rounded text-xs font-bold hover:bg-zinc-200 transition-colors"
                      >
                        -1
                      </button>
                      <span className="tom-input text-center font-bold text-lg w-20 font-mono py-1 inline-block">
                        {loadingDocket.currentCount}
                      </span>
                      <button
                        onClick={() => updateLoadingDocketCount(1)}
                        className="px-2 py-1 bg-zinc-100 border border-zinc-200 rounded text-xs font-bold hover:bg-zinc-200 transition-colors"
                      >
                        +1
                      </button>
                      <button
                        onClick={() => updateLoadingDocketCount(5)}
                        className="px-2 py-1 bg-zinc-100 border border-zinc-200 rounded text-xs font-bold hover:bg-zinc-200 transition-colors"
                      >
                        +5
                      </button>
                    </div>
                    <div className="text-xs text-zinc-500">
                      Standard 50kg bags verified physically onto truck bay.
                    </div>
                  </div>

                  <button
                    onClick={transmitLoadingDocketToFO}
                    className="btn-secondary w-full text-xs py-2 flex items-center justify-center gap-1.5"
                  >
                    Transmit Count to Field Officer (Rule 6)
                  </button>
                </div>

                <button
                  onClick={() => toast.error('Floor incident reported to Plant Manager!')}
                  className="w-full py-2.5 px-4 rounded-xl border border-zinc-300 bg-zinc-100 text-zinc-900 text-xs font-semibold hover:bg-zinc-950 hover:text-zinc-950 hover:border-zinc-950 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
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
            <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-sm">
              <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Active B2B Enquiries</p>
              <p className="text-xl font-bold text-zinc-950 font-mono mt-1">5 Leads</p>
              <p className="text-[11px] text-zinc-400 mt-0.5">Section 11.2 Inbound/Outbound</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-sm">
              <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Orders in Dispatch</p>
              <p className="text-xl font-bold text-zinc-950 font-mono mt-1">3 Orders</p>
              <p className="text-[11px] text-zinc-400 mt-0.5">Reserved inventory</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-sm">
              <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Cash Waiting Admin Count</p>
              <p className="text-xl font-bold text-zinc-950 font-mono mt-1">₹45,000</p>
              <p className="text-[11px] text-zinc-400 mt-0.5">Section 11.9 Reconciliation</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-sm">
              <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Customer Receivables</p>
              <p className="text-xl font-bold text-zinc-950 font-mono mt-1">₹25.8 L</p>
              <p className="text-[11px] text-zinc-400 mt-0.5">15-20 days target cycle</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales Cash Reconciliation Handover (Section 11.8 & 11.9) */}
            <Card>
              <CardHeader
                title={
                  <span className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-zinc-900" />
                    Cash Handover & Admin Reconciliation
                  </span>
                }
                subtitle="Section 11.8: Customer outstanding does NOT reduce until Admin verifies physical cash"
              />
              <div className="divide-y divide-zinc-100">
                {cashHandovers.map(ch => (
                  <div key={ch.id} className="p-4 flex items-center justify-between hover:bg-zinc-50/70 transition-colors">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-zinc-900 text-sm">{ch.customer}</span>
                        <span className="font-mono font-bold text-zinc-950">₹{ch.amount.toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-zinc-500 mt-0.5 font-mono">Collected at: {ch.collectedAt}</p>
                      <p className="text-[11px] text-zinc-400 mt-0.5">{ch.handedTo}</p>
                    </div>

                    <div>
                      {ch.verified ? (
                        <Badge variant="success">
                          <CheckCircle2 size={12} className="inline mr-1" />
                          Admin Verified
                        </Badge>
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
                title={
                  <span className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-zinc-900" />
                    B2B Sales Orders in Progress
                  </span>
                }
                subtitle="Section 11.3: Negotiation → Reserved → Loading → FO Verification → Invoice"
              />
              <div className="divide-y divide-zinc-100">
                {[
                  { code: 'ORD-2026-104', cust: 'Heritage Foods', product: 'Cotton Oil Cake', bags: 200, status: 'LOADING_VERIFIED' },
                  { code: 'ORD-2026-105', cust: 'Tirupati Refineries', product: 'Crude Cotton Oil', bags: 'Tanker 12t', status: 'STOCK_RESERVED' },
                  { code: 'ORD-2026-106', cust: 'Kaveri Feeds', product: 'Sunflower Meal', bags: 150, status: 'CREDIT_APPROVED' },
                ].map(o => (
                  <div key={o.code} className="p-4 flex items-center justify-between hover:bg-zinc-50/70 transition-colors">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-zinc-950 font-bold">{o.code}</span>
                        <span className="text-sm font-semibold text-zinc-900">{o.cust}</span>
                      </div>
                      <p className="text-xs text-zinc-500 mt-1">{o.product} • {o.bags} bags</p>
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
            <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-sm">
              <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Assigned Field Tasks</p>
              <p className="text-xl font-bold text-zinc-950 font-mono mt-1">6 Active</p>
              <p className="text-[11px] text-zinc-400 mt-0.5">3 Field Officers on road</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-sm">
              <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Senior Worker Shifts</p>
              <p className="text-xl font-bold text-zinc-950 font-mono mt-1">2 Shifts</p>
              <p className="text-[11px] text-zinc-400 mt-0.5">Expeller Plant & Yard</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-sm">
              <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Staff Attendance</p>
              <p className="text-xl font-bold text-zinc-950 font-mono mt-1">12 / 14</p>
              <p className="text-[11px] text-zinc-400 mt-0.5">2 on planned leave</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-sm">
              <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Supplier Enquiries</p>
              <p className="text-xl font-bold text-zinc-950 font-mono mt-1">4 Enquiries</p>
              <p className="text-[11px] text-zinc-400 mt-0.5">Maize & cotton harvest</p>
            </div>
          </div>

          <Card>
            <CardHeader
              title={
                <span className="flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-zinc-900" />
                  Operational Dispatch & Task Progress
                </span>
              }
              subtitle="Office Employee role: Coordinate operations, monitor tasks, support field hierarchy"
            />
            <div className="p-4">
              <div className="divide-y divide-zinc-100">
                {[
                  { task: 'Field Inspection at Sattenapalli Yard', assignee: 'K. Ramesh (FO)', status: 'IN_TRANSIT', time: 'Started 09:15 AM' },
                  { task: 'Yard Loading Supervision Bay 2', assignee: 'N. Venkata Rao (Senior Worker)', status: 'ACTIVE', time: 'In progress' },
                  { task: 'Customer Credit Ledger Check', assignee: 'K. Lakshmi (Office)', status: 'COMPLETED', time: '10:30 AM' },
                ].map((t, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between hover:bg-zinc-50/70 transition-colors">
                    <div>
                      <p className="text-sm font-semibold text-zinc-900">{t.task}</p>
                      <p className="text-xs text-zinc-500 mt-0.5">Assigned to: {t.assignee} • {t.time}</p>
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
          title={
            <span className="flex items-center gap-2">
              <Package className="w-4 h-4 text-zinc-900" />
              Warehouse Inventory Stock & Batch Valuation
            </span>
          }
          subtitle="Section 9.7: Real-time bag count, physical weight, and dynamic effective cost per kg"
          action={
            <span className="text-xs text-zinc-500 font-mono">
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
              {((batches && batches.length > 0) ? batches : [
                { id: 'TUR-260926-001', batchCode: 'TUR-260926-001', commodity: 'Raw Cotton Seed', grade: 'A+', roomSection: 'Warehouse 1 — Room A', bags: 120, totalKg: 6000, costPerKg: 125, status: 'IN_STOCK' },
                { id: 'TUR-260926-002', batchCode: 'TUR-260926-002', commodity: 'Raw Cotton Seed', grade: 'A', roomSection: 'Warehouse 1 — Room B', bags: 80, totalKg: 4000, costPerKg: 118, status: 'IN_STOCK' },
                { id: 'SUN-260926-001', batchCode: 'SUN-260926-001', commodity: 'Sunflower Seed', grade: 'A', roomSection: 'Warehouse 1 — Room C', bags: 200, totalKg: 10000, costPerKg: 72, status: 'IN_STOCK' },
                { id: 'CAK-260926-001', batchCode: 'CAK-260926-001', commodity: 'Cotton Oil Cake', grade: 'Standard', roomSection: 'Warehouse 2 — Room A', bags: 400, totalKg: 20000, costPerKg: 31, status: 'IN_STOCK' },
              ]).map((r) => {
                const code = r.id || r.batchCode || 'LOT-2609'
                const weight = Number(r.currentKg || r.totalKg || 0)
                const cost = Number(r.effectiveCostPerKg || r.costPerKg || 0)
                const loc = r.room || r.roomSection || (r.warehouse ? (typeof r.warehouse === 'string' ? r.warehouse : r.warehouse.name) : 'Warehouse 1')
                return (
                  <tr key={code}>
                    <td className="font-mono text-xs text-zinc-950 font-bold">{code}</td>
                    <td className="font-semibold text-zinc-900">{r.commodity}</td>
                    <td>
                      <Badge variant={r.grade === 'A+' ? 'success' : r.grade === 'A' ? 'info' : r.grade === 'B' ? 'warning' : 'muted'}>
                        {r.grade}
                      </Badge>
                    </td>
                    <td className="text-zinc-600">{loc}</td>
                    <td className="text-right font-mono text-zinc-900">{Number(r.bags || 0).toLocaleString('en-IN')}</td>
                    <td className="text-right font-mono text-zinc-900">{weight.toLocaleString('en-IN')}</td>
                    <td className="text-right font-mono font-bold text-zinc-950">₹{cost.toFixed(2)}</td>
                    <td>
                      <Badge variant={r.status === 'IN_STOCK' ? 'success' : 'warning'}>
                        {r.status?.replace('_', ' ')}
                      </Badge>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

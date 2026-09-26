import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { StatCard, Card, CardHeader, Badge, StatusBadge, Spinner } from '../../components/ui'
import { authApi, inventoryApi, workforceApi, salesApi, logisticsApi } from '../../api/endpoints'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts'
import toast from 'react-hot-toast'
import { CheckCircle, Clock, AlertTriangle, TrendingUp, ArrowUpRight } from 'lucide-react'

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

export default function AdminDashboard() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
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
    { id: 1, type: 'Temp Worker', icon: '👤', desc: 'Raju Sharma — Loading worker', action: 'Approve' },
    { id: 2, type: 'Payment', icon: '💸', desc: '₹45,000 — Kumar Traders (Sales)', action: 'Verify' },
    { id: 3, type: 'Procurement', icon: '📦', desc: 'Maize 1,000 kg — Price escalation', action: 'Review' },
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

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })

  const formatLakhs = (val) => `₹ ${(val / 100000).toFixed(1)} L`

  return (
    <div className="space-y-8 animate-fade-in">

      {/* Page Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="page-title text-2xl font-bold tracking-tight text-white font-display">Business Overview</h1>
          <p className="page-sub text-zinc-400 text-sm mt-1">{today}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-full font-medium shadow-sm">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            System Live & Connected
          </span>
        </div>
      </div>

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

        {/* Procurement trend chart */}
        <div className="lg:col-span-2 tom-card">
          <CardHeader
            title="📈 Weekly Procurement Rate"
            subtitle="Raw cotton & sunflower seed receipts (kg/day)"
          />
          <div className="px-4 py-5">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={procurementTrend}>
                <defs>
                  <linearGradient id="procGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fill: '#a1a1aa', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#a1a1aa', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#1c1917', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: 10, color: '#fff', fontSize: 12 }}
                  cursor={{ stroke: '#f59e0b', strokeWidth: 1.5, strokeDasharray: '4 4' }}
                />
                <Area type="monotone" dataKey="kg" stroke="#f59e0b" strokeWidth={2.5} fill="url(#procGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stock by Grade chart */}
        <div className="tom-card">
          <CardHeader
            title="🏷️ Bag Stock by Grade"
            subtitle="Current warehouse distribution"
          />
          <div className="px-4 py-5">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stockByGrade} barSize={32}>
                <XAxis dataKey="grade" tick={{ fill: '#a1a1aa', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#a1a1aa', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#1c1917', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: 10, color: '#fff', fontSize: 12 }}
                  cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                />
                <Bar dataKey="bags" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Approvals + Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Approvals */}
        <Card>
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07]">
            <div>
              <h3 className="font-semibold text-white text-base">✅ Actionable Pending Approvals</h3>
              <p className="text-xs text-zinc-400 mt-0.5">{approvals.length} operational items requiring signoff</p>
            </div>
            {approvals.length > 0 && (
              <span className="badge badge-warning">{approvals.length} pending</span>
            )}
          </div>
          <div className="divide-y divide-white/[0.05]">
            {approvals.length === 0 ? (
              <div className="p-8 text-center text-sm text-zinc-500">
                🎉 All operational tasks and approvals are up to date!
              </div>
            ) : (
              approvals.map(a => (
                <div key={a.id} className="flex items-center justify-between px-6 py-4 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-surface-3 flex items-center justify-center text-lg">{a.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-white">{a.type}</p>
                      <p className="text-xs text-zinc-400">{a.desc}</p>
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

        {/* Activity Feed */}
        <Card>
          <CardHeader title="🕐 Live Activity Feed" subtitle="Mill operations in the last 24 hours" />
          <div className="divide-y divide-white/[0.05]">
            {[
              { color: 'bg-amber-500', text: 'Procurement requirement created: Cotton Seed 5,000 kg', time: '2 min ago' },
              { color: 'bg-emerald-500', text: 'Electronic weighment slip issued: WB-260926-001 (16.3t net)', time: '12 min ago' },
              { color: 'bg-blue-500', text: 'B2B Order placed: Heritage Foods — 200 bags cake', time: '28 min ago' },
              { color: 'bg-amber-500', text: 'Expeller #1 runtime reached: 112°C normal operation', time: '35 min ago' },
              { color: 'bg-emerald-500', text: 'Disbursed September salary advances to 4 operators', time: '1 hr ago' },
              { color: 'bg-purple-500', text: 'Quality lab approval: Lot #TUR-001 moisture 7.8% (Passed)', time: '2 hr ago' },
            ].map((a, i) => (
              <div key={i} className="flex items-start gap-3 px-6 py-3.5">
                <div className={`w-2.5 h-2.5 rounded-full ${a.color} mt-1.5 flex-shrink-0 shadow-sm`} />
                <div className="flex-1">
                  <p className="text-sm text-zinc-200">{a.text}</p>
                  <p className="text-xs text-zinc-400 mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Inventory Summary Table */}
      <Card>
        <CardHeader
          title="🏭 Warehouse Inventory Stock"
          subtitle="Real-time bag count, weight and effective cost per kg from database"
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

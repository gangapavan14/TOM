import { useState } from 'react'
import { Card, CardHeader, Badge } from '../../components/ui'
import { BarChart3, Download, TrendingUp, Calendar, Filter } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from 'recharts'

const monthlyRevenueData = [
  { month: 'Apr', revenue: 42, profit: 9.2 },
  { month: 'May', revenue: 48, profit: 11.0 },
  { month: 'Jun', revenue: 55, profit: 12.8 },
  { month: 'Jul', revenue: 51, profit: 10.5 },
  { month: 'Aug', revenue: 64, profit: 14.6 },
  { month: 'Sep', revenue: 72, profit: 17.2 },
]

const productionBreakdown = [
  { commodity: 'Cotton Seed Oil', productionTons: 180, revenueLakhs: 216 },
  { commodity: 'Sunflower Oil', productionTons: 120, revenueLakhs: 168 },
  { commodity: 'De-oiled Cotton Cake', productionTons: 640, revenueLakhs: 192 },
  { commodity: 'Sunflower Cake', productionTons: 210, revenueLakhs: 73 },
]

import toast from 'react-hot-toast'

export default function ReportsPage() {
  const handleExport = () => {
    const csvContent = 'data:text/csv;charset=utf-8,' +
      'Month,Gross Revenue (Lakhs),Net Profit (Lakhs)\n' +
      monthlyRevenueData.map(e => `${e.month},${e.revenue},${e.profit}`).join('\n') +
      '\n\nCommodity,Production (Tons),Revenue (Lakhs)\n' +
      productionBreakdown.map(e => `"${e.commodity}",${e.productionTons},${e.revenueLakhs}`).join('\n')

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `TOM_Master_Analytics_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Master Executive Analytics exported to CSV')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="page-title">Executive Reports & BI Analytics</h1>
          <p className="page-sub">Crushing yields, product margins, P&L statements and revenue breakdown</p>
        </div>
        <button onClick={handleExport} className="btn-secondary">
          <Download size={16} /> Export Master Excel
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'YTD Gross Revenue', value: '₹3.32 Cr', icon: '📈' },
          { label: 'Net Profit Margin', value: '23.8%', icon: '💎' },
          { label: 'Total Volume Crushed', value: '4,280 t', icon: '🌾' },
          { label: 'Active B2B Clients', value: '64', icon: '🏢' }
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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5">
          <h3 className="font-display font-bold text-white text-base mb-1">Monthly Revenue & Net Profit (₹ Lakhs)</h3>
          <p className="text-zinc-500 text-xs mb-4">Financial Year 2026-27 performance</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyRevenueData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d97706" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#d97706" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProf" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="month" stroke="#71717a" />
                <YAxis stroke="#71717a" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '8px', color: '#fff' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#f59e0b" fillOpacity={1} fill="url(#colorRev)" name="Revenue (Lakhs)" />
                <Area type="monotone" dataKey="profit" stroke="#10b981" fillOpacity={1} fill="url(#colorProf)" name="Profit (Lakhs)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-display font-bold text-white text-base mb-1">Production Volumes by Commodity (Tons)</h3>
          <p className="text-zinc-500 text-xs mb-4">Current quarter output volumes</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productionBreakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="commodity" stroke="#71717a" tick={{ fontSize: 11 }} />
                <YAxis stroke="#71717a" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '8px', color: '#fff' }}
                />
                <Bar dataKey="productionTons" fill="#f59e0b" radius={[6, 6, 0, 0]} name="Volume (Tons)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Summary Table */}
      <Card>
        <CardHeader title="Commodity Yields & Revenue Breakdown" subtitle="Detailed breakdown of oil extraction and cake byproducts" />
        <div className="overflow-x-auto">
          <table className="tom-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th className="text-right">Production (Tons)</th>
                <th className="text-right">Gross Realization (₹ Lakhs)</th>
                <th className="text-right">Avg Realization / Ton</th>
                <th>Share of Sales</th>
              </tr>
            </thead>
            <tbody>
              {productionBreakdown.map(p => (
                <tr key={p.commodity}>
                  <td className="font-semibold text-white">{p.commodity}</td>
                  <td className="text-right font-mono text-zinc-300">{p.productionTons} t</td>
                  <td className="text-right font-mono font-bold text-brand-400">₹{p.revenueLakhs} L</td>
                  <td className="text-right font-mono text-zinc-400">₹{Math.round((p.revenueLakhs * 100000) / p.productionTons).toLocaleString('en-IN')}</td>
                  <td>
                    <Badge variant="amber">{Math.round((p.revenueLakhs / 649) * 100)}%</Badge>
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

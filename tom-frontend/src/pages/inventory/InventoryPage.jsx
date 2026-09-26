import { useState } from 'react'
import { Card, CardHeader, Badge, EmptyState, Modal, FormField } from '../../components/ui'
import { Plus, Search, Package } from 'lucide-react'

const mockStock = [
  { id:'TUR-260926-001', commodity:'Turmeric', grade:'A+', warehouse:'W1',room:'Room A', bags:120, kg:6000, costPerKg:'₹125', status:'IN_STOCK' },
  { id:'TUR-260926-002', commodity:'Turmeric', grade:'A',  warehouse:'W1',room:'Room B', bags:80,  kg:4000, costPerKg:'₹118', status:'IN_STOCK' },
  { id:'MAI-260926-001', commodity:'Maize',    grade:'A',  warehouse:'W2',room:'Room A', bags:200, kg:10000,costPerKg:'₹22',  status:'IN_STOCK' },
  { id:'SES-260926-001', commodity:'Sesame',   grade:'B',  warehouse:'W2',room:'Room B', bags:40,  kg:2000, costPerKg:'₹145', status:'IN_STOCK' },
]

const mockWarehouses = [
  { name:'Warehouse 1', rooms:3, totalBags:200, totalKg:10000, commodity:'Turmeric' },
  { name:'Warehouse 2', rooms:2, totalBags:240, totalKg:12000, commodity:'Mixed' },
]

export default function InventoryPage() {
  const [tab, setTab] = useState('batches')
  const [search, setSearch] = useState('')

  const filtered = mockStock.filter(s =>
    s.commodity.toLowerCase().includes(search.toLowerCase()) ||
    s.id.toLowerCase().includes(search.toLowerCase())
  )

  const gradeVariant = g => ({ 'A+':'success','A':'info','B':'warning','C':'danger' }[g] ?? 'muted')

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="page-title">Inventory & Warehouses</h1>
          <p className="page-sub">Bag-level stock tracking across all warehouses</p>
        </div>
        <button className="btn-secondary"><Plus size={16} /> Stock Adjustment</button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label:'Total Batches', value:mockStock.length, icon:'📦' },
          { label:'Total Bags',    value: mockStock.reduce((s,r)=>s+r.bags,0), icon:'🛍️' },
          { label:'Total Weight',  value: `${(mockStock.reduce((s,r)=>s+r.kg,0)/1000).toFixed(1)}t`, icon:'⚖️' },
          { label:'Warehouses',    value: mockWarehouses.length, icon:'🏭' },
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
        {['batches','warehouses'].map(t=>(
          <button key={t} onClick={()=>setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${tab===t?'bg-surface-3 text-white':'text-zinc-500 hover:text-white'}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="relative w-72">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input className="tom-input pl-9" placeholder="Search batches..." value={search} onChange={e=>setSearch(e.target.value)} />
      </div>

      {tab === 'batches' && (
        <Card>
          <div className="overflow-x-auto">
            <table className="tom-table">
              <thead>
                <tr><th>Batch ID</th><th>Commodity</th><th>Grade</th><th>Warehouse</th><th>Bags</th><th>Weight (kg)</th><th>Cost/kg</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.map(r=>(
                  <tr key={r.id}>
                    <td className="font-mono text-xs text-zinc-400">{r.id}</td>
                    <td className="font-semibold text-white">{r.commodity}</td>
                    <td><Badge variant={gradeVariant(r.grade)}>{r.grade}</Badge></td>
                    <td className="text-zinc-400">{r.warehouse} — {r.room}</td>
                    <td>{r.bags.toLocaleString('en-IN')}</td>
                    <td>{r.kg.toLocaleString('en-IN')}</td>
                    <td className="font-semibold text-brand-400">{r.costPerKg}</td>
                    <td><Badge variant="success">In Stock</Badge></td>
                    <td><button className="btn-ghost text-xs">View Bags</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {tab === 'warehouses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockWarehouses.map(w=>(
            <Card key={w.name} className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-display font-bold text-white text-base">{w.name}</h3>
                  <p className="text-zinc-500 text-xs">{w.commodity} — {w.rooms} rooms</p>
                </div>
                <span className="w-10 h-10 bg-brand-500/10 rounded-xl flex items-center justify-center text-xl">🏭</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-surface-3 rounded-xl p-3">
                  <p className="text-2xl font-extrabold font-display text-white">{w.totalBags}</p>
                  <p className="text-xs text-zinc-500">Total Bags</p>
                </div>
                <div className="bg-surface-3 rounded-xl p-3">
                  <p className="text-2xl font-extrabold font-display text-white">{(w.totalKg/1000).toFixed(1)}t</p>
                  <p className="text-xs text-zinc-500">Total Weight</p>
                </div>
              </div>
              <button className="btn-secondary w-full mt-4 text-xs">View Rooms →</button>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

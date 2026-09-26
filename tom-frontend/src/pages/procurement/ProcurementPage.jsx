import { useState, useEffect } from 'react'
import { Card, CardHeader, Badge, EmptyState, StatusBadge, Modal, FormField } from '../../components/ui'
import { procurementApi } from '../../api/endpoints'
import { Plus, Search, Clock, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'

const mockRequirements = [
  { id: 1, reqCode: 'REQ-2609-01', commodity: 'Raw Cotton Seed', required: 10000, reserved: 3000, targetPrice: 125, status: 'PARTIALLY_RESERVED', created: '26 Sep 2026' },
  { id: 2, reqCode: 'REQ-2609-02', commodity: 'Sunflower Seed', required: 5000, reserved: 5000, targetPrice: 72, status: 'FULLY_RESERVED', created: '26 Sep 2026' },
  { id: 3, reqCode: 'REQ-2609-03', commodity: 'Sesame Seed', required: 2000, reserved: 0, targetPrice: 145, status: 'OPEN', created: '25 Sep 2026' },
]

const mockReservations = [
  { id: 1, supplier: 'Sri Rama Agros', commodity: 'Raw Cotton Seed', qty: 3000, reserved_at: '26 Sep 06:00', expires_at: '26 Sep 18:00', status: 'NEGOTIATING' },
  { id: 2, supplier: 'K. Venkat Reddy (Farmer)', commodity: 'Sunflower Seed', qty: 5000, reserved_at: '26 Sep 09:00', expires_at: '26 Sep 21:00', status: 'CONFIRMED' },
]

const mockDeals = [
  { id: 1, dealCode: 'DEAL-2609-01', supplier: 'Sri Rama Agros', commodity: 'Raw Cotton Seed', qty: 1800, grade: 'A+', price: 124.50, advance: 50000, status: 'INSPECTING' },
  { id: 2, dealCode: 'DEAL-2609-02', supplier: 'Bhavani Traders', commodity: 'Sunflower Seed', qty: 2500, grade: 'A', price: 71.00, advance: 35000, status: 'CONFIRMED' },
]

export default function ProcurementPage() {
  const [tab, setTab] = useState('requirements')
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [requirements, setRequirements] = useState(mockRequirements)
  const [deals, setDeals] = useState(mockDeals)
  const [newReq, setNewReq] = useState({ commodity: 'Raw Cotton Seed', required: '', targetPrice: '' })

  useEffect(() => {
    Promise.all([
      procurementApi.requirements().catch(() => ({ data: { data: [] } })),
      procurementApi.deals().catch(() => ({ data: { data: [] } }))
    ]).then(([reqRes, dealsRes]) => {
      const rData = reqRes.data?.data || []
      const dData = dealsRes.data?.data || []
      if (rData.length > 0) {
        setRequirements(rData.map(r => ({
          id: r.id,
          reqCode: r.reqCode,
          commodity: r.commodity,
          required: parseFloat(r.requiredKg) || (r.requiredBags * 50) || 5000,
          reserved: 0,
          targetPrice: parseFloat(r.targetPrice) || 120,
          status: r.status,
          created: new Date(r.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
        })))
      }
      if (dData.length > 0) {
        setDeals(dData.map(d => ({
          id: d.id,
          dealCode: d.dealCode,
          supplier: d.supplier?.name || 'Local Supplier',
          commodity: d.commodity,
          qty: parseFloat(d.totalKg) || 0,
          grade: 'A',
          price: parseFloat(d.ratePerKg) || 0,
          advance: parseFloat(d.advanceAmount) || 0,
          status: d.dealStatus
        })))
      }
    })
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    const reqKg = parseFloat(newReq.required) || 0
    const created = {
      id: requirements.length + 1,
      reqCode: `REQ-2609-0${requirements.length + 1}`,
      commodity: newReq.commodity,
      required: reqKg,
      reserved: 0,
      targetPrice: parseFloat(newReq.targetPrice) || 0,
      status: 'OPEN',
      created: 'Today'
    }

    try {
      await procurementApi.createRequirement({
        reqCode: created.reqCode,
        commodity: newReq.commodity,
        requiredBags: Math.ceil(reqKg / 50),
        requiredKg: reqKg,
        targetPrice: created.targetPrice,
        status: 'OPEN'
      })
      toast.success(`Requirement #${created.reqCode} Created`)
    } catch {
      toast.success(`Requirement #${created.reqCode} Saved Locally`)
    }

    setRequirements([created, ...requirements])
    setShowModal(false)
    setNewReq({ commodity: 'Raw Cotton Seed', required: '', targetPrice: '' })
  }

  const tabs = ['requirements', 'reservations', 'deals']

  const totalReqKg = requirements.reduce((acc, r) => acc + r.required, 0)
  const totalReservedKg = mockReservations.reduce((acc, r) => acc + r.qty, 0)

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="page-title text-2xl font-bold tracking-tight text-white font-display">Procurement Operations</h1>
          <p className="page-sub text-zinc-400 text-sm mt-1">Manage purchase requirements, 12-hr farmer reservations, and broker deals</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={16} /> New Requirement
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Open Requirements', value: requirements.length, sub: `${(totalReqKg / 1000).toFixed(1)} t requested`, icon: '📋', color: 'text-blue-400 bg-blue-500/10' },
          { label: 'Active Reservations', value: mockReservations.length, sub: `${(totalReservedKg / 1000).toFixed(1)} t committed`, icon: '⏰', color: 'text-amber-400 bg-amber-500/10' },
          { label: 'Deals in Progress', value: deals.length, sub: '₹ 4.01 L volume', icon: '🤝', color: 'text-emerald-400 bg-emerald-500/10' },
          { label: 'Expiring Reservations', value: 1, sub: 'Expires in 45 min', icon: '⚠️', color: 'text-red-400 bg-red-500/10' },
        ].map(s => (
          <div key={s.label} className="tom-card p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center text-xl flex-shrink-0`}>{s.icon}</div>
            <div>
              <p className="text-2xl font-extrabold font-display text-white">{s.value}</p>
              <p className="text-xs font-semibold text-zinc-300">{s.label}</p>
              <p className="text-[11px] text-zinc-500 mt-0.5">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface-2 p-1 rounded-xl w-fit">
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${tab === t ? 'bg-surface-3 text-white shadow-sm' : 'text-zinc-500 hover:text-white'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative w-80">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input className="tom-input pl-9" placeholder="Search commodity, supplier or ID..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Requirements Tab */}
      {tab === 'requirements' && (
        <Card>
          <div className="overflow-x-auto">
            <table className="tom-table">
              <thead>
                <tr>
                  <th className="whitespace-nowrap">Req ID</th>
                  <th className="whitespace-nowrap">Commodity</th>
                  <th className="text-right whitespace-nowrap">Target Qty (kg)</th>
                  <th className="text-right whitespace-nowrap">Reserved (kg)</th>
                  <th className="text-right whitespace-nowrap">Target Price</th>
                  <th className="whitespace-nowrap">Status</th>
                  <th className="whitespace-nowrap">Created</th>
                  <th className="text-right whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {requirements.filter(r => r.commodity.toLowerCase().includes(search.toLowerCase())).map(r => (
                  <tr key={r.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="font-mono text-xs text-amber-400 font-semibold whitespace-nowrap">{r.reqCode || `#${r.id}`}</td>
                    <td className="font-semibold text-white whitespace-nowrap">{r.commodity}</td>
                    <td className="text-right font-mono text-zinc-200 whitespace-nowrap">{r.required.toLocaleString('en-IN')} kg</td>
                    <td className="text-right font-mono text-amber-400 whitespace-nowrap">{r.reserved.toLocaleString('en-IN')} kg</td>
                    <td className="text-right font-mono font-bold text-zinc-200 whitespace-nowrap">₹{r.targetPrice}/kg</td>
                    <td className="whitespace-nowrap">
                      <Badge variant={r.status === 'OPEN' ? 'info' : r.status === 'FULLY_RESERVED' ? 'warning' : 'success'}>
                        {r.status.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="text-zinc-400 text-xs whitespace-nowrap">{r.created}</td>
                    <td className="text-right whitespace-nowrap">
                      <button
                        onClick={() => toast.success(`Viewing deal breakdown for ${r.commodity}`)}
                        className="btn-ghost text-xs py-1 px-2.5 inline-flex items-center gap-1 text-zinc-300 hover:text-white"
                      >
                        Details <ArrowRight size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Reservations Tab */}
      {tab === 'reservations' && (
        <Card>
          <div className="overflow-x-auto">
            <table className="tom-table">
              <thead>
                <tr>
                  <th className="whitespace-nowrap">Res ID</th>
                  <th className="whitespace-nowrap">Supplier / Farmer</th>
                  <th className="whitespace-nowrap">Commodity</th>
                  <th className="text-right whitespace-nowrap">Reserved Qty</th>
                  <th className="whitespace-nowrap">Reserved At</th>
                  <th className="whitespace-nowrap">12-hr Expiry</th>
                  <th className="whitespace-nowrap">Status</th>
                  <th className="text-right whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {mockReservations.map(r => (
                  <tr key={r.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="font-mono text-xs text-amber-400 font-semibold whitespace-nowrap">#RES-00{r.id}</td>
                    <td className="font-semibold text-white whitespace-nowrap">{r.supplier}</td>
                    <td className="text-zinc-300 whitespace-nowrap">{r.commodity}</td>
                    <td className="text-right font-mono text-amber-400 whitespace-nowrap">{r.qty.toLocaleString('en-IN')} kg</td>
                    <td className="text-zinc-400 text-xs whitespace-nowrap">{r.reserved_at}</td>
                    <td className="text-red-400 font-mono text-xs font-semibold whitespace-nowrap">{r.expires_at}</td>
                    <td className="whitespace-nowrap">
                      <Badge variant={r.status === 'CONFIRMED' ? 'success' : 'warning'}>{r.status}</Badge>
                    </td>
                    <td className="text-right whitespace-nowrap">
                      <button
                        onClick={() => toast.success(`Converting Reservation #${r.id} to Purchase Deal`)}
                        className="btn-primary text-xs py-1 px-2.5"
                      >
                        Convert to Deal
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Deals Tab */}
      {tab === 'deals' && (
        <Card>
          <div className="overflow-x-auto">
            <table className="tom-table">
              <thead>
                <tr>
                  <th className="whitespace-nowrap">Deal Code</th>
                  <th className="whitespace-nowrap">Supplier</th>
                  <th className="whitespace-nowrap">Commodity & Grade</th>
                  <th className="text-right whitespace-nowrap">Quantity (kg)</th>
                  <th className="text-right whitespace-nowrap">Rate / kg</th>
                  <th className="text-right whitespace-nowrap">Advance Paid</th>
                  <th className="whitespace-nowrap">Status</th>
                </tr>
              </thead>
              <tbody>
                {deals.map(d => (
                  <tr key={d.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="font-mono text-xs text-amber-400 font-semibold whitespace-nowrap">{d.dealCode}</td>
                    <td className="font-semibold text-white whitespace-nowrap">{d.supplier}</td>
                    <td className="text-zinc-300 whitespace-nowrap">{d.commodity} ({d.grade})</td>
                    <td className="text-right font-mono text-zinc-200 whitespace-nowrap">{d.qty.toLocaleString('en-IN')} kg</td>
                    <td className="text-right font-mono font-bold text-amber-300 whitespace-nowrap">₹{d.price.toFixed(2)}</td>
                    <td className="text-right font-mono text-emerald-400 whitespace-nowrap">₹{d.advance.toLocaleString('en-IN')}</td>
                    <td className="whitespace-nowrap">
                      <Badge variant={d.status === 'CONFIRMED' ? 'success' : 'info'}>{d.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create Raw Seed Procurement Requirement">
        <form onSubmit={handleCreate} className="space-y-4">
          <FormField label="Commodity / Crop">
            <select
              className="tom-select"
              value={newReq.commodity}
              onChange={e => setNewReq({ ...newReq, commodity: e.target.value })}
            >
              <option value="Raw Cotton Seed">Raw Cotton Seed</option>
              <option value="Sunflower Seed">Sunflower Seed</option>
              <option value="Sesame Seed">Sesame Seed</option>
              <option value="Groundnut Pods">Groundnut Pods</option>
            </select>
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Required Weight (kg)">
              <input
                required
                type="number"
                className="tom-input"
                placeholder="e.g. 10000"
                value={newReq.required}
                onChange={e => setNewReq({ ...newReq, required: e.target.value })}
              />
            </FormField>
            <FormField label="Target Rate (₹ / kg)">
              <input
                required
                type="number"
                step="0.5"
                className="tom-input"
                placeholder="e.g. 125"
                value={newReq.targetPrice}
                onChange={e => setNewReq({ ...newReq, targetPrice: e.target.value })}
              />
            </FormField>
          </div>
          <div className="flex justify-end gap-3 pt-3">
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Post Requirement</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

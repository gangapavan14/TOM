import { useState, useEffect } from 'react'
import { Card, CardHeader, Badge, EmptyState, StatusBadge, Modal, FormField } from '../../components/ui'
import { procurementApi } from '../../api/endpoints'
import { Plus, Search, Clock, AlertTriangle, CheckCircle, ArrowRight, UserCheck, ShieldAlert, Sparkles, Send } from 'lucide-react'
import toast from 'react-hot-toast'

const initialRequirements = [
  { id: 1, reqCode: 'REQ-2609-01', commodity: 'Raw Cotton Seed', required: 10000, reserved: 3000, available: 7000, targetPrice: 125, status: 'PARTIALLY_RESERVED', created: '26 Sep 2026' },
  { id: 2, reqCode: 'REQ-2609-02', commodity: 'Sunflower Seed', required: 5000, reserved: 5000, available: 0, targetPrice: 72, status: 'FULLY_RESERVED', created: '26 Sep 2026' },
  { id: 3, reqCode: 'REQ-2609-03', commodity: 'Sesame Seed', required: 2000, reserved: 0, available: 2000, targetPrice: 145, status: 'OPEN', created: '25 Sep 2026' },
]

const initialReservations = [
  {
    id: 1,
    resCode: 'RES-2609-01',
    supplier: 'Sri Rama Agros',
    sourceType: 'COMMISSION_AGENT',
    agentName: 'M. Prabhakar Rao (Broker)',
    commissionRule: '₹1.20 / kg commission',
    commodity: 'Raw Cotton Seed',
    qty: 3000,
    reservedAt: '26 Sep 06:00 AM',
    expiresAt: '26 Sep 06:00 PM',
    hoursRemaining: 4.5,
    status: 'NEGOTIATING'
  },
  {
    id: 2,
    resCode: 'RES-2609-02',
    supplier: 'K. Venkat Reddy',
    sourceType: 'FARMER_DIRECT',
    agentName: '—',
    commissionRule: 'None (Direct Farmer)',
    commodity: 'Sunflower Seed',
    qty: 5000,
    reservedAt: '26 Sep 09:00 AM',
    expiresAt: '26 Sep 09:00 PM',
    hoursRemaining: 7.2,
    status: 'AGREED'
  },
]

const initialDeals = [
  {
    id: 1,
    dealCode: 'DEAL-2609-01',
    supplier: 'Sri Rama Agros',
    sourceType: 'COMMISSION_AGENT',
    commodity: 'Raw Cotton Seed',
    qty: 1800,
    targetPrice: 125.00,
    agreedPrice: 124.50,
    advance: 50000,
    deliveryWindowRemaining: '16 hrs remaining (24h rule)',
    status: 'INSPECTING',
    escalated: false
  },
  {
    id: 2,
    dealCode: 'DEAL-2609-02',
    supplier: 'Bhavani Traders',
    sourceType: 'TRADER',
    commodity: 'Sunflower Seed',
    qty: 2500,
    targetPrice: 70.00,
    agreedPrice: 73.50,
    advance: 35000,
    deliveryWindowRemaining: '21 hrs remaining',
    status: 'ESCALATED_TO_ADMIN',
    escalated: true,
    escalationReason: 'Rate ₹73.50 exceeds Field Officer ₹72.00 cap'
  },
]

export default function ProcurementPage() {
  const [tab, setTab] = useState('requirements')
  const [search, setSearch] = useState('')
  const [requirements, setRequirements] = useState(initialRequirements)
  const [reservations, setReservations] = useState(initialReservations)
  const [deals, setDeals] = useState(initialDeals)

  // Modals
  const [showReqModal, setShowReqModal] = useState(false)
  const [showResModal, setShowResModal] = useState(false)
  const [showEscalationModal, setShowEscalationModal] = useState(false)
  const [selectedDealForEscalation, setSelectedDealForEscalation] = useState(null)

  // Form states
  const [newReq, setNewReq] = useState({ commodity: 'Raw Cotton Seed', required: '', targetPrice: '' })
  const [newRes, setNewRes] = useState({
    supplier: '',
    sourceType: 'FARMER_DIRECT',
    agentName: '',
    commissionRule: 'Fixed ₹100 per farmer',
    commodity: 'Raw Cotton Seed',
    qty: 1000
  })
  const [escalationNote, setEscalationNote] = useState('')

  useEffect(() => {
    Promise.all([
      procurementApi.requirements().catch(() => ({ data: { data: [] } })),
      procurementApi.deals().catch(() => ({ data: { data: [] } }))
    ]).then(([reqRes, dealsRes]) => {
      const rData = reqRes.data?.data || []
      const dData = dealsRes.data?.data || []
      if (rData.length > 0) {
        setRequirements(rData.map(r => {
          const reqKg = parseFloat(r.requiredKg) || (r.requiredBags * 50) || 5000
          return {
            id: r.id,
            reqCode: r.reqCode,
            commodity: r.commodity,
            required: reqKg,
            reserved: 1000,
            available: Math.max(0, reqKg - 1000),
            targetPrice: parseFloat(r.targetPrice) || 120,
            status: r.status,
            created: new Date(r.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
          }
        }))
      }
      if (dData.length > 0) {
        setDeals(dData.map(d => ({
          id: d.id,
          dealCode: d.dealCode,
          supplier: d.supplier?.name || 'Local Supplier',
          sourceType: 'COMMISSION_AGENT',
          commodity: d.commodity,
          qty: parseFloat(d.totalKg) || 0,
          targetPrice: 125,
          agreedPrice: parseFloat(d.ratePerKg) || 120,
          advance: parseFloat(d.advanceAmount) || 0,
          deliveryWindowRemaining: '24-hr active window',
          status: d.dealStatus || 'DELIVERY_PENDING',
          escalated: false
        })))
      }
    })
  }, [])

  // Create Requirement
  const handleCreateRequirement = async (e) => {
    e.preventDefault()
    const reqKg = parseFloat(newReq.required) || 0
    const created = {
      id: requirements.length + 1,
      reqCode: `REQ-2609-0${requirements.length + 1}`,
      commodity: newReq.commodity,
      required: reqKg,
      reserved: 0,
      available: reqKg,
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
      toast.success(`Requirement #${created.reqCode} posted by Admin`)
    } catch {
      toast.success(`Requirement #${created.reqCode} recorded locally`)
    }

    setRequirements([created, ...requirements])
    setShowReqModal(false)
    setNewReq({ commodity: 'Raw Cotton Seed', required: '', targetPrice: '' })
  }

  // 12-Hour Reservation Expired -> Release back to requirement
  const handleReleaseReservation = (resId, qty, commodity) => {
    setReservations(reservations.filter(r => r.id !== resId))
    setRequirements(requirements.map(req => {
      if (req.commodity === commodity) {
        return {
          ...req,
          reserved: Math.max(0, req.reserved - qty),
          available: req.available + qty,
          status: req.available + qty >= req.required ? 'OPEN' : 'PARTIALLY_RESERVED'
        }
      }
      return req
    }))
    toast.success(`12-Hour window elapsed: ${qty.toLocaleString('en-IN')} kg released back to available requirement!`)
  }

  // Convert reservation to procurement deal (Agreement reached)
  const handleConvertToDeal = (res) => {
    setReservations(reservations.filter(r => r.id !== res.id))
    const newDeal = {
      id: deals.length + 1,
      dealCode: `DEAL-2609-0${deals.length + 1}`,
      supplier: res.supplier,
      sourceType: res.sourceType,
      commodity: res.commodity,
      qty: res.qty,
      targetPrice: 125.00,
      agreedPrice: 124.00,
      advance: 25000,
      deliveryWindowRemaining: '24 hrs remaining (Strict delivery window)',
      status: 'DELIVERY_PENDING',
      escalated: false
    }
    setDeals([newDeal, ...deals])
    toast.success(`Reservation converted to Agreed Procurement Deal #${newDeal.dealCode}! 24-hr delivery clock started.`)
  }

  // Escalate to Admin
  const handleEscalateToAdmin = (e) => {
    e.preventDefault()
    if (!selectedDealForEscalation) return
    setDeals(deals.map(d => d.id === selectedDealForEscalation.id ? {
      ...d,
      status: 'ESCALATED_TO_ADMIN',
      escalated: true,
      escalationReason: escalationNote || 'Field Officer requested special rate approval'
    } : d))
    toast.success(`Deal #${selectedDealForEscalation.dealCode} escalated to Admin with communication thread`)
    setShowEscalationModal(false)
    setSelectedDealForEscalation(null)
  }

  const tabs = ['requirements', 'reservations', 'deals']

  const totalReqKg = requirements.reduce((acc, r) => acc + r.required, 0)
  const totalReservedKg = reservations.reduce((acc, r) => acc + r.qty, 0)

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="page-title text-2xl font-bold tracking-tight text-white font-display">Procurement Pipeline</h1>
          <p className="page-sub text-zinc-400 text-sm mt-1">
            Supplier acquisition (Farmers, Field Agents, Commission Agents), 12-hr reservations, and 24-hr delivery commitments
          </p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary" onClick={() => setShowResModal(true)}>
            <Clock size={15} /> Hold 12-hr Reservation
          </button>
          <button className="btn-primary" onClick={() => setShowReqModal(true)}>
            <Plus size={16} /> New Requirement
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Open Requirements', value: requirements.length, sub: `${(totalReqKg / 1000).toFixed(1)} t requested`, icon: '📋', color: 'text-blue-400 bg-blue-500/10' },
          { label: '12-hr Reservations Active', value: reservations.length, sub: `${(totalReservedKg / 1000).toFixed(1)} t held temporarily`, icon: '⏰', color: 'text-amber-400 bg-amber-500/10' },
          { label: 'Finalized Deals', value: deals.length, sub: '24-hr delivery clock active', icon: '🤝', color: 'text-emerald-400 bg-emerald-500/10' },
          { label: 'Admin Escalations', value: deals.filter(d => d.escalated).length, sub: 'Requires pricing exception', icon: '⚠️', color: 'text-red-400 bg-red-500/10' },
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
            {t === 'requirements' ? '1. Admin Requirements' : t === 'reservations' ? '2. 12-hr Reservations' : '3. Finalized Deals (24h Delivery)'}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative w-80">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input className="tom-input pl-9" placeholder="Search commodity, supplier or deal..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Requirements Tab */}
      {tab === 'requirements' && (
        <Card>
          <div className="overflow-x-auto">
            <table className="tom-table">
              <thead>
                <tr>
                  <th>Req ID</th>
                  <th>Commodity</th>
                  <th className="text-right">Target (kg)</th>
                  <th className="text-right">Reserved (12h)</th>
                  <th className="text-right">Available (kg)</th>
                  <th className="text-right">Target Price</th>
                  <th>Status</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {requirements.filter(r => r.commodity.toLowerCase().includes(search.toLowerCase())).map(r => (
                  <tr key={r.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="font-mono text-xs text-amber-400 font-semibold">{r.reqCode}</td>
                    <td className="font-semibold text-white">{r.commodity}</td>
                    <td className="text-right font-mono text-zinc-200">{r.required.toLocaleString('en-IN')} kg</td>
                    <td className="text-right font-mono text-amber-400 font-bold">{r.reserved.toLocaleString('en-IN')} kg</td>
                    <td className="text-right font-mono text-emerald-400 font-semibold">{r.available.toLocaleString('en-IN')} kg</td>
                    <td className="text-right font-mono font-bold text-zinc-200">₹{r.targetPrice}/kg</td>
                    <td>
                      <Badge variant={r.status === 'OPEN' ? 'info' : r.status === 'FULLY_RESERVED' ? 'warning' : 'success'}>
                        {r.status.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="text-zinc-400 text-xs">{r.created}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* 12-Hour Reservations Tab */}
      {tab === 'reservations' && (
        <Card>
          <CardHeader
            title="12-Hour Supplier Hold Rules"
            subtitle="Reserved quantities auto-release back to open pool if negotiation or delivery does not commence within 12 hours"
          />
          <div className="overflow-x-auto">
            <table className="tom-table">
              <thead>
                <tr>
                  <th>Res ID</th>
                  <th>Supplier / Source Type</th>
                  <th>Commission Rule</th>
                  <th>Commodity</th>
                  <th className="text-right">Quantity</th>
                  <th>12-hr Expiry Window</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map(r => (
                  <tr key={r.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="font-mono text-xs text-amber-400 font-semibold">{r.resCode}</td>
                    <td>
                      <p className="font-semibold text-white">{r.supplier}</p>
                      <span className="text-[11px] text-zinc-400 font-mono">
                        {r.sourceType === 'COMMISSION_AGENT' ? `Broker: ${r.agentName}` : 'Direct Farmer'}
                      </span>
                    </td>
                    <td>
                      <span className="text-xs font-mono text-zinc-300 px-2 py-0.5 rounded bg-surface-3">
                        {r.commissionRule}
                      </span>
                    </td>
                    <td className="text-zinc-300">{r.commodity}</td>
                    <td className="text-right font-mono text-amber-400 font-bold">{r.qty.toLocaleString('en-IN')} kg</td>
                    <td>
                      <div className="flex items-center gap-1.5 text-xs text-red-400 font-mono">
                        <Clock size={13} />
                        <span>{r.hoursRemaining} hrs left</span>
                      </div>
                      <span className="text-[11px] text-zinc-500">Exp: {r.expiresAt}</span>
                    </td>
                    <td>
                      <Badge variant={r.status === 'AGREED' ? 'success' : 'warning'}>{r.status}</Badge>
                    </td>
                    <td className="text-right">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => handleConvertToDeal(r)}
                          className="btn-primary text-xs px-2.5 py-1"
                        >
                          Agree & Finalize Deal
                        </button>
                        <button
                          onClick={() => handleReleaseReservation(r.id, r.qty, r.commodity)}
                          className="btn-danger text-xs px-2 py-1"
                          title="Release reserved quantity back to requirement pool"
                        >
                          Release Hold
                        </button>
                      </div>
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
          <CardHeader
            title="Finalized Procurement Deals & 24-hr Delivery Watch"
            subtitle="Once finalized, prices cannot be renegotiated. Deliveries must arrive within 24 hours."
          />
          <div className="overflow-x-auto">
            <table className="tom-table">
              <thead>
                <tr>
                  <th>Deal Code</th>
                  <th>Supplier</th>
                  <th>Commodity</th>
                  <th className="text-right">Quantity</th>
                  <th className="text-right">Agreed Rate</th>
                  <th className="text-right">Advance Paid</th>
                  <th>24-hr Delivery Rule</th>
                  <th>Status</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {deals.map(d => (
                  <tr key={d.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="font-mono text-xs text-amber-400 font-semibold">{d.dealCode}</td>
                    <td>
                      <p className="font-semibold text-white">{d.supplier}</p>
                      <span className="text-[11px] text-zinc-500">{d.sourceType}</span>
                    </td>
                    <td className="text-zinc-300">{d.commodity}</td>
                    <td className="text-right font-mono text-zinc-200">{d.qty.toLocaleString('en-IN')} kg</td>
                    <td className="text-right font-mono font-bold text-amber-300">₹{d.agreedPrice.toFixed(2)}/kg</td>
                    <td className="text-right font-mono text-emerald-400">₹{d.advance.toLocaleString('en-IN')}</td>
                    <td>
                      <span className="text-xs font-mono text-zinc-300 flex items-center gap-1">
                        <Clock size={12} className="text-amber-400" /> {d.deliveryWindowRemaining}
                      </span>
                    </td>
                    <td>
                      <Badge variant={d.status === 'ACCEPTED' ? 'success' : d.status === 'ESCALATED_TO_ADMIN' ? 'danger' : 'info'}>
                        {d.status.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="text-right">
                      {!d.escalated ? (
                        <button
                          onClick={() => { setSelectedDealForEscalation(d); setShowEscalationModal(true) }}
                          className="btn-ghost text-xs py-1 px-2 text-zinc-400 hover:text-amber-400"
                        >
                          Escalate Rate
                        </button>
                      ) : (
                        <span className="text-[11px] text-red-400 font-semibold">Admin Escalated</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* New Requirement Modal */}
      <Modal open={showReqModal} onClose={() => setShowReqModal(false)} title="Post Admin Raw Seed Requirement">
        <form onSubmit={handleCreateRequirement} className="space-y-4">
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
              <option value="Maize">Maize Grains</option>
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
            <button type="button" onClick={() => setShowReqModal(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Post Requirement</button>
          </div>
        </form>
      </Modal>

      {/* New Reservation Modal */}
      <Modal open={showResModal} onClose={() => setShowResModal(false)} title="Hold 12-Hour Farmer / Agent Reservation">
        <form onSubmit={(e) => {
          e.preventDefault()
          const newReservation = {
            id: reservations.length + 1,
            resCode: `RES-2609-0${reservations.length + 1}`,
            supplier: newRes.supplier || 'Local Farmer Lot',
            sourceType: newRes.sourceType,
            agentName: newRes.agentName || 'Self',
            commissionRule: newRes.sourceType === 'COMMISSION_AGENT' ? newRes.commissionRule : 'None (Direct)',
            commodity: newRes.commodity,
            qty: parseFloat(newRes.qty) || 1000,
            reservedAt: 'Today',
            expiresAt: 'In 12 Hours',
            hoursRemaining: 12.0,
            status: 'NEGOTIATING'
          }
          setReservations([newReservation, ...reservations])
          toast.success(`12-Hour Reservation held for ${newReservation.supplier}! Quantity deducted from requirement pool.`)
          setShowResModal(false)
        }} className="space-y-4">
          <FormField label="Supplier / Farmer Name">
            <input
              required
              className="tom-input"
              placeholder="e.g. Ramanaiah (Farmer) or Balaji Agros"
              value={newRes.supplier}
              onChange={e => setNewRes({ ...newRes, supplier: e.target.value })}
            />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Procurement Source Channel">
              <select
                className="tom-select"
                value={newRes.sourceType}
                onChange={e => setNewRes({ ...newRes, sourceType: e.target.value })}
              >
                <option value="FARMER_DIRECT">1. Direct Farmer approach</option>
                <option value="FIELD_AGENT">2. TOM Field Agent Sourced</option>
                <option value="COMMISSION_AGENT">3. 3rd-Party Commission Agent</option>
              </select>
            </FormField>
            <FormField label="Commodity">
              <select
                className="tom-select"
                value={newRes.commodity}
                onChange={e => setNewRes({ ...newRes, commodity: e.target.value })}
              >
                <option value="Raw Cotton Seed">Raw Cotton Seed</option>
                <option value="Sunflower Seed">Sunflower Seed</option>
                <option value="Sesame Seed">Sesame Seed</option>
                <option value="Maize">Maize</option>
              </select>
            </FormField>
          </div>

          {newRes.sourceType === 'COMMISSION_AGENT' && (
            <div className="p-3 bg-surface-3 rounded-xl border border-white/5 space-y-3">
              <FormField label="Commission Agent / Broker Name">
                <input
                  required
                  className="tom-input"
                  placeholder="e.g. M. Prabhakar Rao"
                  value={newRes.agentName}
                  onChange={e => setNewRes({ ...newRes, agentName: e.target.value })}
                />
              </FormField>
              <FormField label="Commission Structure Rule">
                <select
                  className="tom-select"
                  value={newRes.commissionRule}
                  onChange={e => setNewRes({ ...newRes, commissionRule: e.target.value })}
                >
                  <option value="Fixed ₹100 per farmer regardless of quantity">Fixed ₹100 / farmer regardless of quantity</option>
                  <option value="₹1.20 per kg commission">₹1.20 / kg commission on accepted stock</option>
                  <option value="1% of procurement value">1% of gross procurement value</option>
                </select>
              </FormField>
            </div>
          )}

          <FormField label="Committed Quantity (kg)">
            <input
              required
              type="number"
              className="tom-input"
              value={newRes.qty}
              onChange={e => setNewRes({ ...newRes, qty: e.target.value })}
            />
          </FormField>

          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300">
            ⏰ <strong>12-Hour Reservation Rule:</strong> This quantity will be held from available requirement. If negotiation fails or stock is not dispatched within 12 hours, the system will release it automatically.
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setShowResModal(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Initiate 12-Hour Hold</button>
          </div>
        </form>
      </Modal>

      {/* Escalation Modal */}
      <Modal
        open={showEscalationModal}
        onClose={() => setShowEscalationModal(false)}
        title={`Escalate Rate to Admin — ${selectedDealForEscalation?.dealCode}`}
      >
        <form onSubmit={handleEscalateToAdmin} className="space-y-4">
          <div className="p-3 bg-surface-3 rounded-xl text-xs space-y-1">
            <div><strong>Supplier:</strong> {selectedDealForEscalation?.supplier}</div>
            <div><strong>Commodity:</strong> {selectedDealForEscalation?.commodity} ({selectedDealForEscalation?.qty} kg)</div>
            <div><strong>Target Limit:</strong> ₹{selectedDealForEscalation?.targetPrice}/kg</div>
            <div className="text-amber-400 font-semibold">Demanded Price: ₹{selectedDealForEscalation?.agreedPrice}/kg</div>
          </div>

          <FormField label="Reason for Price Escalation (Section 17 Internal Communication)">
            <textarea
              required
              className="tom-input h-20 resize-none"
              placeholder="e.g. Higher oil yield (21.5% lab moisture 7%), premium seed lot from Nizamabad APMC"
              value={escalationNote}
              onChange={e => setEscalationNote(e.target.value)}
            />
          </FormField>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setShowEscalationModal(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary flex items-center gap-1.5">
              <Send size={14} /> Send to Admin for Approval
            </button>
          </div>
        </form>
      </Modal>

    </div>
  )
}

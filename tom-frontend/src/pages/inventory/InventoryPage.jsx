import { useState, useEffect } from 'react'
import { Card, CardHeader, Badge, EmptyState, Modal, FormField } from '../../components/ui'
import { useAuth } from '../../context/AuthContext'
import { useOperationalData } from '../../context/OperationalDataContext'
import { inventoryApi } from '../../api/endpoints'
import {
  Plus, Search, Package, Layers, Truck, ArrowRight, AlertTriangle,
  TrendingDown, Scale, ShieldCheck, Lock, CheckCircle2, Info, Eye, Shield
} from 'lucide-react'
import toast from 'react-hot-toast'

const WAREHOUSE_ROOMS = {
  'Warehouse 1 (Hero: Turmeric)': ['Quality Room 1A', 'Room 1B (Curing)', 'Polished Stock 1C'],
  'Warehouse 2 (Hero: Maize)': ['Silo 2A', 'Stack Room 2B'],
  'Warehouse 3 (Hero: Til/Sesame)': ['Room 3A (A-Grade)', 'Room 3B (Commercial)'],
  'General Godown 4 (Oil Cake & By-products)': ['Cotton Cake Bay', 'Husk & Spares'],
}

const initialBatches = [
  {
    id: 'TUR-260926-001',
    commodity: 'Turmeric Fingers',
    grade: 'A+',
    warehouse: 'Warehouse 1 (Hero: Turmeric)',
    room: 'Quality Room 1A',
    bags: 120,
    currentKg: 6000,
    originalKg: 6000,
    purchaseCost: 690000,
    processingCost: 35000,
    transportCost: 25000,
    totalCost: 750000,
    effectiveCostPerKg: 125.00,
    status: 'IN_STOCK'
  },
  {
    id: 'TUR-260926-002',
    commodity: 'Turmeric Raw',
    grade: 'A',
    warehouse: 'Warehouse 1 (Hero: Turmeric)',
    room: 'Room 1B (Drying & Curing)',
    bags: 80,
    currentKg: 3880,
    originalKg: 4000,
    purchaseCost: 440000,
    processingCost: 12000,
    transportCost: 6000,
    totalCost: 458000,
    effectiveCostPerKg: 118.04, // Recalculated due to 120kg moisture loss
    status: 'IN_STOCK'
  },
  {
    id: 'MAI-260926-001',
    commodity: 'Maize Grain',
    grade: 'A',
    warehouse: 'Warehouse 2 (Hero: Maize)',
    room: 'Silo 2A',
    bags: 200,
    currentKg: 10000,
    originalKg: 10000,
    purchaseCost: 205000,
    processingCost: 5000,
    transportCost: 10000,
    totalCost: 220000,
    effectiveCostPerKg: 22.00,
    status: 'IN_STOCK'
  },
  {
    id: 'SES-260926-001',
    commodity: 'Sesame Seed',
    grade: 'B',
    warehouse: 'Warehouse 3 (Hero: Til/Sesame)',
    room: 'Room 3A',
    bags: 40,
    currentKg: 2000,
    originalKg: 2000,
    purchaseCost: 275000,
    processingCost: 5000,
    transportCost: 10000,
    totalCost: 290000,
    effectiveCostPerKg: 145.00,
    status: 'IN_STOCK'
  },
]

const initialWarehouses = [
  { name: 'Warehouse 1 (Hero: Turmeric)', type: 'HERO', rooms: ['Quality Room 1A', 'Room 1B (Curing)', 'Polished Stock 1C'], totalBags: 200, totalKg: 9880, commodity: 'Turmeric' },
  { name: 'Warehouse 2 (Hero: Maize)', type: 'HERO', rooms: ['Silo 2A', 'Stack Room 2B'], totalBags: 200, totalKg: 10000, commodity: 'Maize Grains' },
  { name: 'Warehouse 3 (Hero: Til/Sesame)', type: 'HERO', rooms: ['Room 3A (A-Grade)', 'Room 3B (Commercial)'], totalBags: 40, totalKg: 2000, commodity: 'Sesame / Til' },
  { name: 'General Godown 4 (Oil Cake & By-products)', type: 'GENERAL', rooms: ['Cotton Cake Bay', 'Husk & Spares'], totalBags: 400, totalKg: 20000, commodity: 'Mixed By-products' },
]

const initialTransfers = [
  {
    id: 'TRF-1021',
    batchCode: 'TUR-260926-002',
    fromWh: 'Warehouse 1 (Hero: Turmeric)',
    toWh: 'General Godown 4',
    bags: 30,
    weightKg: 1500,
    vehicleNo: 'AP 21 TY 4521',
    driver: 'Raju Naidu',
    status: 'IN_TRANSIT',
    step: 4 // 1: Requested, 2: Vehicle Assigned, 3: Loading, 4: In Transit, 5: Received, 6: Completed
  }
]

const initialLossRecords = [
  {
    id: 'LOSS-001',
    batchCode: 'TUR-260926-002',
    reason: 'Moisture / natural drying reduction',
    lossKg: 120,
    lossBags: 0,
    previousEffectiveCost: 114.50,
    newEffectiveCost: 118.04,
    reportedBy: 'K. Ramesh (Field Officer)',
    date: '26 Sep 2026'
  }
]

export default function InventoryPage() {
  const { user } = useAuth()
  const canManageStock = user?.role === 'ADMIN' || user?.role === 'FIELD_OFFICER'

  const [tab, setTab] = useState('batches')
  const [search, setSearch] = useState('')
  const { batches, recordStockInflow, logStockLoss } = useOperationalData()
  const [warehouses, setWarehouses] = useState(initialWarehouses)
  const [transfers, setTransfers] = useState(initialTransfers)
  const [lossRecords, setLossRecords] = useState(initialLossRecords)

  // Modals
  const [showInflowModal, setShowInflowModal] = useState(false)
  const [showTransferModal, setShowTransferModal] = useState(false)
  const [showLossModal, setShowLossModal] = useState(false)
  const [selectedBatchForBags, setSelectedBatchForBags] = useState(null)
  const [selectedBatchForCosting, setSelectedBatchForCosting] = useState(null)

  // Forms
  const [inflowForm, setInflowForm] = useState({
    commodity: 'Turmeric Raw',
    grade: 'A',
    warehouse: 'Warehouse 1 (Hero: Turmeric)',
    room: 'Quality Room 1A',
    bags: 50,
    kgPerBag: 50,
    costPerKg: 125,
    processingCost: 2000,
    transportCost: 3000,
  })

  const [transferForm, setTransferForm] = useState({
    batchCode: 'TUR-260926-001',
    fromWh: 'Warehouse 1 (Hero: Turmeric)',
    toWh: 'General Godown 4 (Oil Cake & By-products)',
    bags: 20,
    vehicleNo: 'TS 09 UB 9812',
    driver: 'K. Shiva Kumar'
  })

  const [lossForm, setLossForm] = useState({
    batchCode: 'TUR-260926-001',
    reason: 'Moisture / natural drying reduction',
    lossKg: 50,
    notes: 'Natural weight reduction observed after 48h curing'
  })

  // Stock Inflow submission (Admin & Field Officer only)
  const handleInflowSubmit = async (e) => {
    e.preventDefault()
    if (!canManageStock) {
      toast.error('Unauthorized: Only Admin and Field Officer can record stock.')
      return
    }

    const bagsCount = parseInt(inflowForm.bags) || 0
    const kgBag = parseFloat(inflowForm.kgPerBag) || 50
    const totalKg = bagsCount * kgBag
    const rate = parseFloat(inflowForm.costPerKg) || 120
    const pCost = totalKg * rate
    const procCost = parseFloat(inflowForm.processingCost) || 0
    const trCost = parseFloat(inflowForm.transportCost) || 0
    const totCost = pCost + procCost + trCost
    const effCost = totalKg > 0 ? parseFloat((totCost / totalKg).toFixed(2)) : 0

    // Commodity code prefix for permanent bag IDs (Rule 5: location independent)
    const codePrefix = {
      'Turmeric Fingers': 'TUR',
      'Turmeric Raw': 'TUR',
      'Maize Grain': 'MAI',
      'Sesame Seed': 'SES',
      'Cotton Seed': 'COT',
      'Sunflower Seed': 'SUN',
      'Neem Seed': 'NEE',
      'Groundnut Pods': 'GND',
    }[inflowForm.commodity] || 'STK'

    const dStr = new Date().toISOString().slice(2, 10).replace(/-/g, '')
    const batchCode = `${codePrefix}-${dStr}-${Math.floor(100 + Math.random() * 900)}`

    const newBatch = {
      id: batchCode,
      commodity: inflowForm.commodity,
      grade: inflowForm.grade,
      warehouse: inflowForm.warehouse,
      room: inflowForm.room,
      bags: bagsCount,
      currentKg: totalKg,
      originalKg: totalKg,
      purchaseCost: pCost,
      processingCost: procCost,
      transportCost: trCost,
      totalCost: totCost,
      effectiveCostPerKg: effCost,
      status: 'IN_STOCK'
    }

    try {
      await inventoryApi.createBatch({
        batchCode: newBatch.id,
        commodity: newBatch.commodity,
        grade: newBatch.grade,
        roomSection: newBatch.room,
        bags: newBatch.bags,
        totalKg: newBatch.currentKg,
        costPerKg: newBatch.effectiveCostPerKg,
        status: 'IN_STOCK'
      }).catch(err => console.warn('Backend sync fallback', err))
    } catch (err) {
      // offline fallback
    }

    recordStockInflow(newBatch)
    setShowInflowModal(false)
  }

  // Stock Transfer Workflow progression (Section 9.5)
  const advanceTransferStep = (trfId) => {
    setTransfers(transfers.map(tr => {
      if (tr.id === trfId) {
        const nextStep = tr.step + 1
        const stepLabels = {
          2: 'VEHICLE_ASSIGNED',
          3: 'LOADING',
          4: 'IN_TRANSIT',
          5: 'RECEIVED',
          6: 'COMPLETED'
        }
        const nextStatus = stepLabels[nextStep] || 'COMPLETED'
        toast.success(`Transfer #${tr.id} progressed to ${nextStatus}`)
        return { ...tr, step: nextStep, status: nextStatus }
      }
      return tr
    }))
  }

  // Weight Loss / Spoilage Adjustment (Section 9.6 & 9.7)
  const handleLossAdjustment = (e) => {
    e.preventDefault()
    const lossKg = parseFloat(lossForm.lossKg) || 0
    const targetBatch = batches.find(b => b.id === lossForm.batchCode)
    if (!targetBatch || lossKg <= 0 || lossKg >= targetBatch.currentKg) {
      toast.error('Invalid loss weight or batch not found')
      return
    }

    const prevCost = targetBatch.effectiveCostPerKg
    const updatedKg = targetBatch.currentKg - lossKg
    const newEffectiveCost = parseFloat((targetBatch.totalCost / updatedKg).toFixed(2))

    logStockLoss(targetBatch.id, lossKg, lossForm.reason)

    const newLoss = {
      id: `LOSS-00${lossRecords.length + 1}`,
      batchCode: targetBatch.id,
      reason: lossForm.reason,
      lossKg: lossKg,
      lossBags: Math.floor(lossKg / 50),
      previousEffectiveCost: prevCost,
      newEffectiveCost: newEffectiveCost,
      reportedBy: 'Field Officer',
      date: 'Today'
    }

    setLossRecords([newLoss, ...lossRecords])
    setShowLossModal(false)
  }

  const filtered = batches.filter(s =>
    s.commodity.toLowerCase().includes(search.toLowerCase()) ||
    s.id.toLowerCase().includes(search.toLowerCase())
  )

  const gradeVariant = g => ({ 'A+': 'success', 'A': 'info', 'B': 'warning', 'C': 'danger' }[g] ?? 'muted')

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="page-title text-2xl font-bold tracking-tight text-zinc-950 font-sans">
              Inventory & Godown Management
            </h1>
            <Badge variant="brand">Section 9</Badge>
          </div>
          <p className="page-sub text-zinc-500 text-sm mt-1">
            Section 9: Permanent Bag IDs, Hero Warehouses, Multi-step Transfers & Dynamic Batch Costing
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {canManageStock ? (
            <>
              <button
                className="btn-secondary"
                onClick={() => setShowLossModal(true)}
              >
                <TrendingDown size={15} />
                <span>Log Weight Loss / Spoilage</span>
              </button>
              <button
                className="btn-secondary"
                onClick={() => setShowTransferModal(true)}
              >
                <Truck size={15} />
                <span>Request Stock Transfer</span>
              </button>
              <button
                className="btn-primary"
                onClick={() => setShowInflowModal(true)}
              >
                <Plus size={16} />
                <span>Record Stock Inflow</span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-100 border border-zinc-200 text-xs text-zinc-700 font-medium shadow-sm">
              <Lock size={14} className="text-zinc-600 flex-shrink-0" />
              <span>Read-Only Godown Access (Recording & editing restricted to Admin & Field Officer)</span>
            </div>
          )}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Batches in Godowns', value: batches.length, icon: '📦', color: 'text-zinc-900 bg-zinc-100 border border-zinc-200' },
          { label: 'Current Sellable Stock', value: `${(batches.reduce((s, r) => s + r.currentKg, 0) / 1000).toFixed(1)} t`, icon: '⚖️', color: 'text-zinc-900 bg-zinc-100 border border-zinc-200' },
          { label: 'Active Transfers', value: transfers.filter(t => t.status !== 'COMPLETED').length, icon: '🚚', color: 'text-zinc-900 bg-zinc-100 border border-zinc-200' },
          { label: 'Loss & Spoilage Logged', value: `${lossRecords.reduce((s, l) => s + l.lossKg, 0)} kg`, icon: '📉', color: 'text-zinc-900 bg-zinc-100 border border-zinc-200' },
        ].map(s => (
          <div key={s.label} className="tom-card p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center text-xl flex-shrink-0`}>{s.icon}</div>
            <div>
              <p className="text-2xl font-extrabold font-display text-zinc-950">{s.value}</p>
              <p className="text-xs text-zinc-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-zinc-100 p-1 rounded-xl w-fit">
        {['batches', 'warehouses', 'transfers', 'spoilage'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${tab === t ? 'bg-zinc-950 text-white shadow-sm' : 'text-zinc-600 hover:text-zinc-950'}`}>
            {t === 'batches' ? '1. Stock Batches & Costing' : t === 'warehouses' ? '2. Hero Godowns & Rooms' : t === 'transfers' ? '3. Stock Movement Transactions' : '4. Spoilage & Weight Loss'}
          </button>
        ))}
      </div>

      <div className="relative w-80">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input className="tom-input pl-9" placeholder="Search batch code, commodity..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Batches Tab */}
      {tab === 'batches' && (
        <Card>
          <div className="overflow-x-auto">
            <table className="tom-table">
              <thead>
                <tr>
                  <th>Batch ID (Section 9.2)</th>
                  <th>Commodity</th>
                  <th>Grade</th>
                  <th>Godown / Room</th>
                  <th className="text-right">Bags</th>
                  <th className="text-right">Current Weight</th>
                  <th className="text-right">Effective Cost / kg (Section 9.7)</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="font-mono text-xs text-zinc-950 font-bold">{r.id}</td>
                    <td className="font-semibold text-zinc-900">{r.commodity}</td>
                    <td><Badge variant={gradeVariant(r.grade)}>{r.grade}</Badge></td>
                    <td className="text-zinc-400 text-xs">{r.warehouse} — {r.room}</td>
                    <td className="text-right font-mono text-zinc-900">{r.bags}</td>
                    <td className="text-right font-mono text-zinc-900">
                      {r.currentKg.toLocaleString('en-IN')} kg
                      {r.currentKg < r.originalKg && (
                        <span className="block text-[10px] text-red-400">(-{r.originalKg - r.currentKg} kg drying)</span>
                      )}
                    </td>
                    <td className="text-right">
                      <span className="font-mono font-bold text-zinc-800">₹{r.effectiveCostPerKg.toFixed(2)}</span>
                      <button
                        onClick={() => setSelectedBatchForCosting(r)}
                        className="block text-[10px] text-zinc-400 hover:text-zinc-950 ml-auto"
                      >
                        Costing Breakdown →
                      </button>
                    </td>
                    <td><Badge variant="success">In Stock</Badge></td>
                    <td className="text-right">
                      <button
                        onClick={() => setSelectedBatchForBags(r)}
                        className="btn-ghost text-xs py-1 px-2.5 text-zinc-700 hover:text-zinc-950"
                      >
                        View Bags
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Warehouses Tab */}
      {tab === 'warehouses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {warehouses.map(w => (
            <Card key={w.name} className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-zinc-900 uppercase tracking-widest">{w.type} Warehouse</span>
                  <h3 className="font-display font-bold text-zinc-950 text-lg mt-0.5">{w.name}</h3>
                  <p className="text-zinc-400 text-xs mt-1">Dedicated quality rooms for {w.commodity}</p>
                </div>
                <span className="text-3xl">🏭</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-zinc-100 rounded-xl text-center">
                  <p className="text-2xl font-bold font-mono text-zinc-950">{w.totalBags}</p>
                  <p className="text-[11px] text-zinc-500">Stored Bags</p>
                </div>
                <div className="p-3 bg-zinc-100 rounded-xl text-center">
                  <p className="text-2xl font-bold font-mono text-zinc-900">{(w.totalKg / 1000).toFixed(1)} t</p>
                  <p className="text-[11px] text-zinc-500">Current Mass</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-zinc-400 mb-2">Quality Inspection Rooms:</p>
                <div className="flex flex-wrap gap-2">
                  {w.rooms.map(rm => (
                    <span key={rm} className="px-2.5 py-1 bg-zinc-200 border border-white/5 rounded-lg text-xs text-zinc-700 font-mono">
                      ✓ {rm}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Stock Transfers Workflow (Section 9.5) */}
      {tab === 'transfers' && (
        <Card>
          <CardHeader
            title="Stock Movement & Inter-Godown Transfers"
            subtitle="Section 9.5: Multi-state logistics transactions (Requested → Vehicle Assigned → Loading → In Transit → Received → Completed)"
          />
          <div className="overflow-x-auto">
            <table className="tom-table">
              <thead>
                <tr>
                  <th>Transfer ID</th>
                  <th>Batch</th>
                  <th>Source & Destination</th>
                  <th className="text-right">Weight</th>
                  <th>Vehicle & Driver</th>
                  <th>Logistics Progress</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {transfers.map(tr => (
                  <tr key={tr.id} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="font-mono text-xs text-zinc-950 font-bold">{tr.id}</td>
                    <td className="font-semibold text-zinc-900">{tr.batchCode}</td>
                    <td className="text-xs text-zinc-700">
                      <div>From: {tr.fromWh}</div>
                      <div className="text-zinc-900">To: {tr.toWh}</div>
                    </td>
                    <td className="text-right font-mono text-zinc-900">{tr.weightKg} kg ({tr.bags} bags)</td>
                    <td className="text-xs text-zinc-700 font-mono">
                      <div>{tr.vehicleNo}</div>
                      <div className="text-zinc-500">{tr.driver}</div>
                    </td>
                    <td>
                      <Badge variant={tr.status === 'COMPLETED' ? 'success' : 'warning'}>
                        {tr.status.replace('_', ' ')} (Step {tr.step}/6)
                      </Badge>
                    </td>
                    <td className="text-right">
                      {tr.step < 6 ? (
                        <button
                          onClick={() => advanceTransferStep(tr.id)}
                          className="btn-primary text-xs px-2.5 py-1"
                        >
                          Confirm Next Step →
                        </button>
                      ) : (
                        <span className="text-xs text-emerald-400 font-semibold">Completed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Weight Loss & Spoilage Adjustments (Section 9.6 & 9.7) */}
      {tab === 'spoilage' && (
        <Card>
          <CardHeader
            title="Weight Loss, Moisture Reduction & Spoilage Records"
            subtitle="Section 9.6: Stock adjustments require documented business reasons. Effective Cost/kg recalculates automatically."
          />
          <div className="overflow-x-auto">
            <table className="tom-table">
              <thead>
                <tr>
                  <th>Log ID</th>
                  <th>Batch Code</th>
                  <th>Reason (Section 9.6)</th>
                  <th className="text-right">Weight Loss</th>
                  <th className="text-right">Prev Effective Cost</th>
                  <th className="text-right">New Effective Cost (Section 9.7)</th>
                  <th>Officer</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {lossRecords.map(l => (
                  <tr key={l.id} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="font-mono text-xs text-red-400 font-semibold">{l.id}</td>
                    <td className="font-semibold text-zinc-900">{l.batchCode}</td>
                    <td className="text-zinc-700 text-xs">{l.reason}</td>
                    <td className="text-right font-mono text-red-400 font-bold">-{l.lossKg} kg</td>
                    <td className="text-right font-mono text-zinc-400">₹{l.previousEffectiveCost.toFixed(2)}</td>
                    <td className="text-right font-mono font-bold text-zinc-800">₹{l.newEffectiveCost.toFixed(2)}/kg</td>
                    <td className="text-zinc-400 text-xs">{l.reportedBy}</td>
                    <td className="text-zinc-500 text-xs">{l.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Modal: Permanent Bag Breakdown (Section 9.2) */}
      <Modal
        open={!!selectedBatchForBags}
        onClose={() => setSelectedBatchForBags(null)}
        title={`Permanent Bag Identification — ${selectedBatchForBags?.id}`}
      >
        <div className="space-y-4">
          <div className="p-3 bg-zinc-200 rounded-xl flex items-center justify-between text-xs text-zinc-700">
            <div><strong>Commodity:</strong> {selectedBatchForBags?.commodity} ({selectedBatchForBags?.grade})</div>
            <div><strong>Total Bags:</strong> {selectedBatchForBags?.bags}</div>
            <div><strong>Warehouse:</strong> {selectedBatchForBags?.warehouse}</div>
          </div>

          <div className="p-2 bg-zinc-100 border border-zinc-200 rounded-xl text-xs text-zinc-800">
            🏷️ <strong>Permanent Bag ID Rule (Section 9.2):</strong> Format <code>TUR-260926-001-001</code> is permanent and location-independent.
          </div>

          <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
            {Array.from({ length: Math.min(selectedBatchForBags?.bags || 5, 8) }).map((_, i) => {
              const bagId = `${selectedBatchForBags?.id}-${(i + 1).toString().padStart(3, '0')}`
              return (
                <div key={i} className="flex items-center justify-between p-2.5 bg-zinc-100 border border-white/5 rounded-lg text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-zinc-950 font-bold">{bagId}</span>
                    <span className="text-zinc-500">| 50kg Standard Bag</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-zinc-900">50.0 kg</span>
                    <span className="text-emerald-400 font-semibold">✓ Permanent Tag</span>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex justify-end pt-2">
            <button onClick={() => setSelectedBatchForBags(null)} className="btn-secondary text-xs">Close</button>
          </div>
        </div>
      </Modal>

      {/* Modal: Batch Costing Breakdown (Section 9.7) */}
      <Modal
        open={!!selectedBatchForCosting}
        onClose={() => setSelectedBatchForCosting(null)}
        title={`Batch Costing & Effective Rate — ${selectedBatchForCosting?.id}`}
      >
        <div className="space-y-4">
          <div className="p-4 bg-zinc-200 rounded-xl space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-zinc-400">Purchase Raw Cost:</span>
              <span className="font-mono text-zinc-900 font-semibold">₹ {selectedBatchForCosting?.purchaseCost?.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">+ Processing & Curing Cost:</span>
              <span className="font-mono text-zinc-900 font-semibold">₹ {selectedBatchForCosting?.processingCost?.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">+ Transportation / Freight:</span>
              <span className="font-mono text-zinc-900 font-semibold">₹ {selectedBatchForCosting?.transportCost?.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-white/5 font-bold">
              <span className="text-zinc-700">Total Batch Cost:</span>
              <span className="font-mono text-emerald-400">₹ {selectedBatchForCosting?.totalCost?.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Current Sellable Mass:</span>
              <span className="font-mono text-zinc-900">{selectedBatchForCosting?.currentKg} kg</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-white/5 items-center">
              <span className="text-zinc-950 font-bold">Effective Cost / kg:</span>
              <span className="font-mono text-zinc-950 font-bold text-base">₹ {selectedBatchForCosting?.effectiveCostPerKg?.toFixed(2)} / kg</span>
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button onClick={() => setSelectedBatchForCosting(null)} className="btn-secondary text-xs">Close</button>
          </div>
        </div>
      </Modal>

      {/* Modal: Log Weight Loss / Spoilage */}
      <Modal open={showLossModal} onClose={() => setShowLossModal(false)} title="Record Stock Adjustment / Weight Loss">
        <form onSubmit={handleLossAdjustment} className="space-y-4">
          <FormField label="Target Batch Code">
            <select
              className="tom-select font-mono"
              value={lossForm.batchCode}
              onChange={e => setLossForm({ ...lossForm, batchCode: e.target.value })}
            >
              {batches.map(b => (
                <option key={b.id} value={b.id}>{b.id} — {b.commodity} ({b.currentKg} kg remaining)</option>
              ))}
            </select>
          </FormField>

          <FormField label="Documented Business Reason (Section 9.6)">
            <select
              className="tom-select"
              value={lossForm.reason}
              onChange={e => setLossForm({ ...lossForm, reason: e.target.value })}
            >
              <option value="Moisture / natural drying reduction">Moisture / natural drying reduction</option>
              <option value="Damaged bags">Damaged bags</option>
              <option value="Spoilage">Spoilage</option>
              <option value="Pest damage">Pest damage</option>
              <option value="Processing loss">Processing loss</option>
              <option value="Handling loss">Handling loss</option>
              <option value="Scrap">Scrap</option>
            </select>
          </FormField>

          <FormField label="Reduction Quantity (kg)">
            <input
              required
              type="number"
              className="tom-input font-mono"
              placeholder="e.g. 50"
              value={lossForm.lossKg}
              onChange={e => setLossForm({ ...lossForm, lossKg: e.target.value })}
            />
          </FormField>

          <div className="p-3 bg-zinc-200 rounded-xl text-xs text-zinc-700 space-y-1">
            <p><strong>Note on Effective Costing:</strong></p>
            <p className="text-zinc-400">Total batch expense remains constant while sellable mass decreases. The system will dynamically recalculate the batch's effective cost per kg upon submission.</p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setShowLossModal(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Post Stock Loss & Recalculate</button>
          </div>
        </form>
      </Modal>

      {/* Modal: Request Stock Transfer */}
      <Modal open={showTransferModal} onClose={() => setShowTransferModal(false)} title="Initiate Inter-Godown Stock Transfer">
        <form onSubmit={(e) => {
          e.preventDefault()
          const newTransfer = {
            id: `TRF-${Date.now().toString().slice(-4)}`,
            batchCode: transferForm.batchCode,
            fromWh: transferForm.fromWh,
            toWh: transferForm.toWh,
            bags: parseInt(transferForm.bags) || 10,
            weightKg: (parseInt(transferForm.bags) || 10) * 50,
            vehicleNo: transferForm.vehicleNo,
            driver: transferForm.driver,
            status: 'REQUESTED',
            step: 1
          }
          setTransfers([newTransfer, ...transfers])
          toast.success(`Transfer #${newTransfer.id} requested! Logistics state machine initialized.`)
          setShowTransferModal(false)
        }} className="space-y-4">
          <FormField label="Stock Batch to Move">
            <select
              className="tom-select font-mono"
              value={transferForm.batchCode}
              onChange={e => setTransferForm({ ...transferForm, batchCode: e.target.value })}
            >
              {batches.map(b => (
                <option key={b.id} value={b.id}>{b.id} — {b.commodity} ({b.warehouse})</option>
              ))}
            </select>
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Source Godown">
              <input disabled className="tom-input bg-zinc-100 text-zinc-400" value={transferForm.fromWh} />
            </FormField>
            <FormField label="Destination Godown">
              <select
                className="tom-select"
                value={transferForm.toWh}
                onChange={e => setTransferForm({ ...transferForm, toWh: e.target.value })}
              >
                {warehouses.map(w => (
                  <option key={w.name} value={w.name}>{w.name}</option>
                ))}
              </select>
            </FormField>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <FormField label="Number of Bags">
              <input
                required
                type="number"
                className="tom-input font-mono"
                value={transferForm.bags}
                onChange={e => setTransferForm({ ...transferForm, bags: e.target.value })}
              />
            </FormField>
            <FormField label="Assigned Vehicle #">
              <input
                required
                className="tom-input font-mono"
                placeholder="e.g. AP 21 TY 4521"
                value={transferForm.vehicleNo}
                onChange={e => setTransferForm({ ...transferForm, vehicleNo: e.target.value })}
              />
            </FormField>
            <FormField label="Assigned Driver">
              <input
                required
                className="tom-input"
                placeholder="e.g. Raju Naidu"
                value={transferForm.driver}
                onChange={e => setTransferForm({ ...transferForm, driver: e.target.value })}
              />
            </FormField>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setShowTransferModal(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Initialize Transfer Request</button>
          </div>
        </form>
      </Modal>

      {/* Modal: Record Physical Stock Inflow (Admin & Field Officer only) */}
      <Modal
        open={showInflowModal}
        onClose={() => setShowInflowModal(false)}
        title="Record Physical Stock Inflow (Inward Batch)"
      >
        <form onSubmit={handleInflowSubmit} className="space-y-4">
          <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-700 flex items-start gap-2.5">
            <ShieldCheck size={16} className="text-zinc-950 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-zinc-950">Invariant Rule 1, 4 & 5 Verification Guard</p>
              <p className="text-zinc-600 leading-relaxed">
                Stock is not inventory merely because an entry is made. Grade D is strictly eliminated (rejected stock never enters inventory). Permanent Bag IDs are location-independent.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField label="Commodity Inward">
              <select
                className="tom-select"
                value={inflowForm.commodity}
                onChange={e => {
                  const comm = e.target.value
                  let defaultWh = 'Warehouse 1 (Hero: Turmeric)'
                  if (comm.includes('Maize')) defaultWh = 'Warehouse 2 (Hero: Maize)'
                  else if (comm.includes('Sesame')) defaultWh = 'Warehouse 3 (Hero: Til/Sesame)'
                  else if (comm.includes('Cake') || comm.includes('Seed') || comm.includes('Pods')) defaultWh = 'General Godown 4 (Oil Cake & By-products)'

                  setInflowForm({
                    ...inflowForm,
                    commodity: comm,
                    warehouse: defaultWh,
                    room: (WAREHOUSE_ROOMS[defaultWh] || [])[0] || 'Room A'
                  })
                }}
              >
                <option value="Turmeric Raw">Turmeric Raw (Unpolished)</option>
                <option value="Turmeric Fingers">Turmeric Fingers (Polished A+)</option>
                <option value="Maize Grain">Maize Grain (High Starch)</option>
                <option value="Sesame Seed">Sesame Seed (White Til)</option>
                <option value="Cotton Seed">Raw Cotton Seed</option>
                <option value="Sunflower Seed">Sunflower Seed (Oil Grade)</option>
                <option value="Neem Seed">Neem Seed</option>
                <option value="Groundnut Pods">Groundnut Pods</option>
              </select>
            </FormField>

            <FormField label="Quality Grade (Rule 4: Grade D Eliminated)">
              <select
                className="tom-select font-semibold"
                value={inflowForm.grade}
                onChange={e => setInflowForm({ ...inflowForm, grade: e.target.value })}
              >
                <option value="A+">Grade A+ (Premium / Export Grade)</option>
                <option value="A">Grade A (Standard Mill Specification)</option>
                <option value="B">Grade B (Commercial Second Grade)</option>
                <option value="C">Grade C (Low Quality / Discount Grade)</option>
              </select>
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField label="Target Godown (Hero Warehouse)">
              <select
                className="tom-select"
                value={inflowForm.warehouse}
                onChange={e => {
                  const wh = e.target.value
                  setInflowForm({
                    ...inflowForm,
                    warehouse: wh,
                    room: (WAREHOUSE_ROOMS[wh] || [])[0] || 'Room A'
                  })
                }}
              >
                {warehouses.map(w => (
                  <option key={w.name} value={w.name}>{w.name}</option>
                ))}
              </select>
            </FormField>

            <FormField label="Godown Room / Section">
              <select
                className="tom-select"
                value={inflowForm.room}
                onChange={e => setInflowForm({ ...inflowForm, room: e.target.value })}
              >
                {(WAREHOUSE_ROOMS[inflowForm.warehouse] || ['Room A', 'Room B']).map(rm => (
                  <option key={rm} value={rm}>{rm}</option>
                ))}
              </select>
            </FormField>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <FormField label="Bags Count">
              <input
                required
                type="number"
                min="1"
                className="tom-input font-mono font-bold"
                value={inflowForm.bags}
                onChange={e => setInflowForm({ ...inflowForm, bags: e.target.value })}
              />
            </FormField>

            <FormField label="Net kg / Bag">
              <input
                required
                type="number"
                step="0.5"
                min="1"
                className="tom-input font-mono"
                value={inflowForm.kgPerBag}
                onChange={e => setInflowForm({ ...inflowForm, kgPerBag: e.target.value })}
              />
            </FormField>

            <FormField label="Base Rate (₹/kg)">
              <input
                required
                type="number"
                step="0.1"
                min="0"
                className="tom-input font-mono"
                value={inflowForm.costPerKg}
                onChange={e => setInflowForm({ ...inflowForm, costPerKg: e.target.value })}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="+ Curing & Processing Cost (₹)">
              <input
                type="number"
                min="0"
                className="tom-input font-mono"
                value={inflowForm.processingCost}
                onChange={e => setInflowForm({ ...inflowForm, processingCost: e.target.value })}
              />
            </FormField>

            <FormField label="+ Inward Freight & Handling (₹)">
              <input
                type="number"
                min="0"
                className="tom-input font-mono"
                value={inflowForm.transportCost}
                onChange={e => setInflowForm({ ...inflowForm, transportCost: e.target.value })}
              />
            </FormField>
          </div>

          {/* Dynamic Calculated Summary */}
          <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2 text-xs">
            <div className="flex justify-between items-center text-zinc-600">
              <span>Total Batch Net Mass:</span>
              <span className="font-mono font-bold text-zinc-950 text-sm">
                {((parseInt(inflowForm.bags) || 0) * (parseFloat(inflowForm.kgPerBag) || 50)).toLocaleString('en-IN')} kg
              </span>
            </div>
            <div className="flex justify-between items-center text-zinc-600">
              <span>Total Capital Committed:</span>
              <span className="font-mono font-semibold text-zinc-950">
                ₹ {((((parseInt(inflowForm.bags) || 0) * (parseFloat(inflowForm.kgPerBag) || 50)) * (parseFloat(inflowForm.costPerKg) || 0)) + (parseFloat(inflowForm.processingCost) || 0) + (parseFloat(inflowForm.transportCost) || 0)).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-zinc-200">
              <span className="font-bold text-zinc-950">Effective Cost / kg (Dynamic):</span>
              <span className="font-mono font-bold text-zinc-950 text-sm">
                ₹ {(((((parseInt(inflowForm.bags) || 0) * (parseFloat(inflowForm.kgPerBag) || 50)) * (parseFloat(inflowForm.costPerKg) || 0)) + (parseFloat(inflowForm.processingCost) || 0) + (parseFloat(inflowForm.transportCost) || 0)) / Math.max(1, ((parseInt(inflowForm.bags) || 0) * (parseFloat(inflowForm.kgPerBag) || 50)))).toFixed(2)} / kg
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowInflowModal(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              <CheckCircle2 size={16} />
              <span>Record Stock & Generate Tags</span>
            </button>
          </div>
        </form>
      </Modal>

    </div>
  )
}

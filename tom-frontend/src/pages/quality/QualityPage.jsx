import { useState } from 'react'
import { Card, CardHeader, Badge, Modal, FormField } from '../../components/ui'
import { CheckSquare, Plus, Search, AlertCircle, ShieldCheck, AlertTriangle, ArrowRight, Layers } from 'lucide-react'
import toast from 'react-hot-toast'

const initialInspections = [
  {
    id: 'QA-260926-001',
    batchCode: 'TUR-260926-001',
    commodity: 'Raw Cotton Seed',
    receivedKg: 1000,
    acceptedKg: 800,
    rejectedKg: 200,
    grade: 'A+',
    moisture: '7.8%',
    colour: 'Bright Yellow / White',
    appearance: 'Sound dry seeds, no mold',
    ffa: '1.2%',
    processingRequired: false,
    processingSteps: [],
    status: 'PARTIALLY_ACCEPTED',
    testedBy: 'K. Ramesh (Field Officer)',
    date: '26 Sep 2026'
  },
  {
    id: 'QA-260926-002',
    batchCode: 'SUN-260926-003',
    commodity: 'Sunflower Seed',
    receivedKg: 5000,
    acceptedKg: 5000,
    rejectedKg: 0,
    grade: 'A',
    moisture: '8.4%',
    colour: 'Deep Black Striped',
    appearance: 'Uniform maturity',
    ffa: '0.8%',
    processingRequired: false,
    processingSteps: [],
    status: 'FULLY_ACCEPTED',
    testedBy: 'P. Suresh',
    date: '26 Sep 2026'
  },
  {
    id: 'QA-260926-003',
    batchCode: 'TUR-260926-002',
    commodity: 'Turmeric Raw Fingers',
    receivedKg: 2000,
    acceptedKg: 1500,
    rejectedKg: 500,
    grade: 'B',
    moisture: '12.5%',
    colour: 'Deep Orange',
    appearance: 'High moisture, raw unpolished',
    ffa: '2.1%',
    processingRequired: true,
    processingSteps: ['Drying', 'Cleaning', 'Polishing'],
    status: 'NEEDS_PROCESSING',
    testedBy: 'K. Ramesh (Field Officer)',
    date: '25 Sep 2026'
  },
  {
    id: 'QA-260926-004',
    batchCode: 'TUR-260926-004',
    commodity: 'Groundnut Pods',
    receivedKg: 1200,
    acceptedKg: 0,
    rejectedKg: 1200,
    grade: 'REJECTED',
    moisture: '16.2%',
    colour: 'Discolored / Grey',
    appearance: 'D-level condition: High aflatoxin & insect infestation',
    ffa: '4.8%',
    processingRequired: false,
    processingSteps: [],
    status: 'FULLY_REJECTED',
    testedBy: 'K. Ramesh',
    date: '25 Sep 2026'
  }
]

export default function QualityPage() {
  const [inspections, setInspections] = useState(initialInspections)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [detailModal, setDetailModal] = useState(null)

  const [form, setForm] = useState({
    batchCode: '',
    commodity: 'Raw Cotton Seed',
    receivedKg: 1000,
    acceptedKg: 1000,
    rejectedKg: 0,
    grade: 'A',
    moisture: 8.0,
    colour: 'Natural Golden',
    appearance: 'Sound dry mature seeds',
    ffa: 1.0,
    needsDrying: false,
    needsCleaning: false,
    needsPolishing: false,
  })

  const handleCreate = (e) => {
    e.preventDefault()
    const rec = parseFloat(form.receivedKg) || 0
    const acc = parseFloat(form.acceptedKg) || 0
    const rej = Math.max(0, rec - acc)

    const steps = []
    if (form.needsDrying) steps.push('Drying')
    if (form.needsCleaning) steps.push('Cleaning')
    if (form.needsPolishing) steps.push('Polishing')

    let status = 'FULLY_ACCEPTED'
    if (form.grade === 'REJECTED' || acc === 0) {
      status = 'FULLY_REJECTED'
    } else if (rej > 0 && steps.length > 0) {
      status = 'NEEDS_PROCESSING'
    } else if (rej > 0) {
      status = 'PARTIALLY_ACCEPTED'
    } else if (steps.length > 0) {
      status = 'NEEDS_PROCESSING'
    }

    const newRecord = {
      id: `QA-260926-00${inspections.length + 1}`,
      batchCode: form.batchCode || `LOT-${Date.now().toString().slice(-5)}`,
      commodity: form.commodity,
      receivedKg: rec,
      acceptedKg: acc,
      rejectedKg: rej,
      grade: acc > 0 ? form.grade : 'REJECTED',
      moisture: `${form.moisture}%`,
      colour: form.colour,
      appearance: form.appearance,
      ffa: `${form.ffa}%`,
      processingRequired: steps.length > 0,
      processingSteps: steps,
      status: status,
      testedBy: 'Field Officer K. Ramesh',
      date: 'Today'
    }

    setInspections([newRecord, ...inspections])
    toast.success(`Quality Inspection #${newRecord.id} recorded! Accepted: ${acc} kg (${form.grade}), Rejected: ${rej} kg`)
    setModalOpen(false)
  }

  const filtered = inspections.filter(t =>
    t.batchCode.toLowerCase().includes(search.toLowerCase()) ||
    t.commodity.toLowerCase().includes(search.toLowerCase()) ||
    t.id.toLowerCase().includes(search.toLowerCase())
  )

  const gradeVariant = g => ({
    'A+': 'success',
    'A': 'info',
    'B': 'warning',
    'C': 'warning',
    'REJECTED': 'danger'
  }[g] ?? 'muted')

  const totalAcceptedKg = inspections.reduce((sum, i) => sum + i.acceptedKg, 0)
  const totalRejectedKg = inspections.reduce((sum, i) => sum + i.rejectedKg, 0)

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="page-title text-2xl font-bold tracking-tight text-zinc-950 font-display">Quality & Lab Inspection</h1>
          <p className="page-sub text-zinc-400 text-sm mt-1">
            Section 8.7 & 8.8: Primary factors (Moisture, Colour, Appearance), Grades (A+, A, B, C only), and Partial Acceptance/Rejection
          </p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary">
          <Plus size={16} /> Record Inspection & Grading
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Samples Tested', value: inspections.length, icon: '🧪', color: 'text-zinc-900 bg-zinc-100 border border-zinc-200' },
          { label: 'Accepted into Stock', value: `${(totalAcceptedKg / 1000).toFixed(1)} t`, icon: '✅', color: 'text-zinc-900 bg-zinc-100 border border-zinc-200' },
          { label: 'Rejected (Non-payable)', value: `${(totalRejectedKg / 1000).toFixed(1)} t`, icon: '⛔', color: 'text-zinc-900 bg-zinc-100 border border-zinc-200' },
          { label: 'Under Processing', value: inspections.filter(i => i.processingRequired).length, icon: '⚙️', color: 'text-zinc-900 bg-zinc-100 border border-zinc-200' }
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

      {/* Info Notice about Grade D */}
      <div className="p-3 bg-zinc-100 border border-zinc-200 rounded-xl text-xs text-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle size={15} className="flex-shrink-0 text-zinc-900" />
          <span><strong>Mill Policy Rule (Section 8.7):</strong> There is no Grade D. D-level condition triggers outright rejection. Rejected stock never enters inventory and is not payable.</span>
        </div>
      </div>

      <div className="relative w-80">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input
          className="tom-input pl-9"
          placeholder="Search by lot, commodity, ID..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="tom-table">
            <thead>
              <tr>
                <th>Test ID</th>
                <th>Lot / Batch Code</th>
                <th>Commodity</th>
                <th className="text-right">Received</th>
                <th className="text-right">Accepted</th>
                <th className="text-right">Rejected</th>
                <th>Grade</th>
                <th>Moisture / FFA</th>
                <th>Processing Chain</th>
                <th>Status</th>
                <th className="text-right">Details</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id} className="hover:bg-zinc-50/80 transition-colors">
                  <td className="font-mono text-xs text-zinc-950 font-bold">{t.id}</td>
                  <td className="font-semibold text-zinc-900">{t.batchCode}</td>
                  <td>{t.commodity}</td>
                  <td className="text-right font-mono text-zinc-700">{t.receivedKg.toLocaleString('en-IN')} kg</td>
                  <td className="text-right font-mono text-emerald-400 font-bold">{t.acceptedKg.toLocaleString('en-IN')} kg</td>
                  <td className="text-right font-mono text-red-400">{t.rejectedKg.toLocaleString('en-IN')} kg</td>
                  <td>
                    <Badge variant={gradeVariant(t.grade)}>
                      {t.grade === 'REJECTED' ? 'REJECTED' : `Grade ${t.grade}`}
                    </Badge>
                  </td>
                  <td className="text-xs font-mono text-zinc-700">{t.moisture} | {t.ffa}</td>
                  <td>
                    {t.processingRequired ? (
                      <span className="text-xs font-medium text-zinc-900 flex items-center gap-1">
                        <Layers size={13} /> {t.processingSteps.join(' → ')}
                      </span>
                    ) : (
                      <span className="text-xs text-zinc-500">Direct to Stock</span>
                    )}
                  </td>
                  <td>
                    <Badge variant={t.status === 'FULLY_ACCEPTED' ? 'success' : t.status === 'FULLY_REJECTED' ? 'danger' : 'warning'}>
                      {t.status.replace('_', ' ')}
                    </Badge>
                  </td>
                  <td className="text-right">
                    <button
                      onClick={() => setDetailModal(t)}
                      className="btn-ghost text-xs py-1 px-2 text-zinc-700 hover:text-zinc-950"
                    >
                      View Report
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* New Quality Inspection Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Record Incoming Stock Inspection & Grading">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Lot / Weighbridge Reference Code">
              <input
                required
                className="tom-input"
                placeholder="e.g. WB-260926-005"
                value={form.batchCode}
                onChange={e => setForm({ ...form, batchCode: e.target.value })}
              />
            </FormField>
            <FormField label="Commodity">
              <select
                className="tom-select"
                value={form.commodity}
                onChange={e => setForm({ ...form, commodity: e.target.value })}
              >
                <option value="Raw Cotton Seed">Raw Cotton Seed</option>
                <option value="Sunflower Seed">Sunflower Seed</option>
                <option value="Sesame Seed">Sesame Seed</option>
                <option value="Turmeric Raw Fingers">Turmeric Raw Fingers</option>
                <option value="Maize">Maize Grains</option>
              </select>
            </FormField>
          </div>

          {/* Partial Acceptance / Rejection */}
          <div className="p-3 bg-zinc-200 rounded-xl border border-white/5 space-y-3">
            <p className="text-xs font-bold text-zinc-950 uppercase tracking-wider">Partial Acceptance / Rejection (Section 8.8)</p>
            <div className="grid grid-cols-3 gap-3">
              <FormField label="Received Weight (kg)">
                <input
                  required
                  type="number"
                  className="tom-input font-mono"
                  value={form.receivedKg}
                  onChange={e => {
                    const r = parseFloat(e.target.value) || 0
                    setForm({ ...form, receivedKg: r, acceptedKg: r })
                  }}
                />
              </FormField>
              <FormField label="Accepted Weight (kg)">
                <input
                  required
                  type="number"
                  className="tom-input font-mono text-emerald-400 font-bold"
                  value={form.acceptedKg}
                  onChange={e => setForm({ ...form, acceptedKg: parseFloat(e.target.value) || 0 })}
                />
              </FormField>
              <FormField label="Auto Rejected (kg)">
                <input
                  disabled
                  className="tom-input font-mono text-red-400 bg-zinc-100"
                  value={Math.max(0, form.receivedKg - form.acceptedKg)}
                />
              </FormField>
            </div>
            <p className="text-[11px] text-zinc-400">
              Only the accepted quantity will enter inventory and become payable to the supplier.
            </p>
          </div>

          {/* Grade Assignment */}
          <div className="grid grid-cols-3 gap-3">
            <FormField label="Assigned Grade (No Grade D)">
              <select
                className="tom-select"
                value={form.grade}
                onChange={e => setForm({ ...form, grade: e.target.value })}
              >
                <option value="A+">Grade A+ (Premium - Moisture &lt; 8%)</option>
                <option value="A">Grade A (Standard Mill Grade)</option>
                <option value="B">Grade B (Commercial Quality)</option>
                <option value="C">Grade C (Sub-standard, needs conditioning)</option>
                <option value="REJECTED">D-Condition (Outright Rejection)</option>
              </select>
            </FormField>
            <FormField label="Moisture Content (%)">
              <input
                required
                type="number"
                step="0.1"
                className="tom-input font-mono"
                value={form.moisture}
                onChange={e => setForm({ ...form, moisture: parseFloat(e.target.value) || 0 })}
              />
            </FormField>
            <FormField label="Free Fatty Acid FFA (%)">
              <input
                required
                type="number"
                step="0.05"
                className="tom-input font-mono"
                value={form.ffa}
                onChange={e => setForm({ ...form, ffa: parseFloat(e.target.value) || 0 })}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Visual Colour">
              <input
                className="tom-input"
                placeholder="e.g. Natural Yellow / Grey White"
                value={form.colour}
                onChange={e => setForm({ ...form, colour: e.target.value })}
              />
            </FormField>
            <FormField label="Physical Appearance">
              <input
                className="tom-input"
                placeholder="e.g. Uniform grain, free from stones and grit"
                value={form.appearance}
                onChange={e => setForm({ ...form, appearance: e.target.value })}
              />
            </FormField>
          </div>

          {/* Processing Decision Chain (Section 8.10) */}
          <div className="p-3 bg-zinc-200 rounded-xl border border-white/5 space-y-2">
            <p className="text-xs font-bold text-zinc-950 uppercase tracking-wider">Processing Decision (Section 8.10)</p>
            <div className="flex flex-wrap gap-4 text-xs text-zinc-700 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.needsDrying}
                  onChange={e => setForm({ ...form, needsDrying: e.target.checked })}
                  className="rounded accent-zinc-950"
                />
                Drying required (High moisture)
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.needsCleaning}
                  onChange={e => setForm({ ...form, needsCleaning: e.target.checked })}
                  className="rounded accent-zinc-950"
                />
                Cleaning / De-stoning required
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.needsPolishing}
                  onChange={e => setForm({ ...form, needsPolishing: e.target.checked })}
                  className="rounded accent-zinc-950"
                />
                Polishing required (Turmeric)
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Approve Quality Record</button>
          </div>
        </form>
      </Modal>

      {/* Detail Modal */}
      <Modal open={!!detailModal} onClose={() => setDetailModal(null)} title={`Inspection Certificate — ${detailModal?.id}`}>
        <div className="space-y-4">
          <div className="p-4 bg-zinc-200 rounded-xl space-y-2.5 text-xs">
            <div className="flex justify-between">
              <span className="text-zinc-400">Lot Code:</span>
              <span className="font-mono text-zinc-900 font-bold">{detailModal?.batchCode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Commodity:</span>
              <span className="text-zinc-950 font-bold">{detailModal?.commodity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Received Weight:</span>
              <span className="font-mono text-zinc-900">{detailModal?.receivedKg?.toLocaleString('en-IN')} kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Accepted into Stock:</span>
              <span className="font-mono text-emerald-400 font-bold">{detailModal?.acceptedKg?.toLocaleString('en-IN')} kg ({detailModal?.grade})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Rejected (Non-payable):</span>
              <span className="font-mono text-red-400 font-bold">{detailModal?.rejectedKg?.toLocaleString('en-IN')} kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Visual Quality Factors:</span>
              <span className="text-zinc-800">{detailModal?.colour} | {detailModal?.appearance}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Inspector:</span>
              <span className="text-zinc-700">{detailModal?.testedBy} ({detailModal?.date})</span>
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button onClick={() => setDetailModal(null)} className="btn-secondary text-xs">Close</button>
          </div>
        </div>
      </Modal>

    </div>
  )
}

import { useState } from 'react'
import { Card, CardHeader, Badge, Modal, FormField } from '../../components/ui'
import { CheckSquare, Plus, Search, AlertCircle, ShieldCheck } from 'lucide-react'

const mockTests = [
  { id: 'QA-260926-001', batch: 'TUR-260926-001', commodity: 'Cotton Seed', moisture: '7.8%', oilContent: '19.4%', ffa: '1.2%', status: 'APPROVED', testedBy: 'K. Ramesh', date: '26 Sep 2026' },
  { id: 'QA-260926-002', batch: 'SUN-260926-003', commodity: 'Sunflower Seed', moisture: '8.4%', oilContent: '39.8%', ffa: '0.8%', status: 'APPROVED', testedBy: 'P. Suresh', date: '26 Sep 2026' },
  { id: 'QA-260926-003', batch: 'TUR-260926-002', commodity: 'Cotton Seed', moisture: '11.5%', oilContent: '16.2%', ffa: '3.1%', status: 'REJECTED', testedBy: 'K. Ramesh', date: '25 Sep 2026' },
  { id: 'QA-260926-004', batch: 'OIL-260926-001', commodity: 'Refined Oil', moisture: '0.05%', oilContent: '99.9%', ffa: '0.15%', status: 'PENDING', testedBy: 'Dr. Anita', date: '26 Sep 2026' }
]

export default function QualityPage() {
  const [tests, setTests] = useState(mockTests)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({
    batch: '', commodity: 'Cotton Seed', moisture: '', oilContent: '', ffa: '', notes: ''
  })

  const handleCreate = (e) => {
    e.preventDefault()
    const moist = parseFloat(form.moisture) || 0
    const passed = moist <= 9.0
    const newTest = {
      id: `QA-260926-00${tests.length + 1}`,
      batch: form.batch || `BATCH-${Date.now().toString().slice(-4)}`,
      commodity: form.commodity,
      moisture: `${form.moisture}%`,
      oilContent: `${form.oilContent}%`,
      ffa: `${form.ffa}%`,
      status: passed ? 'APPROVED' : 'REJECTED',
      testedBy: 'Lab Chemist',
      date: 'Today'
    }
    setTests([newTest, ...tests])
    setModalOpen(false)
    setForm({ batch: '', commodity: 'Cotton Seed', moisture: '', oilContent: '', ffa: '', notes: '' })
  }

  const filtered = tests.filter(t =>
    t.batch.toLowerCase().includes(search.toLowerCase()) ||
    t.commodity.toLowerCase().includes(search.toLowerCase()) ||
    t.id.toLowerCase().includes(search.toLowerCase())
  )

  const statusVariant = s => ({
    APPROVED: 'success',
    REJECTED: 'danger',
    PENDING: 'warning'
  }[s] ?? 'muted')

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="page-title">Quality Assurance & Lab</h1>
          <p className="page-sub">Lab testing for moisture, FFA, oil yield, and Food Safety Standards compliance</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary">
          <Plus size={16} /> New Lab Test
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Samples Tested', value: tests.length, icon: '🧪' },
          { label: 'Approval Rate', value: '94.2%', icon: '✅' },
          { label: 'Avg Moisture', value: '8.1%', icon: '💧' },
          { label: 'FSSAI Certified', value: '100%', icon: '🛡️' }
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

      <div className="relative w-72">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input
          className="tom-input pl-9"
          placeholder="Search by batch or commodity..."
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
                <th>Batch / Lot</th>
                <th>Commodity</th>
                <th>Moisture</th>
                <th>Oil Content</th>
                <th>FFA</th>
                <th>Status</th>
                <th>Chemist</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id}>
                  <td className="font-mono text-xs text-brand-400">{t.id}</td>
                  <td className="font-semibold text-white">{t.batch}</td>
                  <td>{t.commodity}</td>
                  <td className="font-mono text-zinc-300">{t.moisture}</td>
                  <td className="font-mono text-brand-300">{t.oilContent}</td>
                  <td className="font-mono text-zinc-400">{t.ffa}</td>
                  <td><Badge variant={statusVariant(t.status)}>{t.status}</Badge></td>
                  <td className="text-zinc-400">{t.testedBy}</td>
                  <td className="text-xs text-zinc-500">{t.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Record Laboratory Test">
        <form onSubmit={handleCreate} className="space-y-4">
          <FormField label="Batch / Lot Number">
            <input
              required
              className="tom-input"
              placeholder="e.g. TUR-260926-005"
              value={form.batch}
              onChange={e => setForm({ ...form, batch: e.target.value })}
            />
          </FormField>
          <FormField label="Commodity">
            <select
              className="tom-select"
              value={form.commodity}
              onChange={e => setForm({ ...form, commodity: e.target.value })}
            >
              <option value="Cotton Seed">Raw Cotton Seed</option>
              <option value="Sunflower Seed">Sunflower Seed</option>
              <option value="Groundnut">Groundnut Kernels</option>
              <option value="Refined Oil">Refined Oil (Extracted)</option>
              <option value="Oil Cake">De-oiled Cake</option>
            </select>
          </FormField>
          <div className="grid grid-cols-3 gap-3">
            <FormField label="Moisture (%)">
              <input
                required
                type="number"
                step="0.1"
                className="tom-input"
                placeholder="Max 9%"
                value={form.moisture}
                onChange={e => setForm({ ...form, moisture: e.target.value })}
              />
            </FormField>
            <FormField label="Oil Yield (%)">
              <input
                required
                type="number"
                step="0.1"
                className="tom-input"
                placeholder="e.g. 19.5"
                value={form.oilContent}
                onChange={e => setForm({ ...form, oilContent: e.target.value })}
              />
            </FormField>
            <FormField label="FFA (%)">
              <input
                required
                type="number"
                step="0.01"
                className="tom-input"
                placeholder="e.g. 1.2"
                value={form.ffa}
                onChange={e => setForm({ ...form, ffa: e.target.value })}
              />
            </FormField>
          </div>
          <div className="flex justify-end gap-3 pt-3">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Submit Test Result</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

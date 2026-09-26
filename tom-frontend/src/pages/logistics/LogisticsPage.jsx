import { useState, useEffect } from 'react'
import { Card, CardHeader, Badge, EmptyState, Modal, FormField } from '../../components/ui'
import { logisticsApi } from '../../api/endpoints'
import { Plus, Search, Truck, Scale, MapPin, Clock, ArrowRightLeft } from 'lucide-react'
import toast from 'react-hot-toast'

const initialTickets = [
  { id: 'WB-260926-001', vehicleNo: 'AP 21 TY 4521', driver: 'Raju Naidu', phone: '9848012345', material: 'Raw Cotton Seed', grossWt: 24500, tareWt: 8200, netWt: 16300, status: 'COMPLETED', time: '10:30 AM' },
  { id: 'WB-260926-002', vehicleNo: 'TS 09 UB 9812', driver: 'K. Shiva Kumar', phone: '9988776655', material: 'Sunflower Seed', grossWt: 28100, tareWt: 8500, netWt: 19600, status: 'UNLOADING', time: '11:15 AM' },
  { id: 'WB-260926-003', vehicleNo: 'KA 32 M 1109', driver: 'Mohammed Rafi', phone: '9701234567', material: 'Refined Cotton Oil', grossWt: 14200, tareWt: 6100, netWt: 8100, status: 'ON_WEIGHBRIDGE', time: '12:05 PM' },
  { id: 'WB-260926-004', vehicleNo: 'AP 04 B 7788', driver: 'G. Venkatesh', phone: '9123456780', material: 'Oil Cake Bags (400 Bags)', grossWt: 18500, tareWt: 7400, netWt: 11100, status: 'GATE_ENTRY', time: '12:40 PM' }
]

const mockVehicles = [
  { id: 'V-101', vehicleNo: 'AP 21 TY 4521', type: '10 Wheeler Truck', driver: 'Raju Naidu', bay: 'Bay 3', status: 'IN_YARD', entryTime: '09:45 AM' },
  { id: 'V-102', vehicleNo: 'TS 09 UB 9812', type: '12 Wheeler Multi-Axle', driver: 'K. Shiva Kumar', bay: 'Bay 1', status: 'UNLOADING', entryTime: '10:30 AM' },
  { id: 'V-103', vehicleNo: 'KA 32 M 1109', type: 'Stainless Oil Tanker', driver: 'Mohammed Rafi', bay: 'Tanker Bay 2', status: 'WEIGHING', entryTime: '11:50 AM' },
  { id: 'V-104', vehicleNo: 'AP 04 B 7788', type: '6 Wheeler Eicher', driver: 'G. Venkatesh', bay: 'Holding Area', status: 'QUEUED', entryTime: '12:35 PM' }
]

export default function LogisticsPage() {
  const [tab, setTab] = useState('weighbridge')
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [tickets, setTickets] = useState(initialTickets)
  const [form, setForm] = useState({ vehicleNo: '', driver: '', phone: '', material: 'Raw Cotton Seed', grossWt: '', tareWt: '' })

  useEffect(() => {
    logisticsApi.tickets().then(res => {
      const data = res.data?.data || []
      if (data.length > 0) {
        const mapped = data.map(d => ({
          id: d.ticketCode,
          vehicleNo: d.vehicleNo,
          driver: d.driverName,
          phone: d.driverPhone,
          material: d.material,
          grossWt: parseFloat(d.grossWeight) || 0,
          tareWt: parseFloat(d.tareWeight) || 0,
          netWt: parseFloat(d.netWeight) || 0,
          status: d.status,
          time: new Date(d.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }))
        setTickets(mapped)
      }
    }).catch(() => {})
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    const gross = parseFloat(form.grossWt) || 0
    const tare = parseFloat(form.tareWt) || 0
    const net = gross > tare ? gross - tare : 0

    const created = {
      id: `WB-260926-00${tickets.length + 1}`,
      vehicleNo: form.vehicleNo,
      driver: form.driver,
      phone: form.phone,
      material: form.material,
      grossWt: gross,
      tareWt: tare,
      netWt: net,
      status: tare > 0 ? 'COMPLETED' : 'ON_WEIGHBRIDGE',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    try {
      await logisticsApi.createTicket({
        ticketCode: created.id,
        vehicleNo: form.vehicleNo,
        driverName: form.driver,
        driverPhone: form.phone,
        material: form.material,
        grossWeight: gross,
        tareWeight: tare,
        netWeight: net,
        status: created.status
      })
      toast.success(`Weighbridge Slip #${created.id} Recorded`)
    } catch {
      toast.success(`Weighbridge Slip #${created.id} Saved Locally`)
    }

    setTickets([created, ...tickets])
    setModalOpen(false)
    setForm({ vehicleNo: '', driver: '', phone: '', material: 'Raw Cotton Seed', grossWt: '', tareWt: '' })
  }

  const filteredTickets = tickets.filter(t =>
    t.vehicleNo.toLowerCase().includes(search.toLowerCase()) ||
    t.driver.toLowerCase().includes(search.toLowerCase()) ||
    t.material.toLowerCase().includes(search.toLowerCase()) ||
    t.id.toLowerCase().includes(search.toLowerCase())
  )

  const statusVariant = s => ({
    COMPLETED: 'success',
    UNLOADING: 'info',
    ON_WEIGHBRIDGE: 'warning',
    GATE_ENTRY: 'muted',
    IN_YARD: 'info',
    WEIGHING: 'warning',
    QUEUED: 'muted'
  }[s] ?? 'muted')

  const totalInflowKg = tickets.reduce((acc, t) => acc + (t.netWt || 0), 0)

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="page-title text-2xl font-bold tracking-tight text-white font-display">Logistics & Weighbridge</h1>
          <p className="page-sub text-zinc-400 text-sm mt-1">Real-time yard tracking, electronic weighbridge gross/tare measurement & gate pass dispatch</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary">
          <Plus size={16} /> New Weighment Slip
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Vehicles in Yard', value: '14', icon: '🚛', sub: '4 unloading, 2 weighing' },
          { label: 'Today Net Inflow', value: `${(totalInflowKg / 1000).toFixed(1)} t`, icon: '⚖️', sub: `${totalInflowKg.toLocaleString()} kg verified` },
          { label: 'Dispatched Out', value: '18.2 kL', icon: '🛢️', sub: 'Tankers & cake bags' },
          { label: 'Avg Turnaround', value: '48 min', icon: '⏱️', sub: 'Gate entry to exit pass' }
        ].map(s => (
          <div key={s.label} className="tom-card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center text-xl flex-shrink-0">{s.icon}</div>
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
        {['weighbridge', 'yard'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${
              tab === t ? 'bg-surface-3 text-white shadow-sm' : 'text-zinc-500 hover:text-white'
            }`}
          >
            {t === 'weighbridge' ? 'Weighbridge Slips' : 'Yard & Gate Status'}
          </button>
        ))}
      </div>

      <div className="relative w-80">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input
          className="tom-input pl-9"
          placeholder="Search slips, driver or vehicle #..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {tab === 'weighbridge' && (
        <Card>
          <div className="overflow-x-auto">
            <table className="tom-table">
              <thead>
                <tr>
                  <th className="whitespace-nowrap">Slip ID</th>
                  <th className="whitespace-nowrap">Vehicle & Driver</th>
                  <th className="whitespace-nowrap">Cargo Material</th>
                  <th className="text-right whitespace-nowrap">Gross (kg)</th>
                  <th className="text-right whitespace-nowrap">Tare (kg)</th>
                  <th className="text-right whitespace-nowrap">Net Wt (kg)</th>
                  <th className="whitespace-nowrap">Status</th>
                  <th className="whitespace-nowrap">Time</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map(t => (
                  <tr key={t.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="font-mono text-xs text-amber-400 font-semibold whitespace-nowrap">{t.id}</td>
                    <td className="whitespace-nowrap">
                      <div className="font-semibold text-white">{t.vehicleNo}</div>
                      <div className="text-xs text-zinc-400">{t.driver} • {t.phone}</div>
                    </td>
                    <td className="text-zinc-200 font-medium whitespace-nowrap">{t.material}</td>
                    <td className="text-right font-mono text-zinc-400 whitespace-nowrap">{t.grossWt.toLocaleString()}</td>
                    <td className="text-right font-mono text-zinc-400 whitespace-nowrap">{t.tareWt.toLocaleString()}</td>
                    <td className="text-right font-mono font-bold text-emerald-400 whitespace-nowrap">
                      {t.netWt > 0 ? t.netWt.toLocaleString() : '—'}
                    </td>
                    <td className="whitespace-nowrap"><Badge variant={statusVariant(t.status)}>{t.status}</Badge></td>
                    <td className="text-xs text-zinc-400 whitespace-nowrap">{t.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {tab === 'yard' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockVehicles.map(v => (
            <Card key={v.id} className="p-4 border-l-4 border-l-brand-500">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs text-zinc-400 font-semibold">{v.id}</span>
                <Badge variant={statusVariant(v.status)}>{v.status}</Badge>
              </div>
              <h3 className="text-base font-bold text-white">{v.vehicleNo}</h3>
              <p className="text-xs text-zinc-400 mb-3">{v.type}</p>
              <div className="space-y-1.5 text-xs text-zinc-300 pt-2 border-t border-white/5">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Driver:</span>
                  <span className="font-medium text-white">{v.driver}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Current Bay:</span>
                  <span className="font-semibold text-brand-400">{v.bay}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Entry Time:</span>
                  <span>{v.entryTime}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Record New Weighment Slip">
        <form onSubmit={handleCreate} className="space-y-4">
          <FormField label="Vehicle Number">
            <input
              required
              className="tom-input"
              placeholder="e.g. AP 21 TY 4521"
              value={form.vehicleNo}
              onChange={e => setForm({ ...form, vehicleNo: e.target.value })}
            />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Driver Name">
              <input
                required
                className="tom-input"
                placeholder="Driver full name"
                value={form.driver}
                onChange={e => setForm({ ...form, driver: e.target.value })}
              />
            </FormField>
            <FormField label="Mobile Number">
              <input
                required
                className="tom-input"
                placeholder="10-digit number"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
              />
            </FormField>
          </div>
          <FormField label="Material / Commodity">
            <select
              className="tom-select"
              value={form.material}
              onChange={e => setForm({ ...form, material: e.target.value })}
            >
              <option value="Raw Cotton Seed">Raw Cotton Seed (Inbound)</option>
              <option value="Sunflower Seed">Sunflower Seed (Inbound)</option>
              <option value="Refined Cotton Oil">Refined Cotton Oil (Bulk Tanker)</option>
              <option value="Oil Cake Bags">De-oiled Cotton Cake (Outbound)</option>
            </select>
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Gross Wt (kg)">
              <input
                required
                type="number"
                className="tom-input"
                placeholder="e.g. 24500"
                value={form.grossWt}
                onChange={e => setForm({ ...form, grossWt: e.target.value })}
              />
            </FormField>
            <FormField label="Tare Wt (kg)">
              <input
                type="number"
                className="tom-input"
                placeholder="e.g. 8200"
                value={form.tareWt}
                onChange={e => setForm({ ...form, tareWt: e.target.value })}
              />
            </FormField>
          </div>
          <div className="flex justify-end gap-3 pt-3">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Generate Slip</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

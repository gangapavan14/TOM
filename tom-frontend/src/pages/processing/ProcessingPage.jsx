import { useState } from 'react'
import { Card, CardHeader, Badge, Modal, FormField } from '../../components/ui'
import { Settings2, Plus, Play, Pause, Flame, Gauge, CheckCircle2 } from 'lucide-react'

const mockMachines = [
  { id: 'EXP-01', name: 'Heavy Expeller 1 (60 TPD)', status: 'RUNNING', temp: '112°C', rpm: '1420', load: '88%', material: 'Cotton Seed', outputPerHour: '1,250 kg/h' },
  { id: 'EXP-02', name: 'Heavy Expeller 2 (60 TPD)', status: 'RUNNING', temp: '108°C', rpm: '1420', load: '84%', material: 'Cotton Seed', outputPerHour: '1,180 kg/h' },
  { id: 'EXP-03', name: 'Medium Expeller 3 (30 TPD)', status: 'IDLE', temp: '42°C', rpm: '0', load: '0%', material: 'Standby (Sunflower)', outputPerHour: '0 kg/h' },
  { id: 'FLP-01', name: 'Plate & Frame Filter Press', status: 'RUNNING', temp: '65°C', rpm: '—', load: '92%', material: 'Crude Cotton Oil', outputPerHour: '2,800 L/h' },
  { id: 'BLR-01', name: 'Husk Steam Boiler', status: 'RUNNING', temp: '185°C', rpm: 'Pressure: 10 bar', load: '75%', material: 'Steam Generation', outputPerHour: '3.5 Ton/h' },
]

const mockRuns = [
  { id: 'RUN-260926-01', seedInput: '25,000 kg', crudeOil: '4,850 kg (19.4%)', cakeOutput: '19,200 kg (76.8%)', wasteLoss: '950 kg (3.8%)', shift: 'Morning Shift', supervisor: 'S. Narayana', status: 'IN_PROGRESS' },
  { id: 'RUN-260925-02', seedInput: '32,000 kg', crudeOil: '6,270 kg (19.6%)', cakeOutput: '24,510 kg (76.6%)', wasteLoss: '1,220 kg (3.8%)', shift: 'Night Shift', supervisor: 'R. Veerabhadra', status: 'COMPLETED' },
]

export default function ProcessingPage() {
  const [machines, setMachines] = useState(mockMachines)
  const [tab, setTab] = useState('machines')

  const toggleMachine = (id) => {
    setMachines(machines.map(m => {
      if (m.id === id) {
        const nextStatus = m.status === 'RUNNING' ? 'IDLE' : 'RUNNING'
        return {
          ...m,
          status: nextStatus,
          load: nextStatus === 'RUNNING' ? '82%' : '0%',
          rpm: nextStatus === 'RUNNING' ? '1420' : '0'
        }
      }
      return m
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="page-title">Milling & Processing Plant</h1>
          <p className="page-sub">Crushing expellers, filter presses, boiler pressure & continuous extraction monitoring</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-semibold text-emerald-400">Plant Live: 4 Units Active</span>
        </div>
      </div>

      {/* Live Plant KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Current Crushing Rate', value: '2.43 t/h', icon: '⚙️' },
          { label: 'Today Crushed', value: '38.5 Ton', icon: '🌾' },
          { label: 'Crude Oil Yield', value: '19.5%', icon: '🛢️' },
          { label: 'Steam Pressure', value: '10.2 Bar', icon: '💨' }
        ].map(s => (
          <div key={s.label} className="tom-card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center text-xl">{s.icon}</div>
            <div>
              <p className="text-2xl font-extrabold font-display text-zinc-950">{s.value}</p>
              <p className="text-xs text-zinc-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-zinc-100 p-1 rounded-xl w-fit">
        {['machines', 'runs'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${
              tab === t ? 'bg-zinc-950 text-white shadow-sm' : 'text-zinc-600 hover:text-zinc-950'
            }`}
          >
            {t === 'machines' ? 'Expeller Units & Telemetry' : 'Production Batches (Mass Balance)'}
          </button>
        ))}
      </div>

      {tab === 'machines' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {machines.map(m => (
            <Card key={m.id} className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-zinc-500">{m.id}</span>
                    <Badge variant={m.status === 'RUNNING' ? 'success' : 'muted'}>{m.status}</Badge>
                  </div>
                  <h3 className="font-bold text-zinc-950 text-base mt-1">{m.name}</h3>
                </div>
              </div>

              <div className="space-y-2 py-3 border-y border-white/5 text-xs">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Current Material:</span>
                  <span className="font-semibold text-brand-300">{m.material}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Barrel Temperature:</span>
                  <span className="font-mono text-zinc-900">{m.temp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Motor Load:</span>
                  <span className="font-mono text-emerald-400">{m.load}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Output Rate:</span>
                  <span className="font-semibold text-zinc-900">{m.outputPerHour}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <button
                  onClick={() => toggleMachine(m.id)}
                  className={`btn-secondary text-xs w-full justify-center ${
                    m.status === 'RUNNING' ? 'hover:text-zinc-900' : 'hover:text-emerald-400'
                  }`}
                >
                  {m.status === 'RUNNING' ? (
                    <><Pause size={14} className="text-zinc-900" /> Put Machine on Standby</>
                  ) : (
                    <><Play size={14} className="text-emerald-400" /> Start Expeller Motor</>
                  )}
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === 'runs' && (
        <Card>
          <CardHeader title="Mass Balance & Extraction Batches" subtitle="Daily seed crushed vs. crude oil and oil cake yields" />
          <div className="overflow-x-auto">
            <table className="tom-table">
              <thead>
                <tr>
                  <th>Batch Run</th>
                  <th>Raw Seed Input</th>
                  <th>Extracted Oil (Yield)</th>
                  <th>Cake Byproduct</th>
                  <th>Loss / Moisture</th>
                  <th>Shift & Supervisor</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {mockRuns.map(r => (
                  <tr key={r.id}>
                    <td className="font-mono text-xs text-brand-400">{r.id}</td>
                    <td className="font-semibold text-zinc-900">{r.seedInput}</td>
                    <td className="font-semibold text-zinc-900">{r.crudeOil}</td>
                    <td className="text-zinc-700">{r.cakeOutput}</td>
                    <td className="text-zinc-500">{r.wasteLoss}</td>
                    <td>
                      <div className="text-white text-xs">{r.shift}</div>
                      <div className="text-zinc-500 text-[11px]">{r.supervisor}</div>
                    </td>
                    <td>
                      <Badge variant={r.status === 'COMPLETED' ? 'success' : 'info'}>{r.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}

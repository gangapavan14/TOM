import { useState } from 'react'
import { Card, CardHeader, Badge, Modal, FormField } from '../../components/ui'
import { useOperationalData } from '../../context/OperationalDataContext'
import {
  ClipboardCheck, Users, CheckCircle2, Clock, AlertTriangle, Truck,
  Settings2, Plus, Play, Pause, RotateCcw, Package, Activity,
  HardHat, ShieldAlert, ArrowRight, Check, X, Sparkles, ShieldCheck
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function FloorOperationsPage() {
  const {
    floorTasks,
    loadingDocket,
    updateLoadingDocketCount,
    transmitLoadingDocketToFO,
    assignFloorTask,
    toggleTaskStep
  } = useOperationalData()

  const tasks = floorTasks
  const toggleStep = (taskId, stepIndex) => toggleTaskStep(taskId, stepIndex)

  const [activeTab, setActiveTab] = useState('tasks')
  const [taskModalOpen, setTaskModalOpen] = useState(false)
  const [incidentModalOpen, setIncidentModalOpen] = useState(false)

  // Machine Floor Live Status
  const [machines, setMachines] = useState([
    { id: 'EXP-01', name: 'Heavy Expeller #1 (60 TPD)', temp: '112°C', targetTemp: '110°C - 115°C', amps: '74 A', rate: '1,250 kg/h', status: 'RUNNING' },
    { id: 'EXP-02', name: 'Heavy Expeller #2 (60 TPD)', temp: '109°C', targetTemp: '110°C - 115°C', amps: '72 A', rate: '1,200 kg/h', status: 'RUNNING' },
    { id: 'EXP-03', name: 'Expeller #3 (Cold Press)', temp: '46°C', targetTemp: '< 48°C', amps: '38 A', rate: '450 kg/h', status: 'STANDBY' },
    { id: 'BLR-01', name: 'Husk-Fired Steam Boiler', temp: '185°C', targetTemp: '180°C - 190°C', amps: '10.5 Bar', rate: '2.5 T/h Steam', status: 'RUNNING' },
  ])

  // New task form state
  const [newTask, setNewTask] = useState({
    worker: '',
    workerRole: 'General Plant Worker',
    station: 'Expeller Bay 1',
    target: '',
    priority: 'NORMAL',
    stepsText: ''
  })

  // Incident report state
  const [incident, setIncident] = useState({
    machine: 'EXP-01',
    type: 'Mechanical / Jam',
    severity: 'HIGH',
    description: ''
  })

  // Handle new task creation
  const handleCreateTask = (e) => {
    e.preventDefault()
    if (!newTask.worker || !newTask.target) {
      toast.error('Please specify worker and target description')
      return
    }
    const stepList = newTask.stepsText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean)
      .map(text => ({ text, done: false }))

    assignFloorTask({
      worker: newTask.worker,
      workerRole: newTask.workerRole,
      station: newTask.station,
      target: newTask.target,
      priority: newTask.priority,
      shift: 'Shift A',
      steps: stepList.length > 0 ? stepList : [{ text: newTask.target, done: false }]
    })

    setTaskModalOpen(false)
    setNewTask({ worker: '', workerRole: 'General Plant Worker', station: 'Expeller Bay 1', target: '', priority: 'NORMAL', stepsText: '' })
  }

  // Handle bag increment/decrement
  const adjustCount = (delta) => {
    updateLoadingDocketCount(delta)
  }

  // Transmit count to Field Officer
  const submitCountToFO = () => {
    if (loadingDocket.currentCount !== loadingDocket.targetBags) {
      if (!window.confirm(`Counted bags (${loadingDocket.currentCount}) differ from target (${loadingDocket.targetBags}). Submit discrepancy to Field Officer?`)) {
        return
      }
    }
    transmitLoadingDocketToFO()
  }

  // Submit incident
  const handleIncidentSubmit = (e) => {
    e.preventDefault()
    toast.error(`ALERT: Floor incident logged on ${incident.machine}. Dispatched to Plant Manager & Admin SMS!`)
    setIncidentModalOpen(false)
    setIncident({ machine: 'EXP-01', type: 'Mechanical / Jam', severity: 'HIGH', description: '' })
  }

  return (
    <div className="space-y-8 animate-fade-in">

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="page-title text-2xl font-bold tracking-tight text-zinc-950 font-sans">
              Plant Floor & Senior Worker Operations Hub
            </h1>
            <Badge variant="brand">Section 6.4 & Rule 6</Badge>
          </div>
          <p className="page-sub text-zinc-600 text-sm mt-1">
            Floor supervisor console: worker assignment checklists, machine operating monitors, and physical truck loading verification.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setIncidentModalOpen(true)}
            className="btn-danger text-xs px-3.5 py-2 flex items-center gap-1.5 shadow-sm"
          >
            <AlertTriangle size={15} />
            Report Floor Issue
          </button>
          <button
            onClick={() => setTaskModalOpen(true)}
            className="btn-primary text-xs px-3.5 py-2 flex items-center gap-1.5 shadow-sm"
          >
            <Plus size={15} />
            Assign New Worker Task
          </button>
        </div>
      </div>

      {/* Quick Floor KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-sm">
          <p className="text-xs font-bold text-zinc-950 uppercase tracking-wider">Floor Workers on Shift</p>
          <p className="text-2xl font-bold text-zinc-950 font-mono mt-1">8 Present</p>
          <p className="text-[11px] text-zinc-500 font-medium mt-0.5">Day Shift (08:00 - 18:00)</p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-sm">
          <p className="text-xs font-bold text-zinc-950 uppercase tracking-wider">Active Heavy Expellers</p>
          <p className="text-2xl font-bold text-zinc-950 font-mono mt-1">2 Running</p>
          <p className="text-[11px] text-zinc-500 font-medium mt-0.5">2,450 kg/hr throughput</p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-sm">
          <p className="text-xs font-bold text-zinc-950 uppercase tracking-wider">Active Work Tasks</p>
          <p className="text-2xl font-bold text-zinc-950 font-mono mt-1">
            {tasks.filter(t => t.status === 'IN_PROGRESS').length} Active
          </p>
          <p className="text-[11px] text-zinc-500 font-medium mt-0.5">{tasks.filter(t => t.status === 'COMPLETED').length} tasks completed today</p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-zinc-200 shadow-sm">
          <p className="text-xs font-bold text-zinc-950 uppercase tracking-wider">Physical Loading Count</p>
          <p className="text-2xl font-bold text-zinc-950 font-mono mt-1">200 / 200</p>
          <p className="text-[11px] text-zinc-500 font-medium mt-0.5">Rule 6 count pending FO signoff</p>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="space-y-2">
        <p className="text-xs font-bold text-zinc-950 uppercase tracking-wider">Operations Console Views</p>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {[
            { id: 'tasks', label: '1. What Worker Needs To Do (Task Checklists)', icon: ClipboardCheck },
            { id: 'loading', label: '2. Physical Loading / Bag Count (Rule 6)', icon: Truck },
            { id: 'machines', label: '3. Heavy Expeller & Boiler Telemetry', icon: Settings2 },
          ].map(tab => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 flex items-center gap-2 cursor-pointer active:scale-[0.98] ${
                  isActive
                    ? 'bg-zinc-950 text-white font-bold shadow-sm'
                    : 'bg-white border border-zinc-200 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 hover:border-zinc-300'
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: WHAT WORKER NEEDS TO DO (Task Checklists) */}
      {/* ============================================================== */}
      {activeTab === 'tasks' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tasks.map(t => {
              const completedSteps = t.steps.filter(s => s.done).length
              const totalSteps = t.steps.length
              const progressPct = Math.round((completedSteps / totalSteps) * 100)

              return (
                <Card key={t.id} className="p-6 space-y-4 hover:border-zinc-400 transition-all">
                  {/* Task Card Header */}
                  <div className="flex items-start justify-between gap-3 border-b border-zinc-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-zinc-950">{t.id}</span>
                        <Badge variant={t.status === 'COMPLETED' ? 'success' : t.status === 'IN_PROGRESS' ? 'brand' : 'warning'}>
                          {t.status.replace('_', ' ')}
                        </Badge>
                        {t.priority === 'URGENT' && (
                          <span className="text-[10px] bg-zinc-950 text-white font-bold px-2 py-0.5 rounded-full">
                            URGENT
                          </span>
                        )}
                      </div>
                      <h3 className="font-sans font-bold text-zinc-950 text-base mt-1">
                        {t.target}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-zinc-600 mt-1">
                        <span className="font-semibold text-zinc-900">{t.worker}</span>
                        <span>•</span>
                        <span className="font-medium text-zinc-500">{t.workerRole}</span>
                        <span>•</span>
                        <span className="font-mono text-zinc-500">{t.station}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-zinc-950">{progressPct}%</span>
                      <p className="text-[10px] text-zinc-500">{completedSteps}/{totalSteps} steps</p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-zinc-950 h-full transition-all duration-300"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>

                  {/* Operational Action Steps Checklist ("What Worker Needs to Do") */}
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-zinc-950 uppercase tracking-wider">
                      Work Action Checklist:
                    </p>
                    <div className="space-y-1.5">
                      {t.steps.map((step, idx) => (
                        <div
                          key={idx}
                          onClick={() => toggleStep(t.id, idx)}
                          className={`flex items-start gap-3 p-2.5 rounded-lg border transition-all cursor-pointer ${
                            step.done
                              ? 'bg-zinc-50/80 border-zinc-200 text-zinc-500 line-through'
                              : 'bg-white border-zinc-200 text-zinc-900 hover:border-zinc-300 hover:bg-zinc-50/40'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded border flex items-center justify-center mt-0.5 flex-shrink-0 transition-colors ${
                            step.done ? 'bg-zinc-950 border-zinc-950 text-white' : 'border-zinc-300 bg-white'
                          }`}>
                            {step.done && <Check size={12} strokeWidth={3} />}
                          </div>
                          <span className="text-xs font-medium leading-snug flex-1 select-none">
                            {step.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Senior Worker Task Controls */}
                  <div className="pt-2 border-t border-zinc-100 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-zinc-500 font-mono">{t.shift}</span>
                    <div className="flex gap-2">
                      {t.status !== 'COMPLETED' ? (
                        <button
                          onClick={() => updateTaskStatus(t.id, 'COMPLETED')}
                          className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1 shadow-sm"
                        >
                          <CheckCircle2 size={13} />
                          Sign Off Done
                        </button>
                      ) : (
                        <button
                          onClick={() => updateTaskStatus(t.id, 'IN_PROGRESS')}
                          className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1"
                        >
                          <RotateCcw size={13} />
                          Reopen Task
                        </button>
                      )}
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: PHYSICAL LOADING / BAG COUNT (Rule 6) */}
      {/* ============================================================== */}
      {activeTab === 'loading' && (
        <div className="space-y-6">
          <Card className="p-6 max-w-3xl space-y-6">
            <CardHeader
              title={
                <span className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-zinc-950" />
                  Physical Loading / Unloading Count Verification (Rule 6)
                </span>
              }
              subtitle="Invariant Rule 6: Inventory deduction requires Senior Worker physical loading count + Field Officer verification signoff."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-zinc-50 border border-zinc-200">
              <div>
                <p className="text-xs font-bold text-zinc-950 uppercase tracking-wider">Transport Details</p>
                <div className="mt-2 space-y-1 text-xs">
                  <p><strong className="text-zinc-950">Vehicle No:</strong> <span className="font-mono text-zinc-900 font-bold">{loadingDocket.vehicle}</span></p>
                  <p><strong className="text-zinc-950">Driver:</strong> <span className="text-zinc-700">{loadingDocket.driver}</span></p>
                  <p><strong className="text-zinc-950">Customer:</strong> <span className="text-zinc-700">{loadingDocket.client}</span></p>
                  <p><strong className="text-zinc-950">Order Code:</strong> <span className="font-mono text-zinc-900">{loadingDocket.orderId}</span></p>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-zinc-950 uppercase tracking-wider">Commodity & Seal</p>
                <div className="mt-2 space-y-1 text-xs">
                  <p><strong className="text-zinc-950">Commodity:</strong> <span className="text-zinc-700">{loadingDocket.commodity}</span></p>
                  <p><strong className="text-zinc-950">Batch Code:</strong> <span className="font-mono text-zinc-900 font-bold">{loadingDocket.batchCode}</span></p>
                  <p><strong className="text-zinc-950">Physical Seal:</strong> <span className="font-mono text-zinc-950 font-bold">{loadingDocket.sealNumber}</span></p>
                  <p><strong className="text-zinc-950">Target Bags:</strong> <span className="font-mono text-zinc-950 font-bold">{loadingDocket.targetBags} bags (10,000 kg)</span></p>
                </div>
              </div>
            </div>

            {/* Senior Worker Physical Bag Counter */}
            <div className="p-6 rounded-2xl bg-white border-2 border-zinc-900 space-y-4 text-center">
              <p className="text-xs font-bold text-zinc-950 uppercase tracking-wider">
                Senior Worker Physical Counted Bags on Truck Bay:
              </p>

              <div className="flex items-center justify-center gap-6">
                <button
                  onClick={() => adjustCount(-10)}
                  className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-900 hover:bg-zinc-200 font-bold text-sm transition-colors cursor-pointer active:scale-95"
                >
                  -10
                </button>
                <button
                  onClick={() => adjustCount(-1)}
                  className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-900 hover:bg-zinc-200 font-bold text-sm transition-colors cursor-pointer active:scale-95"
                >
                  -1
                </button>

                <div className="px-8 py-3 rounded-2xl bg-zinc-100 border border-zinc-200">
                  <span className="text-4xl lg:text-5xl font-extrabold font-mono text-zinc-950">
                    {loadingDocket.currentCount}
                  </span>
                  <p className="text-[11px] text-zinc-500 font-bold uppercase mt-1">Bags Verified</p>
                </div>

                <button
                  onClick={() => adjustCount(1)}
                  className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-900 hover:bg-zinc-200 font-bold text-sm transition-colors cursor-pointer active:scale-95"
                >
                  +1
                </button>
                <button
                  onClick={() => adjustCount(10)}
                  className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-900 hover:bg-zinc-200 font-bold text-sm transition-colors cursor-pointer active:scale-95"
                >
                  +10
                </button>
              </div>

              <div className="flex items-center justify-center gap-4 text-xs font-medium text-zinc-600">
                <span>Calculated Net Weight: <strong className="font-mono text-zinc-950 font-bold">{loadingDocket.currentCount * 50} kg</strong></span>
                <span>•</span>
                <span>Gross Truck Estimate: <strong className="font-mono text-zinc-950 font-bold">{loadingDocket.tareWeight + (loadingDocket.currentCount * 50)} kg</strong></span>
              </div>
            </div>

            {/* Verification status notice */}
            <div className="p-4 rounded-xl bg-zinc-100 border border-zinc-200 text-xs text-zinc-800 space-y-1">
              <p className="font-bold flex items-center gap-1.5 text-zinc-950">
                <CheckCircle2 size={15} />
                Rule 6 Enforcement Protocol Active:
              </p>
              <p className="text-zinc-600 leading-relaxed">
                Clicking submit transmits your physical loading tally directly to the Field Officer on yard duty. The inventory deduction in Godown #2 will unlock only after the Field Officer completes their physical seal inspection and counter-signs.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => adjustCount(loadingDocket.targetBags - loadingDocket.currentCount)}
                className="btn-secondary text-xs px-4"
              >
                Reset to Target (200)
              </button>
              {loadingDocket.status === 'VERIFIED_BY_FO' ? (
                <div className="p-3 bg-zinc-100 border border-zinc-300 rounded-xl text-xs flex items-center justify-between text-zinc-950 font-bold shadow-sm">
                  <span className="flex items-center gap-2">
                    <ShieldCheck size={16} />
                    Field Officer Signoff Confirmed: {loadingDocket.foSign} (Inventory Deducted)
                  </span>
                  <span className="font-mono text-zinc-600 font-medium">{loadingDocket.verifiedAt}</span>
                </div>
              ) : (
                <button
                  onClick={submitCountToFO}
                  disabled={loadingDocket.status === 'READY_FOR_FO_SIGNOFF'}
                  className="btn-primary text-xs px-5 py-2.5 shadow-sm"
                >
                  {loadingDocket.status === 'READY_FOR_FO_SIGNOFF' ? '✓ Transmitted to Field Officer (Pending Signoff)' : 'Submit Count for Field Officer Signoff →'}
                </button>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: HEAVY EXPELLER & BOILER TELEMETRY */}
      {/* ============================================================== */}
      {activeTab === 'machines' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {machines.map(m => (
              <Card key={m.id} className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold text-zinc-950">{m.id}</span>
                    <h3 className="font-sans font-bold text-zinc-950 text-lg mt-0.5">{m.name}</h3>
                    <p className="text-xs text-zinc-500 font-medium">Safe operating band: {m.targetTemp}</p>
                  </div>
                  <Badge variant={m.status === 'RUNNING' ? 'success' : 'warning'}>
                    {m.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-center">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-500 block">Temperature</span>
                    <span className="font-mono font-bold text-zinc-950 text-base">{m.temp}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-500 block">Motor Load</span>
                    <span className="font-mono font-bold text-zinc-950 text-base">{m.amps}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-500 block">Throughput</span>
                    <span className="font-mono font-bold text-zinc-950 text-base">{m.rate}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-zinc-100">
                  <span className="text-zinc-500">Scheduled grease & bearing check: In 4 hours</span>
                  <button
                    onClick={() => {
                      setMachines(machines.map(item => item.id === m.id ? { ...item, status: item.status === 'RUNNING' ? 'STANDBY' : 'RUNNING' } : item))
                      toast.success(`${m.id} toggled`)
                    }}
                    className="btn-secondary text-xs px-3 py-1.5"
                  >
                    {m.status === 'RUNNING' ? 'Put on Standby' : 'Start Machine'}
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Assign Task Modal */}
      <Modal
        open={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        title="Assign New Worker Task (Plant Floor)"
      >
        <form onSubmit={handleCreateTask} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Assignee Worker Name *">
              <input
                required
                className="tom-input"
                placeholder="e.g. Raju Sharma"
                value={newTask.worker}
                onChange={e => setNewTask({ ...newTask, worker: e.target.value })}
              />
            </FormField>

            <FormField label="Worker Role">
              <select
                className="tom-select"
                value={newTask.workerRole}
                onChange={e => setNewTask({ ...newTask, workerRole: e.target.value })}
              >
                <option value="Expeller Master">Expeller Master</option>
                <option value="Boiler & Steam Tech">Boiler & Steam Tech</option>
                <option value="Loading Staff">Loading Staff</option>
                <option value="Bagging & Stitching Tech">Bagging & Stitching Tech</option>
                <option value="Seed Cleaner & Screen Tech">Seed Cleaner & Screen Tech</option>
                <option value="General Plant Worker">General Plant Worker</option>
              </select>
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Plant Station / Bay">
              <select
                className="tom-select"
                value={newTask.station}
                onChange={e => setNewTask({ ...newTask, station: e.target.value })}
              >
                <option value="Expeller Bay 1">Expeller Bay 1</option>
                <option value="Expeller Bay 2">Expeller Bay 2</option>
                <option value="Husk Boiler Shed #2">Husk Boiler Shed #2</option>
                <option value="Yard Bay 2 (Outflow Dock)">Yard Bay 2 (Outflow Dock)</option>
                <option value="Bagging Bay #1">Bagging Bay #1</option>
                <option value="Pre-Cleaning Shed">Pre-Cleaning Shed</option>
              </select>
            </FormField>

            <FormField label="Priority Level">
              <select
                className="tom-select"
                value={newTask.priority}
                onChange={e => setNewTask({ ...newTask, priority: e.target.value })}
              >
                <option value="NORMAL">NORMAL</option>
                <option value="HIGH">HIGH</option>
                <option value="URGENT">URGENT</option>
              </select>
            </FormField>
          </div>

          <FormField label="Primary Target / Work Description *">
            <input
              required
              className="tom-input"
              placeholder="e.g. Load 200 bags of sunflower meal onto truck"
              value={newTask.target}
              onChange={e => setNewTask({ ...newTask, target: e.target.value })}
            />
          </FormField>

          <FormField label="Specific Action Steps (One per line for checklist)">
            <textarea
              className="tom-input h-24 resize-none"
              placeholder="Step 1: Check safety clearance&#10;Step 2: Verify tare weight on platform&#10;Step 3: Stack onto pallet"
              value={newTask.stepsText}
              onChange={e => setNewTask({ ...newTask, stepsText: e.target.value })}
            />
          </FormField>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setTaskModalOpen(false)} className="btn-secondary text-xs">Cancel</button>
            <button type="submit" className="btn-primary text-xs">Assign Task to Floor Worker</button>
          </div>
        </form>
      </Modal>

      {/* Incident Report Modal */}
      <Modal
        open={incidentModalOpen}
        onClose={() => setIncidentModalOpen(false)}
        title="Report Urgent Floor Issue / Breakdown"
      >
        <form onSubmit={handleIncidentSubmit} className="space-y-4">
          <div className="p-3 bg-zinc-100 border border-zinc-200 rounded-xl text-xs text-zinc-800">
            <strong>Urgent Alert:</strong> Submitting a floor incident alerts the Senior Worker, Plant Manager, and Admin simultaneously.
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Affected Machine / Station">
              <select
                className="tom-select"
                value={incident.machine}
                onChange={e => setIncident({ ...incident, machine: e.target.value })}
              >
                <option value="EXP-01">EXP-01 (Heavy Expeller #1)</option>
                <option value="EXP-02">EXP-02 (Heavy Expeller #2)</option>
                <option value="EXP-03">EXP-03 (Cold Press Expeller)</option>
                <option value="BLR-01">BLR-01 (Husk Steam Boiler)</option>
                <option value="BAY-02">Yard Bay 2 (Loading Dock)</option>
              </select>
            </FormField>

            <FormField label="Issue Type">
              <select
                className="tom-select"
                value={incident.type}
                onChange={e => setIncident({ ...incident, type: e.target.value })}
              >
                <option value="Mechanical / Jam">Mechanical / Jam</option>
                <option value="Overheating (> 120°C)">Overheating (&gt; 120°C)</option>
                <option value="Electrical / Motor Tripped">Electrical / Motor Tripped</option>
                <option value="Steam Pressure Drop">Steam Pressure Drop</option>
                <option value="Bag Tearing / Stitching Failure">Bag Tearing / Stitching Failure</option>
              </select>
            </FormField>
          </div>

          <FormField label="Incident Description & Floor Observations *">
            <textarea
              required
              className="tom-input h-24 resize-none"
              placeholder="Describe what occurred, abnormal sounds, vibrations, or emergency actions taken..."
              value={incident.description}
              onChange={e => setIncident({ ...incident, description: e.target.value })}
            />
          </FormField>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setIncidentModalOpen(false)} className="btn-secondary text-xs">Cancel</button>
            <button type="submit" className="btn-danger text-xs">Dispatch Urgent Floor Alert</button>
          </div>
        </form>
      </Modal>

    </div>
  )
}

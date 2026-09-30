import { useState } from 'react'
import { Card, CardHeader, Badge, FormField } from '../../components/ui'
import { Settings2, Save, Bell, Shield, Database, Cpu, Sliders, Users, DollarSign, Clock } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const [tab, setTab] = useState('policies')

  // Identity
  const [millName, setMillName] = useState('Tirumala Oil Mill (TOM)')
  const [gstNo, setGstNo] = useState('37AABCT1234F1Z5')
  const [fssaiNo, setFssaiNo] = useState('10123000000456')

  // Configurable Business Policies (Section 2.5 & 32)
  const [policies, setPolicies] = useState({
    reservationTimeoutHours: 12,
    deliveryWindowHours: 24,
    negotiationLimitPerKg: 3.0, // Field Officer max price deviation without admin
    earlyPaymentDiscountPercent: 2.0, // Supplier instant payment deduction
    supplierPaymentDays: 15,
    customerCreditDays: 15,
    standardBagKg: 50,
    loadingChargePerBag: 5.0,
    commissionRatePerTon: 25.0
  })

  // Salary Structures (Section 7.1)
  const [salaries, setSalaries] = useState({
    workerMonthly: 10000,
    seniorWorkerMonthly: 15000,
    fieldOfficerMonthly: 20000,
    officeEmployeeMonthly: 20000,
    overtimeRatePerHour: 75
  })

  // Hardware Sensors
  const [weighbridgePort, setWeighbridgePort] = useState('COM3 (9600 baud)')
  const [autoSms, setAutoSms] = useState(true)

  const handleSave = (e) => {
    e.preventDefault()
    toast.success('Enterprise business policies and parameters updated successfully!')
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="page-title text-2xl font-bold tracking-tight text-zinc-950 font-display">Enterprise Policies & System Configuration</h1>
          <p className="page-sub text-zinc-400 text-sm mt-1">
            Section 2.5 & 32: Manage dynamic business rules (Negotiation limits, 12h hold rules, 24h delivery, salaries, and statutory taxes)
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-zinc-100 p-1 rounded-xl w-fit">
        {['policies', 'salaries', 'identity', 'hardware'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${tab === t ? 'bg-zinc-950 text-white shadow-sm' : 'text-zinc-600 hover:text-zinc-950'}`}>
            {t === 'policies' ? '1. Business Policy Engine (Section 2.5)' : t === 'salaries' ? '2. Salary Structures (Section 7.1)' : t === 'identity' ? '3. Mill Identity & Taxes' : '4. Hardware Sensors'}
          </button>
        ))}
      </div>

      <form onSubmit={handleSave} className="space-y-6">

        {/* Business Policy Engine */}
        {tab === 'policies' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 space-y-4">
              <h3 className="font-display font-bold text-zinc-950 text-base flex items-center gap-2">
                <Clock size={16} className="text-zinc-900" />
                Procurement & Reservation Timeouts (Section 8.3 & 8.4)
              </h3>
              <div className="space-y-3">
                <FormField label="Procurement Reservation Expiry Window (Hours)">
                  <input
                    type="number"
                    className="tom-input font-mono"
                    value={policies.reservationTimeoutHours}
                    onChange={e => setPolicies({ ...policies, reservationTimeoutHours: parseInt(e.target.value) || 12 })}
                  />
                  <p className="text-[11px] text-zinc-500">Unfinalized farmer/broker reservations auto-release after this duration.</p>
                </FormField>
                <FormField label="Finalized Deal Delivery Commitment Window (Hours)">
                  <input
                    type="number"
                    className="tom-input font-mono"
                    value={policies.deliveryWindowHours}
                    onChange={e => setPolicies({ ...policies, deliveryWindowHours: parseInt(e.target.value) || 24 })}
                  />
                  <p className="text-[11px] text-zinc-500">Deliveries must arrive at mill gate within this window.</p>
                </FormField>
                <FormField label="Field Officer Max Price Deviation (₹ / kg)">
                  <input
                    type="number"
                    step="0.5"
                    className="tom-input font-mono"
                    value={policies.negotiationLimitPerKg}
                    onChange={e => setPolicies({ ...policies, negotiationLimitPerKg: parseFloat(e.target.value) || 3.0 })}
                  />
                  <p className="text-[11px] text-zinc-500">Variances exceeding this amount trigger Admin Escalation (Section 6.3).</p>
                </FormField>
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <h3 className="font-display font-bold text-zinc-950 text-base flex items-center gap-2">
                <DollarSign size={16} className="text-emerald-400" />
                Finance & Credit Policies (Section 11 & 13)
              </h3>
              <div className="space-y-3">
                <FormField label="Early Supplier Payment Deduction (%)">
                  <input
                    type="number"
                    step="0.5"
                    className="tom-input font-mono"
                    value={policies.earlyPaymentDiscountPercent}
                    onChange={e => setPolicies({ ...policies, earlyPaymentDiscountPercent: parseFloat(e.target.value) || 2.0 })}
                  />
                  <p className="text-[11px] text-zinc-500">Deduction applied if supplier requests instant payout ahead of standard credit.</p>
                </FormField>
                <div className="grid grid-cols-2 gap-3">
                  <FormField label="Supplier Payment Days">
                    <input
                      type="number"
                      className="tom-input font-mono"
                      value={policies.supplierPaymentDays}
                      onChange={e => setPolicies({ ...policies, supplierPaymentDays: parseInt(e.target.value) || 15 })}
                    />
                  </FormField>
                  <FormField label="Customer Credit Limit (Days)">
                    <input
                      type="number"
                      className="tom-input font-mono"
                      value={policies.customerCreditDays}
                      onChange={e => setPolicies({ ...policies, customerCreditDays: parseInt(e.target.value) || 15 })}
                    />
                  </FormField>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <FormField label="Standard Bag Weight (kg)">
                    <input
                      type="number"
                      className="tom-input font-mono"
                      value={policies.standardBagKg}
                      onChange={e => setPolicies({ ...policies, standardBagKg: parseInt(e.target.value) || 50 })}
                    />
                  </FormField>
                  <FormField label="Customer Pickup Loading Fee (₹ / bag)">
                    <input
                      type="number"
                      className="tom-input font-mono"
                      value={policies.loadingChargePerBag}
                      onChange={e => setPolicies({ ...policies, loadingChargePerBag: parseFloat(e.target.value) || 5.0 })}
                    />
                  </FormField>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Salary Structures (Section 7.1) */}
        {tab === 'salaries' && (
          <Card className="p-6 space-y-4 max-w-2xl">
            <h3 className="font-display font-bold text-zinc-950 text-base flex items-center gap-2">
              <Users size={16} className="text-zinc-900" />
              Default Permanent Employment Salary Scales (Section 7.1)
            </h3>
            <p className="text-xs text-zinc-400">Monthly base compensation rates configurable by Admin:</p>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <FormField label="General Mill Worker Base Salary (₹ / month)">
                <input
                  type="number"
                  className="tom-input font-mono"
                  value={salaries.workerMonthly}
                  onChange={e => setSalaries({ ...salaries, workerMonthly: parseInt(e.target.value) || 10000 })}
                />
              </FormField>
              <FormField label="Senior Worker / Supervisor Base (₹ / month)">
                <input
                  type="number"
                  className="tom-input font-mono"
                  value={salaries.seniorWorkerMonthly}
                  onChange={e => setSalaries({ ...salaries, seniorWorkerMonthly: parseInt(e.target.value) || 15000 })}
                />
              </FormField>
              <FormField label="Field Procurement Officer Base (₹ / month)">
                <input
                  type="number"
                  className="tom-input font-mono"
                  value={salaries.fieldOfficerMonthly}
                  onChange={e => setSalaries({ ...salaries, fieldOfficerMonthly: parseInt(e.target.value) || 20000 })}
                />
              </FormField>
              <FormField label="Office Employee / Coordinator Base (₹ / month)">
                <input
                  type="number"
                  className="tom-input font-mono"
                  value={salaries.officeEmployeeMonthly}
                  onChange={e => setSalaries({ ...salaries, officeEmployeeMonthly: parseInt(e.target.value) || 20000 })}
                />
              </FormField>
            </div>
            <div className="pt-2">
              <FormField label="Overtime Hourly Compensation (₹ / hr)">
                <input
                  type="number"
                  className="tom-input font-mono w-48"
                  value={salaries.overtimeRatePerHour}
                  onChange={e => setSalaries({ ...salaries, overtimeRatePerHour: parseInt(e.target.value) || 75 })}
                />
              </FormField>
            </div>
          </Card>
        )}

        {/* Identity */}
        {tab === 'identity' && (
          <Card className="p-6 space-y-4 max-w-xl">
            <h3 className="font-display font-bold text-zinc-950 text-base flex items-center gap-2">
              <Database size={16} className="text-brand-400" />
              Mill Identity & Statutory Registrations
            </h3>
            <div className="space-y-3">
              <FormField label="Company / Mill Entity Name">
                <input
                  className="tom-input"
                  value={millName}
                  onChange={e => setMillName(e.target.value)}
                />
              </FormField>
              <FormField label="GSTIN Registration #">
                <input
                  className="tom-input font-mono"
                  value={gstNo}
                  onChange={e => setGstNo(e.target.value)}
                />
              </FormField>
              <FormField label="FSSAI License #">
                <input
                  className="tom-input font-mono"
                  value={fssaiNo}
                  onChange={e => setFssaiNo(e.target.value)}
                />
              </FormField>
            </div>
          </Card>
        )}

        {/* Hardware Sensors */}
        {tab === 'hardware' && (
          <Card className="p-6 space-y-4 max-w-xl">
            <h3 className="font-display font-bold text-zinc-950 text-base flex items-center gap-2">
              <Cpu size={16} className="text-brand-400" />
              Weighbridge & Industrial Sensor Gateways
            </h3>
            <div className="space-y-3">
              <FormField label="Dharmakanta Weighbridge Serial Interface">
                <input
                  className="tom-input font-mono"
                  value={weighbridgePort}
                  onChange={e => setWeighbridgePort(e.target.value)}
                />
              </FormField>
              <div className="pt-2">
                <label className="flex items-center gap-3 cursor-pointer text-sm text-zinc-700">
                  <input
                    type="checkbox"
                    checked={autoSms}
                    onChange={e => setAutoSms(e.target.checked)}
                    className="w-4 h-4 accent-zinc-950 rounded"
                  />
                  Auto-dispatch WhatsApp / SMS weighment receipt upon gross/tare capture
                </label>
              </div>
            </div>
          </Card>
        )}

        <div className="flex justify-end">
          <button type="submit" className="btn-primary">
            <Save size={16} /> Save Enterprise Policies
          </button>
        </div>
      </form>
    </div>
  )
}

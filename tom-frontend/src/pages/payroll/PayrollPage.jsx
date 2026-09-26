import { useState } from 'react'
import { Card, CardHeader, Badge, Modal, FormField } from '../../components/ui'
import { FileText, Download, CheckCircle, Clock, AlertTriangle, DollarSign } from 'lucide-react'

const mockPayrolls = [
  { id: 'PAY-2609-01', name: 'N. Venkata Rao', role: 'EXPEL_OPERATOR', baseSalary: 28000, daysWorked: 26, overtime: 3500, deductions: 1200, netPay: 30300, status: 'PAID' },
  { id: 'PAY-2609-02', name: 'M. Shiva Reddy', role: 'BOILER_OPERATOR', baseSalary: 26000, daysWorked: 25, overtime: 2800, deductions: 1100, netPay: 27700, status: 'PAID' },
  { id: 'PAY-2609-03', name: 'G. Apparao', role: 'SENIOR_WORKER', baseSalary: 22000, daysWorked: 26, overtime: 1800, deductions: 950, netPay: 22850, status: 'GENERATED' },
  { id: 'PAY-2609-04', name: 'K. Lakshmi', role: 'OFFICE_EMPLOYEE', baseSalary: 32000, daysWorked: 26, overtime: 0, deductions: 1500, netPay: 30500, status: 'GENERATED' },
  { id: 'PAY-2609-05', name: 'P. Balaji (Temp)', role: 'TEMP_LOADER', baseSalary: 16000, daysWorked: 22, overtime: 4200, deductions: 0, netPay: 20200, status: 'PENDING_APPROVAL' },
]

export default function PayrollPage() {
  const [payrolls, setPayrolls] = useState(mockPayrolls)
  const [selectedMonth, setSelectedMonth] = useState('September 2026')

  const totalPayroll = payrolls.reduce((sum, p) => sum + p.netPay, 0)

  const approveAll = () => {
    setPayrolls(payrolls.map(p => ({ ...p, status: 'PAID' })))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="page-title">Workforce Payroll & Disbursements</h1>
          <p className="page-sub">Monthly salary structures, biometric attendance days, overtime & direct bank disbursement</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={approveAll} className="btn-primary">
            <CheckCircle size={16} /> Disburse All Pending
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Net Payout', value: `₹${(totalPayroll / 100000).toFixed(2)}L`, icon: '💰' },
          { label: 'Employees in Payroll', value: payrolls.length, icon: '👥' },
          { label: 'Total Overtime Paid', value: '₹12,300', icon: '⏱️' },
          { label: 'EPF & ESI Deducted', value: '₹4,750', icon: '🏦' }
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

      <Card>
        <CardHeader
          title={`Payroll Ledger — ${selectedMonth}`}
          subtitle="Calculated based on 26 standard mill working days"
        />
        <div className="overflow-x-auto">
          <table className="tom-table">
            <thead>
              <tr>
                <th>Slip ID</th>
                <th>Employee</th>
                <th>Designation</th>
                <th className="text-right">Base (₹)</th>
                <th className="text-center">Days</th>
                <th className="text-right">OT (₹)</th>
                <th className="text-right">Deductions (₹)</th>
                <th className="text-right font-bold text-white">Net Pay (₹)</th>
                <th>Disbursement</th>
                <th>Slip</th>
              </tr>
            </thead>
            <tbody>
              {payrolls.map(p => (
                <tr key={p.id}>
                  <td className="font-mono text-xs text-brand-400">{p.id}</td>
                  <td className="font-semibold text-white">{p.name}</td>
                  <td className="text-xs text-zinc-400">{p.role.replace('_', ' ')}</td>
                  <td className="text-right font-mono text-zinc-400">{p.baseSalary.toLocaleString('en-IN')}</td>
                  <td className="text-center font-mono text-zinc-300">{p.daysWorked} / 26</td>
                  <td className="text-right font-mono text-emerald-400">+{p.overtime.toLocaleString('en-IN')}</td>
                  <td className="text-right font-mono text-red-400">-{p.deductions.toLocaleString('en-IN')}</td>
                  <td className="text-right font-mono font-bold text-amber-300 text-sm">{p.netPay.toLocaleString('en-IN')}</td>
                  <td>
                    <Badge variant={p.status === 'PAID' ? 'success' : p.status === 'GENERATED' ? 'info' : 'warning'}>
                      {p.status}
                    </Badge>
                  </td>
                  <td>
                    <button className="btn-ghost text-xs">
                      <Download size={13} /> PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

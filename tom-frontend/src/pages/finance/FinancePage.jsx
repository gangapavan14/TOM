import { useState } from 'react'
import { Card, CardHeader, Badge, Modal, FormField } from '../../components/ui'
import { Plus, Check, ArrowUpRight, ArrowDownLeft, FileText, DollarSign, Calendar, Percent, ShieldCheck, BookOpen } from 'lucide-react'
import toast from 'react-hot-toast'

const initialAccounts = [
  { id: 'ACC-01', name: 'Main Cash Account', type: 'CASH', balance: '₹2,85,400', rawBalance: 285400, lastTx: '26 Sep 2026' },
  { id: 'ACC-02', name: 'HDFC Bank Current Account', type: 'BANK', balance: '₹14,32,000', rawBalance: 1432000, lastTx: '25 Sep 2026' },
  { id: 'ACC-03', name: 'Mill Petty Cash Register', type: 'CASH', balance: '₹12,500', rawBalance: 12500, lastTx: '26 Sep 2026' },
  { id: 'ACC-04', name: 'SBI Mill Corporate UPI', type: 'UPI', balance: '₹1,50,000', rawBalance: 150000, lastTx: '26 Sep 2026' },
]

const initialPayables = [
  {
    id: 1,
    supplier: 'Ravi Farms',
    grossAmount: 82000,
    dueDays: 2,
    dueDate: '28 Sep 2026',
    earlyPaymentEligible: true,
    earlyDiscountPercent: 2.0, // 2% immediate discount
    bankDetails: 'HDFC0001248 / A/C: 502000124987',
    status: 'DUE_SOON'
  },
  {
    id: 2,
    supplier: 'Krishna Agro Commission Agency',
    grossAmount: 124000,
    dueDays: 14,
    dueDate: '10 Oct 2026',
    earlyPaymentEligible: true,
    earlyDiscountPercent: 2.0,
    bankDetails: 'SBIN0004521 / A/C: 30129845123',
    status: 'NORMAL_CREDIT'
  },
  {
    id: 3,
    supplier: 'M. Prabhakar Rao (Broker Commission)',
    grossAmount: 18000,
    dueDays: 1,
    dueDate: '27 Sep 2026',
    earlyPaymentEligible: false,
    earlyDiscountPercent: 0,
    bankDetails: 'Cash Handover / Appointment with Admin',
    status: 'DUE_SOON'
  }
]

const initialExpenses = [
  { id: 1, desc: 'Loading worker daily wages (5 workers)', amount: 4500, category: 'Labour', classification: 'Direct / Inventory Cost', method: 'CASH', recorded: '26 Sep 2026' },
  { id: 2, desc: 'Diesel for Eicher Truck delivery run', amount: 2800, category: 'Transport', classification: 'Logistics Cost', method: 'UPI', recorded: '26 Sep 2026' },
  { id: 3, desc: '500 Standard 50kg Jute bags & twine', amount: 6200, category: 'Materials', classification: 'Processing & Packaging', method: 'BANK_TRANSFER', recorded: '25 Sep 2026' },
  { id: 4, desc: 'Boiler husk fuel biomass supply', amount: 15400, category: 'Fuel', classification: 'Processing Cost', method: 'BANK_TRANSFER', recorded: '24 Sep 2026' },
]

export default function FinancePage() {
  const [tab, setTab] = useState('payables')
  const [accounts, setAccounts] = useState(initialAccounts)
  const [payables, setPayables] = useState(initialPayables)
  const [expenses, setExpenses] = useState(initialExpenses)

  // Modals
  const [showExpenseModal, setShowExpenseModal] = useState(false)
  const [showPayModal, setShowPayModal] = useState(false)
  const [selectedPayable, setSelectedPayable] = useState(null)
  const [payMethod, setPayMethod] = useState('BANK_TRANSFER')
  const [takeEarlyDiscount, setTakeEarlyDiscount] = useState(false)

  // Expense Form
  const [newExpense, setNewExpense] = useState({
    desc: '',
    category: 'Labour',
    classification: 'Direct / Inventory Cost',
    amount: '',
    method: 'CASH'
  })

  // Open Pay Modal
  const openPayModal = (payable) => {
    setSelectedPayable(payable)
    setTakeEarlyDiscount(false)
    setPayMethod(payable.bankDetails.includes('Cash') ? 'CASH' : 'BANK_TRANSFER')
    setShowPayModal(true)
  }

  // Submit Supplier Settlement (Section 13.6, 13.7, 13.8)
  const handleConfirmPayment = (e) => {
    e.preventDefault()
    if (!selectedPayable) return

    const discountAmt = takeEarlyDiscount ? (selectedPayable.grossAmount * (selectedPayable.earlyDiscountPercent / 100)) : 0
    const finalPaid = selectedPayable.grossAmount - discountAmt

    setPayables(payables.filter(p => p.id !== selectedPayable.id))
    toast.success(
      `Disbursed ₹${finalPaid.toLocaleString('en-IN')} to ${selectedPayable.supplier} via ${payMethod.replace('_', ' ')}! ${discountAmt > 0 ? `(Saved ₹${discountAmt} early payment deduction)` : ''}`
    )
    setShowPayModal(false)
    setSelectedPayable(null)
  }

  // Create Expense Voucher (Section 13.4 & 13.5)
  const handleCreateExpense = (e) => {
    e.preventDefault()
    const amt = parseFloat(newExpense.amount) || 0
    if (!newExpense.desc || amt <= 0) {
      toast.error('Please enter description and valid amount')
      return
    }

    const created = {
      id: Date.now(),
      desc: newExpense.desc,
      amount: amt,
      category: newExpense.category,
      classification: newExpense.classification,
      method: newExpense.method,
      recorded: 'Today'
    }

    setExpenses([created, ...expenses])
    toast.success(`Expense voucher of ₹${amt.toLocaleString('en-IN')} (${newExpense.classification}) posted!`)
    setShowExpenseModal(false)
    setNewExpense({ desc: '', category: 'Labour', classification: 'Direct / Inventory Cost', amount: '', method: 'CASH' })
  }

  const totalExpenseVal = expenses.reduce((sum, e) => sum + e.amount, 0)
  const totalPayableVal = payables.reduce((sum, p) => sum + p.grossAmount, 0)

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="page-title text-2xl font-bold tracking-tight text-white font-display">Finance & Financial Authority</h1>
          <p className="page-sub text-zinc-400 text-sm mt-1">
            Section 13 & 14: Admin Financial Authority, Supplier Early Payment Deductions, Multi-Account Tracking & Ledger Audits
          </p>
        </div>
        <div className="flex gap-2">
          <button className="btn-primary" onClick={() => setShowExpenseModal(true)}>
            <Plus size={16} /> Record Expense Voucher
          </button>
        </div>
      </div>

      {/* Account Cards (Section 13.2) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {accounts.map(a => (
          <div key={a.id} className="tom-card p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">{a.type}</span>
                <p className="font-semibold text-white text-sm mt-0.5">{a.name}</p>
              </div>
              <span className="text-2xl">{a.type === 'CASH' ? '💵' : a.type === 'UPI' ? '📱' : '🏦'}</span>
            </div>
            <p className="font-display text-2xl font-extrabold text-white">{a.balance}</p>
            <p className="text-[11px] text-zinc-500 mt-1">Last activity: {a.lastTx}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface-2 p-1 rounded-xl w-fit">
        {['payables', 'expenses', 'ledgers'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${tab === t ? 'bg-surface-3 text-white' : 'text-zinc-500 hover:text-white'}`}>
            {t === 'payables' ? '1. Supplier Settlements (Section 13.6)' : t === 'expenses' ? '2. Classified Expenses' : '3. Core Operating Ledgers (Section 14)'}
          </button>
        ))}
      </div>

      {/* Payables Tab */}
      {tab === 'payables' && (
        <Card>
          <CardHeader
            title="Supplier Payables & Early Payout Options"
            subtitle="Section 13.6 & 13.7: Standard term is 15-20 days. Early settlement allows configurable % policy deduction."
            action={<Badge variant="warning">{payables.length} pending settlement</Badge>}
          />
          <div className="overflow-x-auto">
            <table className="tom-table">
              <thead>
                <tr>
                  <th>Supplier / Recipient</th>
                  <th className="text-right">Gross Amount</th>
                  <th>Payment Term Due</th>
                  <th>Early Payment Option (Section 13.6)</th>
                  <th>Disbursement Mode</th>
                  <th className="text-right">Admin Action</th>
                </tr>
              </thead>
              <tbody>
                {payables.map(p => (
                  <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="font-semibold text-white">
                      <div>{p.supplier}</div>
                      <span className="text-[11px] text-zinc-500 font-mono">{p.bankDetails}</span>
                    </td>
                    <td className="text-right font-mono font-bold text-amber-300">
                      ₹{p.grossAmount.toLocaleString('en-IN')}
                    </td>
                    <td>
                      <span className={`text-xs font-semibold ${p.dueDays <= 2 ? 'text-red-400' : 'text-zinc-300'}`}>
                        Due in {p.dueDays} days ({p.dueDate})
                      </span>
                    </td>
                    <td>
                      {p.earlyPaymentEligible ? (
                        <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                          <Percent size={13} /> {p.earlyDiscountPercent}% Early Payout Deduction available
                        </span>
                      ) : (
                        <span className="text-xs text-zinc-500">Standard Net Pay</span>
                      )}
                    </td>
                    <td>
                      <Badge variant={p.bankDetails.includes('Cash') ? 'warning' : 'info'}>
                        {p.bankDetails.includes('Cash') ? 'Cash (Admin Appt)' : 'NEFT / RTGS'}
                      </Badge>
                    </td>
                    <td className="text-right">
                      <button
                        onClick={() => openPayModal(p)}
                        className="btn-primary text-xs px-3 py-1.5"
                      >
                        Authorize Payment →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Expenses Tab (Section 13.4 & 13.5) */}
      {tab === 'expenses' && (
        <Card>
          <CardHeader
            title="Classified Mill Operating Expenses"
            subtitle="Section 13.4: Categorized into Direct Inventory, Processing, Logistics, or General Business Cost"
            action={<Badge variant="info">Total: ₹{totalExpenseVal.toLocaleString('en-IN')}</Badge>}
          />
          <div className="overflow-x-auto">
            <table className="tom-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Classification (Section 13.4)</th>
                  <th>Payment Method</th>
                  <th className="text-right">Amount (₹)</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map(e => (
                  <tr key={e.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="font-semibold text-white">{e.desc}</td>
                    <td><Badge variant="info">{e.category}</Badge></td>
                    <td className="text-xs text-amber-300 font-medium">{e.classification}</td>
                    <td className="text-xs font-mono text-zinc-400">{e.method}</td>
                    <td className="text-right font-mono font-bold text-red-400">-₹{e.amount.toLocaleString('en-IN')}</td>
                    <td className="text-zinc-500 text-xs">{e.recorded}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Core Ledgers Tab (Section 14) */}
      {tab === 'ledgers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: 'Supplier Payable Ledger', code: 'LEDGER-01', balance: `₹${totalPayableVal.toLocaleString('en-IN')}`, desc: 'Active raw seed lots awaiting 15-day settlement' },
            { name: 'Customer Receivable Ledger', code: 'LEDGER-02', balance: '₹6,36,500', desc: 'B2B orders delivered on credit' },
            { name: 'Mill Operating Expense Ledger', code: 'LEDGER-03', balance: `₹${totalExpenseVal.toLocaleString('en-IN')}`, desc: 'Diesel, biomass fuel, gunny bags, labour wages' },
            { name: 'Workforce Payroll Payable', code: 'LEDGER-04', balance: '₹1,24,000', desc: 'Monthly operator base salaries & overtime' },
            { name: 'Broker Commission Ledger', code: 'LEDGER-05', balance: '₹18,000', desc: 'Fixed per-farmer & per-ton agent commissions' },
            { name: 'Cash & Bank Liquid Ledger', code: 'LEDGER-06', balance: '₹18,82,900', desc: 'Consolidated cash in hand + bank balances' },
          ].map(led => (
            <Card key={led.name} className="p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs text-zinc-500">{led.code}</span>
                  <span className="text-xs text-emerald-400 font-semibold">Active Ledger</span>
                </div>
                <h3 className="font-display font-bold text-white text-base">{led.name}</h3>
                <p className="text-zinc-400 text-xs mt-1">{led.desc}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs text-zinc-500">Balance:</span>
                <span className="font-mono font-bold text-amber-300 text-base">{led.balance}</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Authorize Supplier Payment Modal */}
      <Modal open={showPayModal} onClose={() => setShowPayModal(false)} title={`Authorize Payment — ${selectedPayable?.supplier}`}>
        <form onSubmit={handleConfirmPayment} className="space-y-4">
          <div className="p-4 bg-surface-3 rounded-xl space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-zinc-400">Recipient:</span>
              <span className="font-bold text-white">{selectedPayable?.supplier}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Gross Procurement Payable:</span>
              <span className="font-mono text-white font-bold">₹{selectedPayable?.grossAmount?.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Standard Due Date:</span>
              <span className="font-mono text-zinc-300">{selectedPayable?.dueDate}</span>
            </div>
          </div>

          {selectedPayable?.earlyPaymentEligible && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-2">
              <label className="flex items-center gap-3 cursor-pointer text-xs font-semibold text-amber-300">
                <input
                  type="checkbox"
                  checked={takeEarlyDiscount}
                  onChange={e => setTakeEarlyDiscount(e.target.checked)}
                  className="rounded accent-amber-500 w-4 h-4"
                />
                Apply Immediate Early Payout Deduction (2% = ₹{(selectedPayable?.grossAmount * 0.02)?.toLocaleString('en-IN')})
              </label>
              <p className="text-[11px] text-zinc-400 pl-7">
                Under Section 13.6 policy, if a supplier requests instant payment ahead of the 15-day credit cycle, a standard deduction applies to mill cash outlays.
              </p>
            </div>
          )}

          <FormField label="Disbursement Method (Section 13.1)">
            <select
              className="tom-select"
              value={payMethod}
              onChange={e => setPayMethod(e.target.value)}
            >
              <option value="BANK_TRANSFER">Bank NEFT / RTGS (HDFC Account)</option>
              <option value="CASH">Cash in Hand (Admin Physical Appointment)</option>
              <option value="UPI">Corporate UPI Transfer (SBI)</option>
              <option value="CHEQUE">Account Payee Cheque</option>
            </select>
          </FormField>

          <div className="p-3 bg-surface-2 rounded-xl flex items-center justify-between text-xs font-bold">
            <span className="text-zinc-300">Final Payout Amount:</span>
            <span className="font-mono text-emerald-400 text-base">
              ₹ {takeEarlyDiscount
                ? (selectedPayable?.grossAmount * 0.98).toLocaleString('en-IN')
                : selectedPayable?.grossAmount?.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setShowPayModal(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Execute Financial Payout</button>
          </div>
        </form>
      </Modal>

      {/* Record Expense Modal */}
      <Modal open={showExpenseModal} onClose={() => setShowExpenseModal(false)} title="Record Classified Mill Expense Voucher">
        <form onSubmit={handleCreateExpense} className="space-y-4">
          <FormField label="Expense Description">
            <input
              required
              className="tom-input"
              placeholder="e.g. Expeller roller bearing replacement"
              value={newExpense.desc}
              onChange={e => setNewExpense({ ...newExpense, desc: e.target.value })}
            />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Category">
              <select
                className="tom-select"
                value={newExpense.category}
                onChange={e => setNewExpense({ ...newExpense, category: e.target.value })}
              >
                <option value="Labour">Labour & Loading Wages</option>
                <option value="Transport">Vehicle Fuel & Freight</option>
                <option value="Materials">Packaging & Jute Bags</option>
                <option value="Fuel">Boiler Husk Biomass Fuel</option>
                <option value="Repairs">Processing Machinery Repairs</option>
                <option value="Office">Office & Communication</option>
              </select>
            </FormField>

            <FormField label="Accounting Classification (Section 13.4)">
              <select
                className="tom-select"
                value={newExpense.classification}
                onChange={e => setNewExpense({ ...newExpense, classification: e.target.value })}
              >
                <option value="Direct / Inventory Cost">Inventory / Direct Cost</option>
                <option value="Processing Cost">Processing Cost</option>
                <option value="Logistics Cost">Logistics Cost</option>
                <option value="General Business Expense">General Business Expense</option>
                <option value="Capital Expenditure">Capital Expenditure</option>
              </select>
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Amount (₹)">
              <input
                required
                type="number"
                className="tom-input font-mono"
                placeholder="e.g. 4500"
                value={newExpense.amount}
                onChange={e => setNewExpense({ ...newExpense, amount: e.target.value })}
              />
            </FormField>
            <FormField label="Payment Method">
              <select
                className="tom-select"
                value={newExpense.method}
                onChange={e => setNewExpense({ ...newExpense, method: e.target.value })}
              >
                <option value="CASH">Cash</option>
                <option value="BANK_TRANSFER">Bank Transfer</option>
                <option value="UPI">UPI</option>
                <option value="CHEQUE">Cheque</option>
              </select>
            </FormField>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setShowExpenseModal(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Post Expense Voucher</button>
          </div>
        </form>
      </Modal>

    </div>
  )
}

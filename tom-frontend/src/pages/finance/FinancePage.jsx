import { useState } from 'react'
import { Card, CardHeader, Badge, Modal, FormField } from '../../components/ui'
import { Plus, Check, ArrowUpRight, ArrowDownLeft, FileText } from 'lucide-react'
import toast from 'react-hot-toast'

const initialAccounts = [
  { name: 'Main Cash Account', type: 'CASH', balance: '₹2,85,400', lastTx: '26 Sep 2026' },
  { name: 'HDFC Bank — TOM', type: 'BANK', balance: '₹14,32,000', lastTx: '25 Sep 2026' },
  { name: 'Petty Cash', type: 'CASH', balance: '₹12,500', lastTx: '26 Sep 2026' },
]

const initialPayables = [
  { id: 1, supplier: 'Ravi Farms', amount: '₹82,000', rawAmount: 82000, due: '28 Sep 2026', days: 2, status: 'DUE_SOON' },
  { id: 2, supplier: 'Krishna Agro', amount: '₹1,24,000', rawAmount: 124000, due: '30 Sep 2026', days: 4, status: 'UPCOMING' },
  { id: 3, supplier: 'Sri Balaji Transporters', amount: '₹34,000', rawAmount: 34000, due: '02 Oct 2026', days: 6, status: 'UPCOMING' },
]

const initialExpenses = [
  { id: 1, desc: 'Loading worker wages — 26 Sep', amount: '₹4,500', rawAmount: 4500, category: 'Labour', recorded: '26 Sep 2026' },
  { id: 2, desc: 'Vehicle fuel — delivery run', amount: '₹2,800', rawAmount: 2800, category: 'Transport', recorded: '26 Sep 2026' },
  { id: 3, desc: 'Packaging materials & gunny twine', amount: '₹6,200', rawAmount: 6200, category: 'Materials', recorded: '25 Sep 2026' },
]

export default function FinancePage() {
  const [payables, setPayables] = useState(initialPayables)
  const [expenses, setExpenses] = useState(initialExpenses)
  const [showExpenseModal, setShowExpenseModal] = useState(false)
  const [showTransactionsModal, setShowTransactionsModal] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState(null)

  const [newExpense, setNewExpense] = useState({
    desc: '',
    category: 'Labour',
    amount: '',
  })

  const handlePay = (payableId, supplier, amount) => {
    setPayables(payables.filter(p => p.id !== payableId))
    toast.success(`Disbursed payment of ${amount} to ${supplier} via HDFC Bank NEFT`)
  }

  const handleCreateExpense = (e) => {
    e.preventDefault()
    const amt = parseFloat(newExpense.amount) || 0
    if (!newExpense.desc || amt <= 0) {
      toast.error('Please enter expense description and valid amount')
      return
    }

    const created = {
      id: Date.now(),
      desc: newExpense.desc,
      amount: `₹${amt.toLocaleString('en-IN')}`,
      rawAmount: amt,
      category: newExpense.category,
      recorded: 'Today'
    }

    setExpenses([created, ...expenses])
    toast.success(`Expense entry of ₹${amt.toLocaleString('en-IN')} recorded`)
    setShowExpenseModal(false)
    setNewExpense({ desc: '', category: 'Labour', amount: '' })
  }

  const totalExpenseVal = expenses.reduce((sum, e) => sum + (e.rawAmount || 0), 0)
  const totalPayableVal = payables.reduce((sum, p) => sum + (p.rawAmount || 0), 0)

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="page-title text-2xl font-bold tracking-tight text-white font-display">Finance & Accounts</h1>
          <p className="page-sub text-zinc-400 text-sm mt-1">Cash balances, supplier payments, mill operating expenses, and reconciliation</p>
        </div>
        <button className="btn-primary" onClick={() => setShowExpenseModal(true)}>
          <Plus size={16} /> Record Expense
        </button>
      </div>

      {/* Account Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {initialAccounts.map(a => (
          <div key={a.name} className="tom-card p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs font-semibold text-zinc-500 mb-1">{a.type}</p>
                <p className="font-semibold text-white text-sm">{a.name}</p>
              </div>
              <span className="text-2xl">{a.type === 'CASH' ? '💵' : '🏦'}</span>
            </div>
            <p className="font-display text-2xl font-extrabold text-white">{a.balance}</p>
            <p className="text-xs text-zinc-500 mt-1">Last transaction: {a.lastTx}</p>
            <button
              onClick={() => { setSelectedAccount(a); setShowTransactionsModal(true) }}
              className="btn-secondary w-full mt-4 text-xs"
            >
              View Transactions →
            </button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Supplier Payables */}
        <Card>
          <CardHeader
            title="🏦 Supplier Payables"
            subtitle="Upcoming raw material settlements"
            action={<Badge variant="warning">{payables.length} due</Badge>}
          />
          <div className="overflow-x-auto">
            <table className="tom-table">
              <thead>
                <tr><th>Supplier</th><th>Amount</th><th>Due Date</th><th>In Days</th><th>Status</th><th className="text-right">Actions</th></tr>
              </thead>
              <tbody>
                {payables.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-6 text-zinc-500 text-xs">
                      All supplier invoices settled! No pending payables.
                    </td>
                  </tr>
                ) : (
                  payables.map(p => (
                    <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="font-semibold text-white">{p.supplier}</td>
                      <td className="text-amber-300 font-semibold font-mono">{p.amount}</td>
                      <td className="text-zinc-400 text-xs">{p.due}</td>
                      <td>
                        <span className={`text-xs font-semibold ${p.days <= 2 ? 'text-red-400' : 'text-amber-400'}`}>
                          {p.days}d
                        </span>
                      </td>
                      <td><Badge variant={p.status === 'DUE_SOON' ? 'danger' : 'warning'}>{p.status.replace('_', ' ')}</Badge></td>
                      <td className="text-right">
                        <button
                          onClick={() => handlePay(p.id, p.supplier, p.amount)}
                          className="btn-primary text-xs px-2.5 py-1"
                        >
                          Pay Now
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Expenses */}
        <Card>
          <CardHeader
            title="📉 Recent Mill Expenses"
            subtitle={`Total logged: ₹${totalExpenseVal.toLocaleString('en-IN')}`}
            action={
              <button onClick={() => setShowExpenseModal(true)} className="btn-primary text-xs px-3 py-1.5">
                + Add Expense
              </button>
            }
          />
          <div className="overflow-x-auto">
            <table className="tom-table">
              <thead>
                <tr><th>Description</th><th>Category</th><th>Amount</th><th>Date</th></tr>
              </thead>
              <tbody>
                {expenses.map(e => (
                  <tr key={e.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="text-white text-sm font-medium">{e.desc}</td>
                    <td><Badge variant="info">{e.category}</Badge></td>
                    <td className="font-semibold text-red-400 font-mono">-{e.amount}</td>
                    <td className="text-zinc-500 text-xs">{e.recorded}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Summary bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Cash + Bank', value: '₹17,29,900', color: 'text-emerald-400' },
          { label: 'Total Receivables', value: '₹6,36,500', color: 'text-amber-400' },
          { label: 'Total Payables', value: `₹${totalPayableVal.toLocaleString('en-IN')}`, color: 'text-red-400' },
          { label: 'Net Cash Position', value: `₹${(1729900 - totalPayableVal).toLocaleString('en-IN')}`, color: 'text-brand-400' },
        ].map(s => (
          <div key={s.label} className="tom-card p-4 text-center">
            <p className={`font-display text-xl font-extrabold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-zinc-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Record Expense Modal */}
      <Modal
        open={showExpenseModal}
        onClose={() => setShowExpenseModal(false)}
        title="Record Mill Expense / Payment Voucher"
      >
        <form onSubmit={handleCreateExpense} className="space-y-4">
          <FormField label="Expense Description">
            <input
              required
              className="tom-input"
              placeholder="e.g. Expeller machine maintenance grease"
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
                <option value="Transport">Transport & Freight</option>
                <option value="Materials">Packaging Materials</option>
                <option value="Maintenance">Equipment Spares & Oils</option>
                <option value="Electricity">Electricity & Boiler Fuel</option>
              </select>
            </FormField>

            <FormField label="Amount (₹)">
              <input
                required
                type="number"
                step="1"
                className="tom-input"
                placeholder="e.g. 4500"
                value={newExpense.amount}
                onChange={e => setNewExpense({ ...newExpense, amount: e.target.value })}
              />
            </FormField>
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button type="button" className="btn-secondary" onClick={() => setShowExpenseModal(false)}>Cancel</button>
            <button type="submit" className="btn-primary">Post Expense Voucher</button>
          </div>
        </form>
      </Modal>

      {/* Transactions Modal */}
      <Modal
        open={showTransactionsModal}
        onClose={() => setShowTransactionsModal(false)}
        title={`Ledger History — ${selectedAccount?.name || 'Account'}`}
      >
        <div className="space-y-4">
          <div className="p-3 bg-surface-3 rounded-xl flex items-center justify-between text-xs">
            <span className="text-zinc-400">Current Balance:</span>
            <span className="font-mono text-emerald-400 font-bold text-sm">{selectedAccount?.balance}</span>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {[
              { desc: 'B2B Sales Receipt — Kumar Traders', type: 'CR', amt: '+₹50,000', date: '26 Sep 14:15' },
              { desc: 'Worker Overtime Disbursement', type: 'DR', amt: '-₹12,400', date: '26 Sep 11:30' },
              { desc: 'Raw Seed Advance — Sri Rama Agros', type: 'DR', amt: '-₹35,000', date: '25 Sep 17:00' },
              { desc: 'Sunflower Oil Tanker Clearance', type: 'CR', amt: '+₹1,85,000', date: '24 Sep 16:45' },
            ].map((tx, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 bg-surface-2 border border-white/5 rounded-lg text-xs">
                <div>
                  <p className="font-medium text-white">{tx.desc}</p>
                  <p className="text-[11px] text-zinc-500">{tx.date}</p>
                </div>
                <span className={`font-mono font-bold ${tx.type === 'CR' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {tx.amt}
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-2">
            <button onClick={() => setShowTransactionsModal(false)} className="btn-secondary text-xs">Close</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

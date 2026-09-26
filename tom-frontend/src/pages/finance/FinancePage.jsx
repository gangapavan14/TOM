import { Card, CardHeader, Badge } from '../../components/ui'

const accounts = [
  { name:'Main Cash Account',    type:'CASH',  balance:'₹2,85,400', lastTx:'26 Sep 2026' },
  { name:'HDFC Bank — TOM',      type:'BANK',  balance:'₹14,32,000',lastTx:'25 Sep 2026' },
  { name:'Petty Cash',           type:'CASH',  balance:'₹12,500',   lastTx:'26 Sep 2026' },
]
const payables = [
  { supplier:'Ravi Farms',   amount:'₹82,000', due:'28 Sep 2026', days:2, status:'DUE_SOON' },
  { supplier:'Krishna Agro', amount:'₹1,24,000',due:'30 Sep 2026',days:4, status:'UPCOMING' },
]
const expenses = [
  { desc:'Loading worker wages — 26 Sep', amount:'₹4,500',  category:'Labour',    recorded:'26 Sep 2026' },
  { desc:'Vehicle fuel — delivery run',   amount:'₹2,800',  category:'Transport', recorded:'26 Sep 2026' },
  { desc:'Packaging materials',           amount:'₹6,200',  category:'Materials', recorded:'25 Sep 2026' },
]

export default function FinancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Finance & Accounts</h1>
        <p className="page-sub">Cash balances, supplier payments, expenses, and reconciliation</p>
      </div>

      {/* Account Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {accounts.map(a=>(
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
            <button className="btn-secondary w-full mt-4 text-xs">View Transactions</button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Supplier Payables */}
        <Card>
          <CardHeader title="🏦 Supplier Payables" subtitle="Upcoming payments due"
            action={<Badge variant="warning">{payables.length} due</Badge>} />
          <div className="overflow-x-auto">
            <table className="tom-table">
              <thead>
                <tr><th>Supplier</th><th>Amount</th><th>Due Date</th><th>In Days</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {payables.map((p,i)=>(
                  <tr key={i}>
                    <td className="font-semibold text-white">{p.supplier}</td>
                    <td className="text-brand-400 font-semibold">{p.amount}</td>
                    <td className="text-zinc-400 text-xs">{p.due}</td>
                    <td>
                      <span className={`text-xs font-semibold ${p.days <= 2 ? 'text-red-400' : 'text-amber-400'}`}>
                        {p.days}d
                      </span>
                    </td>
                    <td><Badge variant={p.status === 'DUE_SOON' ? 'danger' : 'warning'}>{p.status.replace('_',' ')}</Badge></td>
                    <td><button className="btn-primary text-xs px-2 py-1">Pay Now</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Expenses */}
        <Card>
          <CardHeader title="📉 Recent Expenses" subtitle="Last 7 days"
            action={<button className="btn-primary text-xs px-3 py-1.5">Add Expense</button>} />
          <div className="overflow-x-auto">
            <table className="tom-table">
              <thead>
                <tr><th>Description</th><th>Category</th><th>Amount</th><th>Date</th></tr>
              </thead>
              <tbody>
                {expenses.map((e,i)=>(
                  <tr key={i}>
                    <td className="text-white text-sm">{e.desc}</td>
                    <td><Badge variant="info">{e.category}</Badge></td>
                    <td className="font-semibold text-red-400">{e.amount}</td>
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
          { label:'Total Cash + Bank',    value:'₹17,29,900', color:'text-emerald-400' },
          { label:'Total Receivables',    value:'₹6,36,500',  color:'text-amber-400' },
          { label:'Total Payables',       value:'₹2,06,000',  color:'text-red-400' },
          { label:'Net Position',         value:'₹21,60,400', color:'text-brand-400' },
        ].map(s=>(
          <div key={s.label} className="tom-card p-4 text-center">
            <p className={`font-display text-xl font-extrabold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-zinc-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

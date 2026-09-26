import { useState } from 'react'
import { Card, CardHeader, Badge, StatusBadge, Modal, FormField } from '../../components/ui'
import { Plus, Search, TrendingUp } from 'lucide-react'

const mockOrders = [
  { id:'ORD-001', customer:'Kumar Traders',  product:'Turmeric A+', qty:50,  value:'₹3,12,500', status:'CONFIRMED',    date:'26 Sep 2026' },
  { id:'ORD-002', customer:'Sri Balaji Co.', product:'Maize A',     qty:100, value:'₹55,000',   status:'LOADING',      date:'26 Sep 2026' },
  { id:'ORD-003', customer:'Priya Exports',  product:'Sesame B',    qty:30,  value:'₹87,000',   status:'PAYMENT_PENDING', date:'25 Sep 2026' },
  { id:'ORD-004', customer:'Ramesh Foods',   product:'Turmeric A',  qty:80,  value:'₹4,72,000', status:'DELIVERED',    date:'24 Sep 2026' },
  { id:'ORD-005', customer:'GK Enterprises', product:'Maize A',     qty:200, value:'₹1,10,000', status:'CREDIT_APPROVED', date:'23 Sep 2026' },
]

const mockCustomers = [
  { id:1, name:'Kumar Traders',  contact:'Suresh Kumar', phone:'+91-98765-43210', city:'Hyderabad', outstanding:'₹3,12,500', status:'ACTIVE' },
  { id:2, name:'Sri Balaji Co.', contact:'Balaji Rao',   phone:'+91-87654-32109', city:'Warangal',  outstanding:'₹55,000',   status:'ACTIVE' },
  { id:3, name:'Priya Exports',  contact:'Priya Devi',   phone:'+91-76543-21098', city:'Nizamabad', outstanding:'₹87,000',   status:'ACTIVE' },
]

export default function SalesPage() {
  const [tab, setTab] = useState('orders')
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)

  const filtered = mockOrders.filter(o =>
    o.customer.toLowerCase().includes(search.toLowerCase()) ||
    o.id.toLowerCase().includes(search.toLowerCase())
  )

  const statusVariant = s => ({
    CONFIRMED:'success', LOADING:'info', PAYMENT_PENDING:'warning',
    DELIVERED:'muted', CREDIT_APPROVED:'info'
  }[s] ?? 'muted')

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="page-title">B2B Sales</h1>
          <p className="page-sub">Customer orders, invoices, collections, and credit management</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={16} /> New Order
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label:'Open Orders',   value: mockOrders.filter(o=>!['DELIVERED','CLOSED'].includes(o.status)).length, icon:'📋', color:'text-blue-400 bg-blue-500/10' },
          { label:'Receivables',   value: '₹6,36,500',  icon:'💰', color:'text-amber-400 bg-amber-500/10' },
          { label:'Overdue',       value: '₹87,000',    icon:'⚠️', color:'text-red-400 bg-red-500/10' },
          { label:'This Month',    value: '₹12.4L',     icon:'📈', color:'text-emerald-400 bg-emerald-500/10' },
        ].map(s=>(
          <div key={s.label} className="tom-card p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center text-xl`}>{s.icon}</div>
            <div>
              <p className="text-xl font-extrabold font-display text-white">{s.value}</p>
              <p className="text-xs text-zinc-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* B2B Flow reminder */}
      <div className="flex gap-1.5 items-center text-xs text-zinc-500 bg-surface-2 rounded-xl px-4 py-3 flex-wrap">
        {['Enquiry','Negotiation','Confirmed','Reserved','Invoiced','Loading','Verified','Dispatched','Delivered','Closed'].map((s,i,arr)=>(
          <span key={s} className="flex items-center gap-1.5">
            <span className={`${i <= 3 ? 'text-brand-400' : 'text-zinc-400'}`}>{s}</span>
            {i < arr.length-1 && <span className="text-zinc-700">→</span>}
          </span>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface-2 p-1 rounded-xl w-fit">
        {['orders','customers','enquiries'].map(t=>(
          <button key={t} onClick={()=>setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${tab===t?'bg-surface-3 text-white':'text-zinc-500 hover:text-white'}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="relative w-72">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input className="tom-input pl-9" placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)} />
      </div>

      {tab === 'orders' && (
        <Card>
          <div className="overflow-x-auto">
            <table className="tom-table">
              <thead>
                <tr><th>Order ID</th><th>Customer</th><th>Product</th><th>Bags</th><th>Value</th><th>Status</th><th>Date</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.map(o=>(
                  <tr key={o.id}>
                    <td className="font-mono text-xs text-zinc-400">{o.id}</td>
                    <td className="font-semibold text-white">{o.customer}</td>
                    <td>{o.product}</td>
                    <td>{o.qty}</td>
                    <td className="font-semibold text-brand-400">{o.value}</td>
                    <td><Badge variant={statusVariant(o.status)}>{o.status.replace('_',' ')}</Badge></td>
                    <td className="text-zinc-500 text-xs">{o.date}</td>
                    <td className="flex gap-1">
                      <button className="btn-ghost text-xs">View</button>
                      {o.status === 'PAYMENT_PENDING' && <button className="btn-primary text-xs px-2 py-1">Verify Pay</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {tab === 'customers' && (
        <Card>
          <div className="overflow-x-auto">
            <table className="tom-table">
              <thead>
                <tr><th>Name</th><th>Contact</th><th>Phone</th><th>City</th><th>Outstanding</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {mockCustomers.map(c=>(
                  <tr key={c.id}>
                    <td className="font-semibold text-white">{c.name}</td>
                    <td className="text-zinc-400">{c.contact}</td>
                    <td className="text-zinc-400 font-mono text-xs">{c.phone}</td>
                    <td className="text-zinc-400">{c.city}</td>
                    <td className="font-semibold text-amber-400">{c.outstanding}</td>
                    <td><Badge variant="success">{c.status}</Badge></td>
                    <td><button className="btn-ghost text-xs">View Orders</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {tab === 'enquiries' && (
        <div className="tom-card p-12 text-center">
          <p className="text-4xl mb-3">📨</p>
          <p className="text-zinc-300 font-medium">No pending enquiries</p>
          <p className="text-zinc-500 text-xs mt-1">New customer enquiries will appear here</p>
        </div>
      )}

      {/* New Order Modal */}
      <Modal open={showModal} onClose={()=>setShowModal(false)} title="Create New Sales Order"
        footer={<>
          <button className="btn-secondary" onClick={()=>setShowModal(false)}>Cancel</button>
          <button className="btn-primary">Create Order</button>
        </>}>
        <div className="space-y-4">
          <FormField label="Customer">
            <select className="tom-select">
              <option value="">Select customer</option>
              {mockCustomers.map(c=><option key={c.id}>{c.name}</option>)}
            </select>
          </FormField>
          <FormField label="Product">
            <select className="tom-select">
              <option>Turmeric A+</option><option>Turmeric A</option>
              <option>Maize A</option><option>Sesame B</option>
            </select>
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Quantity (bags)">
              <input type="number" className="tom-input" placeholder="e.g. 50" />
            </FormField>
            <FormField label="Price/bag (₹)">
              <input type="number" className="tom-input" placeholder="e.g. 6250" />
            </FormField>
          </div>
          <FormField label="Payment Terms">
            <select className="tom-select">
              <option>Immediate Payment</option>
              <option>Credit — 15 days</option>
              <option>Credit — 20 days</option>
            </select>
          </FormField>
        </div>
      </Modal>
    </div>
  )
}

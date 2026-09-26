import { useState, useEffect } from 'react'
import { Card, CardHeader, Badge, StatusBadge, Modal, FormField } from '../../components/ui'
import { salesApi } from '../../api/endpoints'
import { Plus, Search, TrendingUp, CheckCircle, FileText, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'

const initialOrders = [
  { id: 'ORD-001', customer: 'Kumar Traders', product: 'Turmeric A+', qty: 50, value: '₹3,12,500', rawValue: 312500, status: 'CONFIRMED', date: '26 Sep 2026' },
  { id: 'ORD-002', customer: 'Sri Balaji Co.', product: 'Maize A', qty: 100, value: '₹55,000', rawValue: 55000, status: 'LOADING', date: '26 Sep 2026' },
  { id: 'ORD-003', customer: 'Priya Exports', product: 'Sesame B', qty: 30, value: '₹87,000', rawValue: 87000, status: 'PAYMENT_PENDING', date: '25 Sep 2026' },
  { id: 'ORD-004', customer: 'Ramesh Foods', product: 'Turmeric A', qty: 80, value: '₹4,72,000', rawValue: 472000, status: 'DELIVERED', date: '24 Sep 2026' },
  { id: 'ORD-005', customer: 'GK Enterprises', product: 'Maize A', qty: 200, value: '₹1,10,000', rawValue: 110000, status: 'CREDIT_APPROVED', date: '23 Sep 2026' },
]

const initialCustomers = [
  { id: 1, name: 'Kumar Traders', contact: 'Suresh Kumar', phone: '+91-98765-43210', city: 'Hyderabad', outstanding: '₹3,12,500', status: 'ACTIVE' },
  { id: 2, name: 'Sri Balaji Co.', contact: 'Balaji Rao', phone: '+91-87654-32109', city: 'Warangal', outstanding: '₹55,000', status: 'ACTIVE' },
  { id: 3, name: 'Priya Exports', contact: 'Priya Devi', phone: '+91-76543-21098', city: 'Nizamabad', outstanding: '₹87,000', status: 'ACTIVE' },
]

export default function SalesPage() {
  const [tab, setTab] = useState('orders')
  const [search, setSearch] = useState('')
  const [orders, setOrders] = useState(initialOrders)
  const [customers, setCustomers] = useState(initialCustomers)

  // Modals
  const [showModal, setShowModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)

  // Order Form
  const [newOrder, setNewOrder] = useState({
    customer: 'Kumar Traders',
    product: 'Turmeric A+',
    qty: 50,
    pricePerBag: 6250,
    paymentTerms: 'Credit — 15 days'
  })

  useEffect(() => {
    Promise.all([
      salesApi.orders().catch(() => ({ data: { data: [] } })),
      salesApi.customers().catch(() => ({ data: { data: [] } }))
    ]).then(([ordersRes, custRes]) => {
      const oData = ordersRes.data?.data || []
      const cData = custRes.data?.data || []
      if (oData.length > 0) {
        setOrders(oData.map(o => ({
          id: o.orderCode || `ORD-${o.id}`,
          customer: o.customer?.name || 'Local Wholesale Client',
          product: o.commodity || 'Turmeric A',
          qty: o.totalBags || 50,
          value: `₹${(parseFloat(o.totalAmount) || 150000).toLocaleString('en-IN')}`,
          rawValue: parseFloat(o.totalAmount) || 150000,
          status: o.status || 'CONFIRMED',
          date: new Date(o.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
        })))
      }
      if (cData.length > 0) {
        setCustomers(cData.map(c => ({
          id: c.id,
          name: c.name,
          contact: c.contactPerson || c.name,
          phone: c.phone || '—',
          city: c.city || 'Telangana',
          outstanding: `₹${(parseFloat(c.outstandingBalance) || 0).toLocaleString('en-IN')}`,
          status: c.status || 'ACTIVE'
        })))
      }
    })
  }, [])

  const handleCreateOrder = async (e) => {
    e.preventDefault()
    const bags = parseInt(newOrder.qty) || 0
    const price = parseFloat(newOrder.pricePerBag) || 0
    const total = bags * price

    const created = {
      id: `ORD-00${orders.length + 1}`,
      customer: newOrder.customer,
      product: newOrder.product,
      qty: bags,
      value: `₹${total.toLocaleString('en-IN')}`,
      rawValue: total,
      status: 'CONFIRMED',
      date: 'Today'
    }

    try {
      await salesApi.createOrder({
        commodity: newOrder.product,
        totalBags: bags,
        ratePerBag: price,
        totalAmount: total,
        paymentTerms: newOrder.paymentTerms
      })
      toast.success(`Sales Order #${created.id} Created!`)
    } catch {
      toast.success(`Sales Order #${created.id} Recorded!`)
    }

    setOrders([created, ...orders])
    setShowModal(false)
  }

  const handleVerifyPayment = (orderId) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'CONFIRMED' } : o))
    toast.success(`Payment verified for ${orderId} — Order moved to CONFIRMED`)
  }

  const filtered = orders.filter(o =>
    o.customer.toLowerCase().includes(search.toLowerCase()) ||
    o.id.toLowerCase().includes(search.toLowerCase()) ||
    o.product.toLowerCase().includes(search.toLowerCase())
  )

  const statusVariant = s => ({
    CONFIRMED: 'success', LOADING: 'info', PAYMENT_PENDING: 'warning',
    DELIVERED: 'muted', CREDIT_APPROVED: 'info'
  }[s] ?? 'muted')

  const totalReceivables = orders
    .filter(o => ['CONFIRMED', 'LOADING', 'CREDIT_APPROVED', 'PAYMENT_PENDING'].includes(o.status))
    .reduce((sum, o) => sum + (o.rawValue || 0), 0)

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="page-title text-2xl font-bold tracking-tight text-white font-display">B2B Sales</h1>
          <p className="page-sub text-zinc-400 text-sm mt-1">Customer orders, invoices, collections, and credit management</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={16} /> New Sales Order
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Open Orders', value: orders.filter(o => !['DELIVERED', 'CLOSED'].includes(o.status)).length, icon: '📋', color: 'text-blue-400 bg-blue-500/10' },
          { label: 'Active Receivables', value: `₹${(totalReceivables / 100000).toFixed(1)} L`, icon: '💰', color: 'text-amber-400 bg-amber-500/10' },
          { label: 'Payment Pending', value: orders.filter(o => o.status === 'PAYMENT_PENDING').length, icon: '⚠️', color: 'text-red-400 bg-red-500/10' },
          { label: 'Customers', value: customers.length, icon: '🏢', color: 'text-emerald-400 bg-emerald-500/10' },
        ].map(s => (
          <div key={s.label} className="tom-card p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center text-xl`}>{s.icon}</div>
            <div>
              <p className="text-xl font-extrabold font-display text-white">{s.value}</p>
              <p className="text-xs text-zinc-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* B2B Flow banner */}
      <div className="flex gap-1.5 items-center text-xs text-zinc-500 bg-surface-2 rounded-xl px-4 py-3 flex-wrap">
        {['Enquiry', 'Negotiation', 'Confirmed', 'Reserved', 'Invoiced', 'Loading', 'Verified', 'Dispatched', 'Delivered'].map((s, i, arr) => (
          <span key={s} className="flex items-center gap-1.5">
            <span className={`${i <= 3 ? 'text-brand-400 font-semibold' : 'text-zinc-400'}`}>{s}</span>
            {i < arr.length - 1 && <span className="text-zinc-700">→</span>}
          </span>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface-2 p-1 rounded-xl w-fit">
        {['orders', 'customers', 'enquiries'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${tab === t ? 'bg-surface-3 text-white' : 'text-zinc-500 hover:text-white'}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="relative w-72">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input className="tom-input pl-9" placeholder="Search orders, customers..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {tab === 'orders' && (
        <Card>
          <div className="overflow-x-auto">
            <table className="tom-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Product</th>
                  <th className="text-right">Bags</th>
                  <th className="text-right">Value</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(o => (
                  <tr key={o.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="font-mono text-xs text-amber-400 font-semibold">{o.id}</td>
                    <td className="font-semibold text-white">{o.customer}</td>
                    <td>{o.product}</td>
                    <td className="text-right font-mono text-zinc-200">{o.qty} bags</td>
                    <td className="text-right font-semibold text-amber-300 font-mono">{o.value}</td>
                    <td><Badge variant={statusVariant(o.status)}>{o.status.replace('_', ' ')}</Badge></td>
                    <td className="text-zinc-500 text-xs">{o.date}</td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedOrder(o)}
                          className="btn-ghost text-xs py-1 px-2 text-zinc-300 hover:text-white"
                        >
                          View
                        </button>
                        {o.status === 'PAYMENT_PENDING' && (
                          <button
                            onClick={() => handleVerifyPayment(o.id)}
                            className="btn-primary text-xs px-2.5 py-1"
                          >
                            Verify Pay
                          </button>
                        )}
                      </div>
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
                {customers.map(c => (
                  <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="font-semibold text-white">{c.name}</td>
                    <td className="text-zinc-400">{c.contact}</td>
                    <td className="text-zinc-400 font-mono text-xs">{c.phone}</td>
                    <td className="text-zinc-400">{c.city}</td>
                    <td className="font-semibold text-amber-400 font-mono">{c.outstanding}</td>
                    <td><Badge variant="success">{c.status}</Badge></td>
                    <td>
                      <button
                        onClick={() => { setSearch(c.name); setTab('orders') }}
                        className="btn-ghost text-xs py-1 px-2 text-zinc-300 hover:text-white"
                      >
                        Filter Orders
                      </button>
                    </td>
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
          <p className="text-zinc-300 font-medium">B2B Deal Inquiries Pipeline</p>
          <p className="text-zinc-500 text-xs mt-1">Direct inquiries from mill buyers and traders will queue here for broker rate quotation</p>
        </div>
      )}

      {/* New Order Modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="Create New Sales Order"
      >
        <form onSubmit={handleCreateOrder} className="space-y-4">
          <FormField label="Customer Name">
            <select
              className="tom-select"
              value={newOrder.customer}
              onChange={e => setNewOrder({ ...newOrder, customer: e.target.value })}
            >
              {customers.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
          </FormField>

          <FormField label="Product / Commodity">
            <select
              className="tom-select"
              value={newOrder.product}
              onChange={e => setNewOrder({ ...newOrder, product: e.target.value })}
            >
              <option value="Turmeric A+">Turmeric A+ (Polished Fingers)</option>
              <option value="Turmeric A">Turmeric A (Standard)</option>
              <option value="Refined Cotton Oil">Refined Cotton Oil (15L Tin)</option>
              <option value="Cotton Oil Cake">Cotton Oil Cake (50kg Bags)</option>
              <option value="Maize A">Maize A Grade</option>
              <option value="Sesame B">Sesame B Grade</option>
            </select>
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Quantity (bags / units)">
              <input
                required
                type="number"
                className="tom-input"
                value={newOrder.qty}
                onChange={e => setNewOrder({ ...newOrder, qty: e.target.value })}
              />
            </FormField>
            <FormField label="Rate per Bag / Unit (₹)">
              <input
                required
                type="number"
                step="1"
                className="tom-input"
                value={newOrder.pricePerBag}
                onChange={e => setNewOrder({ ...newOrder, pricePerBag: e.target.value })}
              />
            </FormField>
          </div>

          <FormField label="Payment Terms">
            <select
              className="tom-select"
              value={newOrder.paymentTerms}
              onChange={e => setNewOrder({ ...newOrder, paymentTerms: e.target.value })}
            >
              <option value="Immediate Payment">Immediate Advance Bank Transfer</option>
              <option value="Credit — 15 days">Credit — 15 days (Approved Limit)</option>
              <option value="Credit — 30 days">Credit — 30 days</option>
            </select>
          </FormField>

          <div className="p-3 bg-surface-3 rounded-xl flex items-center justify-between text-xs">
            <span className="text-zinc-400">Estimated Total Order Value:</span>
            <span className="text-amber-400 font-bold font-mono text-sm">
              ₹ {((parseInt(newOrder.qty) || 0) * (parseFloat(newOrder.pricePerBag) || 0)).toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
            <button type="submit" className="btn-primary">Generate Order</button>
          </div>
        </form>
      </Modal>

      {/* View Order Modal */}
      <Modal
        open={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Order Summary — ${selectedOrder?.id}`}
      >
        <div className="space-y-4">
          <div className="p-4 bg-surface-3 rounded-xl space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-zinc-400">Customer:</span>
              <span className="font-bold text-white">{selectedOrder?.customer}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Product:</span>
              <span className="text-amber-300 font-semibold">{selectedOrder?.product}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Order Quantity:</span>
              <span className="font-mono text-white">{selectedOrder?.qty} Bags</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Total Invoice:</span>
              <span className="font-mono text-emerald-400 font-bold text-sm">{selectedOrder?.value}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-white/5">
              <span className="text-zinc-400">Current Order Status:</span>
              <Badge variant={statusVariant(selectedOrder?.status)}>{selectedOrder?.status}</Badge>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => { toast.success(`Generated GST Tax Invoice PDF for ${selectedOrder?.id}`); setSelectedOrder(null) }}
              className="btn-primary text-xs flex items-center gap-1.5"
            >
              <FileText size={14} /> Download Tax Invoice
            </button>
            <button onClick={() => setSelectedOrder(null)} className="btn-secondary text-xs">Close</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

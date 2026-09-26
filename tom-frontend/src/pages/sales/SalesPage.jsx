import { useState, useEffect } from 'react'
import { Card, CardHeader, Badge, StatusBadge, Modal, FormField } from '../../components/ui'
import { salesApi } from '../../api/endpoints'
import { Plus, Search, TrendingUp, CheckCircle, FileText, ArrowRight, Truck, UserCheck, Scale, AlertTriangle, ShieldCheck, DollarSign } from 'lucide-react'
import toast from 'react-hot-toast'

const initialOrders = [
  {
    id: 'ORD-001',
    customer: 'Kumar Traders',
    product: 'Turmeric A+',
    qty: 50,
    costPrice: 5800,
    referencePrice: 6100,
    agreedPrice: 6250,
    value: '₹3,12,500',
    rawValue: 312500,
    deliveryType: 'CUSTOMER_PICKUP',
    vehicleNo: 'TS 08 UB 4120',
    driverName: 'Rameshwar (Customer Driver)',
    loadingCost: 250, // 50 bags * ₹5/bag
    freightCost: 0,
    seniorWorkerRecorded: true,
    seniorWorkerName: 'G. Apparao',
    fieldOfficerVerified: true,
    fieldOfficerName: 'K. Ramesh',
    status: 'DISPATCHED',
    date: '26 Sep 2026'
  },
  {
    id: 'ORD-002',
    customer: 'Sri Balaji Co.',
    product: 'Maize A',
    qty: 100,
    costPrice: 500,
    referencePrice: 530,
    agreedPrice: 550,
    value: '₹55,000',
    rawValue: 55000,
    deliveryType: 'CUSTOMER_PICKUP',
    vehicleNo: 'AP 04 B 7788',
    driverName: 'Govind',
    loadingCost: 500,
    freightCost: 0,
    seniorWorkerRecorded: true,
    seniorWorkerName: 'G. Apparao',
    fieldOfficerVerified: false,
    fieldOfficerName: 'Pending FO Verification',
    status: 'LOADING',
    date: '26 Sep 2026'
  },
  {
    id: 'ORD-003',
    customer: 'Priya Exports',
    product: 'Sesame B',
    qty: 30,
    costPrice: 2600,
    referencePrice: 2800,
    agreedPrice: 2900,
    value: '₹87,000',
    rawValue: 87000,
    deliveryType: 'TOM_DELIVERY',
    vehicleNo: 'AP 21 TY 4521',
    driverName: 'Raju Naidu (TOM Fleet)',
    loadingCost: 150,
    freightCost: 1800,
    seniorWorkerRecorded: false,
    fieldOfficerVerified: false,
    status: 'PAYMENT_PENDING',
    date: '25 Sep 2026'
  },
  {
    id: 'ORD-004',
    customer: 'Ramesh Foods',
    product: 'Turmeric A',
    qty: 80,
    costPrice: 5500,
    referencePrice: 5750,
    agreedPrice: 5900,
    value: '₹4,72,000',
    rawValue: 472000,
    deliveryType: 'TOM_DELIVERY',
    vehicleNo: 'TS 09 UB 9812',
    driverName: 'K. Shiva Kumar',
    loadingCost: 400,
    freightCost: 3200,
    seniorWorkerRecorded: true,
    fieldOfficerVerified: true,
    status: 'DELIVERED',
    date: '24 Sep 2026'
  },
]

const initialCustomers = [
  { id: 1, name: 'Kumar Traders', contact: 'Suresh Kumar', phone: '+91-98765-43210', city: 'Hyderabad', outstanding: '₹3,12,500', creditLimit: '₹5,00,000', status: 'ACTIVE' },
  { id: 2, name: 'Sri Balaji Co.', contact: 'Balaji Rao', phone: '+91-87654-32109', city: 'Warangal', outstanding: '₹55,000', creditLimit: '₹2,00,000', status: 'ACTIVE' },
  { id: 3, name: 'Priya Exports', contact: 'Priya Devi', phone: '+91-76543-21098', city: 'Nizamabad', outstanding: '₹87,000', creditLimit: '₹3,00,000', status: 'ACTIVE' },
]

const initialCollections = [
  {
    id: 'COL-101',
    customer: 'Kumar Traders',
    salesPerson: 'Suresh Kumar (Sales Team)',
    expectedCash: 50000,
    cashHandedOver: 50000,
    verifiedCash: 50000,
    status: 'ADMIN_VERIFIED',
    collectedDate: '26 Sep 2026',
    verifiedBy: 'Admin'
  },
  {
    id: 'COL-102',
    customer: 'Sri Balaji Co.',
    salesPerson: 'Suresh Kumar (Sales Team)',
    expectedCash: 25000,
    cashHandedOver: 25000,
    verifiedCash: 0,
    status: 'PENDING_ADMIN_VERIFY',
    collectedDate: 'Today',
    verifiedBy: '—'
  },
]

export default function SalesPage() {
  const [tab, setTab] = useState('orders')
  const [search, setSearch] = useState('')
  const [orders, setOrders] = useState(initialOrders)
  const [customers, setCustomers] = useState(initialCustomers)
  const [collections, setCollections] = useState(initialCollections)

  // Modals
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [showLoadingModal, setShowLoadingModal] = useState(false)
  const [showReconciliationModal, setShowReconciliationModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [activePickupOrder, setActivePickupOrder] = useState(null)

  // New Order Form with Section 11.10 Pricing & Section 11.5 Delivery mode
  const [newOrder, setNewOrder] = useState({
    customer: 'Kumar Traders',
    product: 'Turmeric A+',
    qty: 50,
    costPrice: 5800,
    referencePrice: 6100,
    agreedPrice: 6250,
    deliveryType: 'CUSTOMER_PICKUP',
    customerVehicle: '',
    paymentTerms: 'Credit — 15 days'
  })

  // Collection form
  const [newCollection, setNewCollection] = useState({
    customer: 'Sri Balaji Co.',
    amount: '',
    collectedDate: 'Today'
  })

  const handleCreateOrder = (e) => {
    e.preventDefault()
    const bags = parseInt(newOrder.qty) || 0
    const price = parseFloat(newOrder.agreedPrice) || 0
    const isPickup = newOrder.deliveryType === 'CUSTOMER_PICKUP'
    const loadingCharge = bags * 5 // ₹5 per bag
    const freightCharge = isPickup ? 0 : 2500
    const total = (bags * price) + loadingCharge + freightCharge

    const created = {
      id: `ORD-00${orders.length + 1}`,
      customer: newOrder.customer,
      product: newOrder.product,
      qty: bags,
      costPrice: newOrder.costPrice,
      referencePrice: newOrder.referencePrice,
      agreedPrice: price,
      value: `₹${total.toLocaleString('en-IN')}`,
      rawValue: total,
      deliveryType: newOrder.deliveryType,
      vehicleNo: isPickup ? (newOrder.customerVehicle || 'Customer Truck') : 'AP 21 TY 4521 (TOM Fleet)',
      driverName: isPickup ? 'Customer Driver' : 'Raju Naidu',
      loadingCost: loadingCharge,
      freightCost: freightCharge,
      seniorWorkerRecorded: false,
      fieldOfficerVerified: false,
      status: 'CONFIRMED',
      date: 'Today'
    }

    setOrders([created, ...orders])
    toast.success(`B2B Order #${created.id} placed! Stock reserved in godown.`)
    setShowOrderModal(false)
  }

  // Section 11.5: Senior Worker records loading & Field Officer verifies before inventory deduction
  const handleVerifyLoading = (orderId) => {
    setOrders(orders.map(o => {
      if (o.id === orderId) {
        toast.success(`Loading Verified by Field Officer! Inventory deducted from Warehouse.`)
        return {
          ...o,
          seniorWorkerRecorded: true,
          seniorWorkerName: 'G. Apparao',
          fieldOfficerVerified: true,
          fieldOfficerName: 'K. Ramesh (Field Officer)',
          status: 'VERIFIED'
        }
      }
      return o
    }))
    setActivePickupOrder(null)
  }

  // Section 11.8: Admin Verifies Cash Collection
  const handleAdminVerifyCash = (colId) => {
    setCollections(collections.map(c => {
      if (c.id === colId) {
        toast.success(`Admin verified cash collection of ₹${c.cashHandedOver.toLocaleString('en-IN')}! Official financial transaction posted.`)
        return {
          ...c,
          verifiedCash: c.cashHandedOver,
          status: 'ADMIN_VERIFIED',
          verifiedBy: 'Admin'
        }
      }
      return c
    }))
  }

  const filtered = orders.filter(o =>
    o.customer.toLowerCase().includes(search.toLowerCase()) ||
    o.id.toLowerCase().includes(search.toLowerCase()) ||
    o.product.toLowerCase().includes(search.toLowerCase())
  )

  const statusVariant = s => ({
    CONFIRMED: 'info',
    LOADING: 'warning',
    VERIFIED: 'success',
    DISPATCHED: 'success',
    DELIVERED: 'muted',
    PAYMENT_PENDING: 'warning'
  }[s] ?? 'muted')

  const totalOutstanding = customers.reduce((sum, c) => sum + (parseFloat(c.outstanding.replace(/[^0-9]/g, '')) || 0), 0)

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="page-title text-2xl font-bold tracking-tight text-white font-display">B2B Sales Operations</h1>
          <p className="page-sub text-zinc-400 text-sm mt-1">
            Section 11: Customer Pickups vs Fleet Delivery, Physical Loading Verification & Cash Reconciliation
          </p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary" onClick={() => setShowReconciliationModal(true)}>
            <DollarSign size={15} /> Cash Handover Log
          </button>
          <button className="btn-primary" onClick={() => setShowOrderModal(true)}>
            <Plus size={16} /> New B2B Order
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Sales Orders', value: orders.filter(o => o.status !== 'DELIVERED').length, icon: '📋', color: 'text-blue-400 bg-blue-500/10' },
          { label: 'Customer Pickups Today', value: orders.filter(o => o.deliveryType === 'CUSTOMER_PICKUP').length, icon: '🚚', color: 'text-amber-400 bg-amber-500/10' },
          { label: 'Pending FO Verifications', value: orders.filter(o => o.status === 'LOADING' && !o.fieldOfficerVerified).length, icon: '🔍', color: 'text-red-400 bg-red-500/10' },
          { label: 'Customer Receivables', value: `₹${(totalOutstanding / 100000).toFixed(1)} L`, icon: '💰', color: 'text-emerald-400 bg-emerald-500/10' },
        ].map(s => (
          <div key={s.label} className="tom-card p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center text-xl flex-shrink-0`}>{s.icon}</div>
            <div>
              <p className="text-xl font-extrabold font-display text-white">{s.value}</p>
              <p className="text-xs text-zinc-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface-2 p-1 rounded-xl w-fit">
        {['orders', 'customers', 'reconciliation'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${tab === t ? 'bg-surface-3 text-white' : 'text-zinc-500 hover:text-white'}`}>
            {t === 'orders' ? '1. Orders & Pickup Dispatch' : t === 'customers' ? '2. Customer Accounts & Credit Limits' : '3. Sales Cash Reconciliation (Section 11.9)'}
          </button>
        ))}
      </div>

      {/* Orders Tab */}
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
                  <th className="text-right">Agreed Rate</th>
                  <th>Delivery Mode (Section 11.5)</th>
                  <th>Loading & FO Verification</th>
                  <th>Status</th>
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
                    <td className="text-right font-semibold text-amber-300 font-mono">₹{o.agreedPrice}/bag</td>
                    <td>
                      <Badge variant={o.deliveryType === 'CUSTOMER_PICKUP' ? 'warning' : 'info'}>
                        {o.deliveryType === 'CUSTOMER_PICKUP' ? 'Customer Pickup' : 'TOM Fleet Delivery'}
                      </Badge>
                      <div className="text-[10px] text-zinc-500 mt-0.5">{o.vehicleNo}</div>
                    </td>
                    <td>
                      {o.fieldOfficerVerified ? (
                        <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle size={13} /> Verified by FO
                        </span>
                      ) : (
                        <span className="text-xs text-amber-400 flex items-center gap-1 font-mono">
                          <Scale size={13} /> Senior Worker Loaded
                        </span>
                      )}
                    </td>
                    <td><Badge variant={statusVariant(o.status)}>{o.status.replace('_', ' ')}</Badge></td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {!o.fieldOfficerVerified && o.status === 'LOADING' && (
                          <button
                            onClick={() => handleVerifyLoading(o.id)}
                            className="btn-primary text-xs px-2.5 py-1"
                            title="Field Officer verifies physical loading and authorizes inventory deduction"
                          >
                            Verify & Deduct Stock
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedOrder(o)}
                          className="btn-ghost text-xs py-1 px-2 text-zinc-300 hover:text-white"
                        >
                          Invoice Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Customers Tab */}
      {tab === 'customers' && (
        <Card>
          <div className="overflow-x-auto">
            <table className="tom-table">
              <thead>
                <tr>
                  <th>Client / Entity Name</th>
                  <th>Contact Person</th>
                  <th>Phone Number</th>
                  <th>City</th>
                  <th className="text-right">Approved Credit Limit</th>
                  <th className="text-right">Current Outstanding</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {customers.map(c => (
                  <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="font-semibold text-white">{c.name}</td>
                    <td className="text-zinc-400">{c.contact}</td>
                    <td className="text-zinc-400 font-mono text-xs">{c.phone}</td>
                    <td className="text-zinc-400">{c.city}</td>
                    <td className="text-right font-mono text-emerald-400">{c.creditLimit}</td>
                    <td className="text-right font-semibold text-amber-400 font-mono">{c.outstanding}</td>
                    <td><Badge variant="success">{c.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Sales Cash Reconciliation Tab (Section 11.9) */}
      {tab === 'reconciliation' && (
        <Card>
          <CardHeader
            title="Sales Team Cash Collection & Admin Reconciliation"
            subtitle="Section 11.8 & 11.9: Unverified collections do NOT reduce customer ledger. Expected Cash vs Cash Handed Over vs Verified Cash must match."
          />
          <div className="overflow-x-auto">
            <table className="tom-table">
              <thead>
                <tr>
                  <th>Collection ID</th>
                  <th>Customer</th>
                  <th>Collected By</th>
                  <th className="text-right">Expected Cash</th>
                  <th className="text-right">Cash Handed Over</th>
                  <th className="text-right">Admin Verified Cash</th>
                  <th>Status</th>
                  <th className="text-right">Admin Action</th>
                </tr>
              </thead>
              <tbody>
                {collections.map(col => (
                  <tr key={col.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="font-mono text-xs text-amber-400 font-semibold">{col.id}</td>
                    <td className="font-semibold text-white">{col.customer}</td>
                    <td className="text-zinc-300 text-xs">{col.salesPerson}</td>
                    <td className="text-right font-mono text-zinc-300">₹{col.expectedCash.toLocaleString('en-IN')}</td>
                    <td className="text-right font-mono text-amber-400 font-bold">₹{col.cashHandedOver.toLocaleString('en-IN')}</td>
                    <td className="text-right font-mono text-emerald-400 font-bold">
                      {col.verifiedCash > 0 ? `₹${col.verifiedCash.toLocaleString('en-IN')}` : '—'}
                    </td>
                    <td>
                      <Badge variant={col.status === 'ADMIN_VERIFIED' ? 'success' : 'warning'}>
                        {col.status.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="text-right">
                      {col.status !== 'ADMIN_VERIFIED' ? (
                        <button
                          onClick={() => handleAdminVerifyCash(col.id)}
                          className="btn-primary text-xs px-2.5 py-1"
                        >
                          Verify & Settle Ledger
                        </button>
                      ) : (
                        <span className="text-xs text-emerald-400 font-semibold">Ledger Settled</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* New Order Modal with 3-tier pricing (Section 11.10) */}
      <Modal open={showOrderModal} onClose={() => setShowOrderModal(false)} title="Create New B2B Sales Order">
        <form onSubmit={handleCreateOrder} className="space-y-4">
          <FormField label="Customer / Wholesale Client">
            <select
              className="tom-select"
              value={newOrder.customer}
              onChange={e => setNewOrder({ ...newOrder, customer: e.target.value })}
            >
              {customers.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
          </FormField>

          <FormField label="Product Commodity">
            <select
              className="tom-select"
              value={newOrder.product}
              onChange={e => setNewOrder({ ...newOrder, product: e.target.value })}
            >
              <option value="Turmeric A+">Turmeric A+ (Polished Export Quality)</option>
              <option value="Turmeric A">Turmeric A (Standard)</option>
              <option value="Cotton Oil Cake">Cotton Oil Cake (50kg High-Protein Bags)</option>
              <option value="Refined Cotton Oil">Refined Cotton Oil (15L Tin)</option>
              <option value="Maize A">Maize A Grade</option>
            </select>
          </FormField>

          {/* Section 11.10: 3-tier Pricing Architecture */}
          <div className="p-3 bg-surface-3 rounded-xl border border-white/5 space-y-2">
            <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Pricing Architecture (Section 11.10)</p>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="p-2 bg-surface-2 rounded-lg text-center">
                <span className="text-zinc-500 block text-[10px]">Product Cost</span>
                <span className="font-mono text-white font-bold">₹{newOrder.costPrice}</span>
              </div>
              <div className="p-2 bg-surface-2 rounded-lg text-center">
                <span className="text-zinc-500 block text-[10px]">Reference Rate</span>
                <span className="font-mono text-zinc-300 font-bold">₹{newOrder.referencePrice}</span>
              </div>
              <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-center">
                <span className="text-amber-400 block text-[10px]">Customer Agreed</span>
                <span className="font-mono text-amber-300 font-extrabold text-sm">₹{newOrder.agreedPrice}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Order Quantity (Bags)">
              <input
                required
                type="number"
                className="tom-input font-mono"
                value={newOrder.qty}
                onChange={e => setNewOrder({ ...newOrder, qty: e.target.value })}
              />
            </FormField>
            <FormField label="Delivery Mode (Section 11.5)">
              <select
                className="tom-select"
                value={newOrder.deliveryType}
                onChange={e => setNewOrder({ ...newOrder, deliveryType: e.target.value })}
              >
                <option value="CUSTOMER_PICKUP">Customer Pickup (Own Vehicle)</option>
                <option value="TOM_DELIVERY">TOM Fleet Delivery</option>
              </select>
            </FormField>
          </div>

          {newOrder.deliveryType === 'CUSTOMER_PICKUP' ? (
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs text-amber-300">
              🚚 <strong>Customer Pickup Policy (Section 11.5):</strong> Customer brings vehicle. Zero TOM delivery charge. Loading cost (₹5/bag) applies. Field Officer will verify physical loading prior to inventory deduction.
            </div>
          ) : (
            <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs text-blue-300">
              🚛 <strong>TOM Delivery:</strong> Handled by Logistics Fleet. Standard freight charges apply.
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setShowOrderModal(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Reserve Stock & Confirm</button>
          </div>
        </form>
      </Modal>

      {/* Invoice Details Modal */}
      <Modal open={!!selectedOrder} onClose={() => setSelectedOrder(null)} title={`Tax Invoice Breakdown — ${selectedOrder?.id}`}>
        <div className="space-y-4">
          <div className="p-4 bg-surface-3 rounded-xl space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-zinc-400">Customer:</span>
              <span className="font-bold text-white">{selectedOrder?.customer}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Product / Commodity:</span>
              <span className="text-amber-300 font-semibold">{selectedOrder?.product}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Quantity:</span>
              <span className="font-mono text-white">{selectedOrder?.qty} Bags ({(selectedOrder?.qty || 0) * 50} kg)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Base Commodity Amount:</span>
              <span className="font-mono text-white font-semibold">₹ {((selectedOrder?.qty || 0) * (selectedOrder?.agreedPrice || 0)).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Loading Charge (₹5/bag):</span>
              <span className="font-mono text-zinc-300">₹ {selectedOrder?.loadingCost}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Freight Delivery Charge:</span>
              <span className="font-mono text-zinc-300">₹ {selectedOrder?.freightCost}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-white/5 font-bold text-sm">
              <span className="text-amber-400">Net Invoice Total:</span>
              <span className="font-mono text-emerald-400">{selectedOrder?.value}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-white/5">
              <span className="text-zinc-400">Loading Verification:</span>
              <span className="text-emerald-400 font-semibold">{selectedOrder?.fieldOfficerName}</span>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => { toast.success(`Generated official GST Invoice for ${selectedOrder?.id}`); setSelectedOrder(null) }}
              className="btn-primary text-xs flex items-center gap-1.5"
            >
              <FileText size={14} /> Download GST Tax Invoice
            </button>
            <button onClick={() => setSelectedOrder(null)} className="btn-secondary text-xs">Close</button>
          </div>
        </div>
      </Modal>

      {/* Cash Reconciliation Handover Modal */}
      <Modal open={showReconciliationModal} onClose={() => setShowReconciliationModal(false)} title="Record Sales Cash Handover to Admin">
        <form onSubmit={(e) => {
          e.preventDefault()
          const amt = parseFloat(newCollection.amount) || 0
          const created = {
            id: `COL-10${collections.length + 1}`,
            customer: newCollection.customer,
            salesPerson: 'Suresh Kumar (Sales)',
            expectedCash: amt,
            cashHandedOver: amt,
            verifiedCash: 0,
            status: 'PENDING_ADMIN_VERIFY',
            collectedDate: 'Today',
            verifiedBy: '—'
          }
          setCollections([created, ...collections])
          toast.success(`Handed over ₹${amt.toLocaleString('en-IN')} cash to Admin! Awaiting verification.`)
          setShowReconciliationModal(false)
        }} className="space-y-4">
          <FormField label="Paying Customer">
            <select
              className="tom-select"
              value={newCollection.customer}
              onChange={e => setNewCollection({ ...newCollection, customer: e.target.value })}
            >
              {customers.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
          </FormField>
          <FormField label="Cash Collected from Customer (₹)">
            <input
              required
              type="number"
              className="tom-input font-mono"
              placeholder="e.g. 25000"
              value={newCollection.amount}
              onChange={e => setNewCollection({ ...newCollection, amount: e.target.value })}
            />
          </FormField>
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300">
            ⚠️ <strong>Admin Verification Rule (Section 11.8):</strong> The customer outstanding ledger will not reduce until Admin physically verifies the handed-over currency.
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setShowReconciliationModal(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Hand Over Cash to Admin</button>
          </div>
        </form>
      </Modal>

    </div>
  )
}

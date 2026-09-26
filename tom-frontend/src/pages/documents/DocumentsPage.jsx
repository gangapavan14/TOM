import { useState } from 'react'
import { Card, CardHeader, Badge, StatusBadge, Modal, FormField, EmptyState } from '../../components/ui'
import {
  FileText, Search, Filter, Upload, Download, Eye, CheckCircle2,
  AlertTriangle, Calendar, Building2, User, Truck, ShieldCheck, Tag
} from 'lucide-react'
import toast from 'react-hot-toast'

const initialDocuments = [
  {
    id: 'DOC-2026-001',
    title: 'Heritage Foods — Bilateral Credit Agreement (Signed)',
    type: 'CREDIT_AGREEMENT',
    entityType: 'CUSTOMER',
    entityId: 'CUST-001 (Heritage Foods)',
    fileSize: '2.4 MB',
    fileType: 'PDF',
    uploadedBy: 'System Administrator',
    uploadDate: '2026-09-24',
    verified: true,
    tags: ['Credit Sale', 'Stamp Duty Paid', 'Section 11.11'],
    notes: 'Approved credit limit ₹50,00,000 with 15-day settlement cycle signed by Director Srinivas.'
  },
  {
    id: 'DOC-2026-002',
    title: 'Tax Invoice INV-2026-0089 — Kaveri Feeds (Cotton Cake)',
    type: 'INVOICE',
    entityType: 'SALES_ORDER',
    entityId: 'ORD-2026-104 (Kaveri Feeds)',
    fileSize: '480 KB',
    fileType: 'PDF',
    uploadedBy: 'K. Lakshmi (Office)',
    uploadDate: '2026-09-26',
    verified: true,
    tags: ['GST Tax Invoice', 'B2B Sales', 'E-Way Bill Attached'],
    notes: 'Generated after Field Officer authorized loading verification of 200 bags (10,000 kg).'
  },
  {
    id: 'DOC-2026-003',
    title: 'Signed Loading & Gate Pass — AP 21 TY 4521 Customer Pickup',
    type: 'DELIVERY_DOCUMENT',
    entityType: 'CUSTOMER_PICKUP',
    entityId: 'ORD-2026-104 / AP 21 TY 4521',
    fileSize: '1.1 MB',
    fileType: 'PDF',
    uploadedBy: 'N. Venkata Rao (Senior Worker)',
    uploadDate: '2026-09-26',
    verified: true,
    tags: ['Physical Loading Record', 'Senior Worker Verified', 'Field Officer Sign'],
    notes: 'Loaded 200 bags of standard cotton cake. Signed by driver Raju Naidu & Field Officer Ramesh.'
  },
  {
    id: 'DOC-2026-004',
    title: 'Bank Transfer NeFT Advice — ₹1,80,000 to Sri Rama Agros',
    type: 'PAYMENT_PROOF',
    entityType: 'SUPPLIER_PAYMENT',
    entityId: 'SUP-001 (Sri Rama Agros)',
    fileSize: '320 KB',
    fileType: 'IMAGE',
    uploadedBy: 'System Administrator',
    uploadDate: '2026-09-26',
    verified: true,
    tags: ['Admin Disbursed', 'Early Discount 2% Applied', 'Section 13.6'],
    notes: 'Bank reference UTR: HDFC990182664. Net payable after ₹3,600 prompt settlement rebate.'
  },
  {
    id: 'DOC-2026-005',
    title: 'Dharmakanta Weighbridge Gross & Tare Slip WB-260926-001',
    type: 'RECEIPT',
    entityType: 'PROCUREMENT_RECEIPT',
    entityId: 'DEAL-2026-001 (Sri Rama Agros)',
    fileSize: '890 KB',
    fileType: 'PDF',
    uploadedBy: 'K. Ramesh (Field Officer)',
    uploadDate: '2026-09-26',
    verified: true,
    tags: ['Weighbridge Slip', '50kg Bag Standardized', 'Net: 16,300 kg'],
    notes: 'Gross: 24,500 kg, Tare: 8,200 kg, Net: 16,300 kg (326 bags packed).'
  },
  {
    id: 'DOC-2026-006',
    title: 'Certified Lab Quality Analysis — Turmeric Batch TUR-260926-001',
    type: 'QUALITY_CERTIFICATE',
    entityType: 'BATCH',
    entityId: 'TUR-260926-001 (Raw Cotton Seed)',
    fileSize: '1.6 MB',
    fileType: 'PDF',
    uploadedBy: 'K. Ramesh (Field Officer)',
    uploadDate: '2026-09-26',
    verified: true,
    tags: ['Grade A+', 'Moisture 8.4%', 'FSSAI Parameter Clear'],
    notes: 'Moisture 8.4%, FFA 1.2%, Oil content 18.6%. Certified for high-recovery expeller processing.'
  },
  {
    id: 'DOC-2026-007',
    title: 'Physical Cash Handover Slip — Suresh Kumar (Sales) to Admin',
    type: 'PAYMENT_PROOF',
    entityType: 'SALES_COLLECTION',
    entityId: 'COL-2026-091 (Tirupati Refineries)',
    fileSize: '650 KB',
    fileType: 'PDF',
    uploadedBy: 'Suresh Kumar (Sales)',
    uploadDate: '2026-09-26',
    verified: false,
    tags: ['Section 11.9 Reconciliation', 'Pending Admin Verification', '₹45,000 Cash'],
    notes: 'Collected cash ₹45,000 from Tirupati Refineries. Handed over physical cash envelope to Admin for count verification.'
  }
]

const DOC_TYPES = [
  { value: 'ALL', label: 'All Documents' },
  { value: 'INVOICE', label: 'Invoices' },
  { value: 'CREDIT_AGREEMENT', label: 'Credit Agreements' },
  { value: 'DELIVERY_DOCUMENT', label: 'Delivery / Loading Slips' },
  { value: 'PAYMENT_PROOF', label: 'Payment Receipts & Proofs' },
  { value: 'QUALITY_CERTIFICATE', label: 'Lab & Quality Certs' },
  { value: 'RECEIPT', label: 'Weighbridge Receipts' },
]

export default function DocumentsPage() {
  const [documents, setDocuments] = useState(initialDocuments)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('ALL')
  const [selectedDoc, setSelectedDoc] = useState(null)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadForm, setUploadForm] = useState({
    title: '',
    type: 'INVOICE',
    entityType: 'CUSTOMER',
    entityId: '',
    tags: '',
    notes: ''
  })

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.entityId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === 'ALL' || doc.type === selectedType
    return matchesSearch && matchesType
  })

  const handleUploadSubmit = (e) => {
    e.preventDefault()
    if (!uploadForm.title || !uploadForm.entityId) {
      toast.error('Please specify document title and linked business entity')
      return
    }

    const newDoc = {
      id: `DOC-2026-00${documents.length + 1}`,
      title: uploadForm.title,
      type: uploadForm.type,
      entityType: uploadForm.entityType,
      entityId: uploadForm.entityId,
      fileSize: '1.2 MB',
      fileType: 'PDF',
      uploadedBy: 'Active User',
      uploadDate: new Date().toISOString().split('T')[0],
      verified: true,
      tags: uploadForm.tags ? uploadForm.tags.split(',').map(t => t.trim()) : ['Manual Upload'],
      notes: uploadForm.notes || 'Uploaded via Central Document Service.'
    }

    setDocuments([newDoc, ...documents])
    setShowUploadModal(false)
    setUploadForm({ title: '', type: 'INVOICE', entityType: 'CUSTOMER', entityId: '', tags: '', notes: '' })
    toast.success(`Document ${newDoc.id} linked to ${newDoc.entityId} successfully!`)
  }

  const handleVerify = (id) => {
    setDocuments(documents.map(d => d.id === id ? { ...d, verified: true } : d))
    toast.success(`Document #${id} marked as officially verified`)
    if (selectedDoc && selectedDoc.id === id) {
      setSelectedDoc(prev => ({ ...prev, verified: true }))
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white font-display">
              Central Document Repository
            </h1>
            <Badge variant="brand">Section 15</Badge>
          </div>
          <p className="text-zinc-400 text-sm mt-1">
            Official business records, signed credit deeds, delivery gate passes, and audit-linked payment proofs.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="btn-primary inline-flex items-center gap-2 self-start sm:self-auto"
        >
          <Upload size={16} />
          Upload & Link Document
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-surface-1 border border-white/[0.07]">
          <p className="text-xs text-zinc-400">Total Archival Records</p>
          <p className="text-xl font-bold text-white mt-1">{documents.length}</p>
          <p className="text-[11px] text-zinc-500 mt-0.5">Permanent immutable storage</p>
        </div>
        <div className="p-4 rounded-xl bg-surface-1 border border-white/[0.07]">
          <p className="text-xs text-zinc-400">Verified Legal Deeds</p>
          <p className="text-xl font-bold text-emerald-400 mt-1">
            {documents.filter(d => d.verified).length}
          </p>
          <p className="text-[11px] text-emerald-500/80 mt-0.5">Signed & stamp certified</p>
        </div>
        <div className="p-4 rounded-xl bg-surface-1 border border-white/[0.07]">
          <p className="text-xs text-zinc-400">Pending Verification</p>
          <p className="text-xl font-bold text-amber-400 mt-1">
            {documents.filter(d => !d.verified).length}
          </p>
          <p className="text-[11px] text-amber-500/80 mt-0.5">Requires Admin signoff</p>
        </div>
        <div className="p-4 rounded-xl bg-surface-1 border border-white/[0.07]">
          <p className="text-xs text-zinc-400">Auditable Attachment Types</p>
          <p className="text-xl font-bold text-indigo-400 mt-1">6 Categories</p>
          <p className="text-[11px] text-indigo-400/80 mt-0.5">Invoices, Deeds, Slips, Lab</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by title, document ID, customer/supplier entity..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10 w-full"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <Filter size={15} className="text-zinc-500 ml-1 flex-shrink-0" />
          {DOC_TYPES.map(type => (
            <button
              key={type.value}
              onClick={() => setSelectedType(type.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedType === type.value
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-surface-2 text-zinc-400 hover:text-white border border-white/[0.05]'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Table */}
      <div className="rounded-xl border border-white/[0.08] bg-surface-1 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-2/60 text-zinc-400 text-xs uppercase border-b border-white/[0.08]">
              <tr>
                <th className="px-5 py-3.5 font-semibold">Document Title / ID</th>
                <th className="px-5 py-3.5 font-semibold">Category</th>
                <th className="px-5 py-3.5 font-semibold">Linked Business Entity</th>
                <th className="px-5 py-3.5 font-semibold">Uploaded By</th>
                <th className="px-5 py-3.5 font-semibold">Status</th>
                <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05] text-zinc-300">
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12">
                    <EmptyState
                      icon={FileText}
                      title="No matching documents found"
                      description="Try adjusting your filter or search criteria."
                    />
                  </td>
                </tr>
              ) : (
                filteredDocs.map(doc => (
                  <tr key={doc.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-surface-3 border border-white/[0.08] text-brand-400 mt-0.5">
                          <FileText size={18} />
                        </div>
                        <div>
                          <p className="font-medium text-white hover:text-brand-300 cursor-pointer"
                             onClick={() => setSelectedDoc(doc)}>
                            {doc.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-mono text-zinc-500">{doc.id}</span>
                            <span className="text-[11px] text-zinc-500">• {doc.fileSize} ({doc.fileType})</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant="outline" className="font-medium">
                        {doc.type.replace(/_/g, ' ')}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Building2 size={14} className="text-zinc-500 flex-shrink-0" />
                        <span className="text-xs font-medium text-zinc-200">{doc.entityId}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs text-zinc-400">
                      <div>{doc.uploadedBy}</div>
                      <div className="text-zinc-600 text-[11px]">{doc.uploadDate}</div>
                    </td>
                    <td className="px-5 py-4">
                      {doc.verified ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                          <CheckCircle2 size={12} />
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20">
                          <AlertTriangle size={12} />
                          Pending Admin Check
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedDoc(doc)}
                          className="p-1.5 rounded-lg bg-surface-2 hover:bg-white/[0.08] text-zinc-400 hover:text-white transition-colors"
                          title="Preview document details"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => toast.success(`Downloading ${doc.id}...`)}
                          className="p-1.5 rounded-lg bg-surface-2 hover:bg-white/[0.08] text-zinc-400 hover:text-white transition-colors"
                          title="Download archival copy"
                        >
                          <Download size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Document Detail / Preview Modal */}
      {selectedDoc && (
        <Modal
          open={!!selectedDoc}
          onClose={() => setSelectedDoc(null)}
          title={`Document Details — ${selectedDoc.id}`}
        >
          <div className="space-y-5">
            <div className="p-4 rounded-xl bg-surface-2 border border-white/[0.06] space-y-2">
              <h3 className="text-base font-semibold text-white">{selectedDoc.title}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">{selectedDoc.notes}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-lg bg-surface-2/60 border border-white/[0.04]">
                <p className="text-zinc-500 uppercase tracking-wider text-[10px] font-semibold">Linked Entity</p>
                <p className="font-semibold text-white mt-1">{selectedDoc.entityId}</p>
                <p className="text-zinc-500 text-[11px] mt-0.5">Type: {selectedDoc.entityType}</p>
              </div>
              <div className="p-3 rounded-lg bg-surface-2/60 border border-white/[0.04]">
                <p className="text-zinc-500 uppercase tracking-wider text-[10px] font-semibold">Verification State</p>
                <p className={`font-semibold mt-1 ${selectedDoc.verified ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {selectedDoc.verified ? 'Legally Signed & Verified' : 'Pending Admin Verification'}
                </p>
                <p className="text-zinc-500 text-[11px] mt-0.5">By {selectedDoc.uploadedBy}</p>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-zinc-400 mb-2">Audit & Compliance Tags</p>
              <div className="flex flex-wrap gap-2">
                {selectedDoc.tags.map((tag, i) => (
                  <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-brand-500/10 text-brand-300 border border-brand-500/20">
                    <Tag size={10} />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-brand-400" />
                <span className="text-zinc-300 font-mono">{selectedDoc.id}.pdf ({selectedDoc.fileSize})</span>
              </div>
              <button
                onClick={() => toast.success(`Simulating download of ${selectedDoc.id}...`)}
                className="btn-secondary py-1 px-3 text-xs"
              >
                Download PDF
              </button>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/[0.08]">
              {!selectedDoc.verified && (
                <button
                  type="button"
                  onClick={() => handleVerify(selectedDoc.id)}
                  className="btn-primary bg-emerald-600 hover:bg-emerald-500 text-xs py-2 px-3 inline-flex items-center gap-1.5"
                >
                  <CheckCircle2 size={14} />
                  Authorize & Verify (Admin Authority)
                </button>
              )}
              <button
                type="button"
                onClick={() => setSelectedDoc(null)}
                className="btn-secondary text-xs ml-auto"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Upload Document Modal */}
      {showUploadModal && (
        <Modal
          open={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          title="Upload & Link Document to Business Entity"
        >
          <form onSubmit={handleUploadSubmit} className="space-y-4">
            <FormField label="Document Title" required>
              <input
                type="text"
                required
                placeholder="e.g. Kaveri Feeds — Signed Credit Deed 2026"
                value={uploadForm.title}
                onChange={e => setUploadForm({ ...uploadForm, title: e.target.value })}
                className="input-field w-full"
              />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Document Category" required>
                <select
                  value={uploadForm.type}
                  onChange={e => setUploadForm({ ...uploadForm, type: e.target.value })}
                  className="input-field w-full"
                >
                  <option value="INVOICE">Tax Invoice</option>
                  <option value="CREDIT_AGREEMENT">Credit Agreement</option>
                  <option value="DELIVERY_DOCUMENT">Delivery / Loading Slip</option>
                  <option value="PAYMENT_PROOF">Payment Proof / UTR Advice</option>
                  <option value="QUALITY_CERTIFICATE">Quality Lab Certificate</option>
                  <option value="RECEIPT">Weighbridge Receipt</option>
                </select>
              </FormField>

              <FormField label="Entity Type" required>
                <select
                  value={uploadForm.entityType}
                  onChange={e => setUploadForm({ ...uploadForm, entityType: e.target.value })}
                  className="input-field w-full"
                >
                  <option value="CUSTOMER">Customer Account</option>
                  <option value="SUPPLIER">Supplier / Farmer</option>
                  <option value="SALES_ORDER">Sales Order</option>
                  <option value="PROCUREMENT_DEAL">Procurement Deal</option>
                  <option value="BATCH">Inventory Batch</option>
                  <option value="CUSTOMER_PICKUP">Customer Pickup</option>
                </select>
              </FormField>
            </div>

            <FormField label="Linked Entity Identifier" required>
              <input
                type="text"
                required
                placeholder="e.g. CUST-001 or ORD-2026-104 or BATCH-TUR-01"
                value={uploadForm.entityId}
                onChange={e => setUploadForm({ ...uploadForm, entityId: e.target.value })}
                className="input-field w-full"
              />
            </FormField>

            <FormField label="Compliance Tags (Comma-separated)">
              <input
                type="text"
                placeholder="e.g. Signed Deed, GST 18%, Weighbridge Verified"
                value={uploadForm.tags}
                onChange={e => setUploadForm({ ...uploadForm, tags: e.target.value })}
                className="input-field w-full"
              />
            </FormField>

            <FormField label="Document Notes / Summary">
              <textarea
                rows={2}
                placeholder="Enter description or transaction reference..."
                value={uploadForm.notes}
                onChange={e => setUploadForm({ ...uploadForm, notes: e.target.value })}
                className="input-field w-full resize-none text-xs"
              />
            </FormField>

            <div className="p-3 rounded-lg border border-dashed border-zinc-700 bg-surface-2 text-center text-xs text-zinc-400 cursor-pointer hover:border-brand-500 transition-colors">
              <Upload size={20} className="mx-auto text-zinc-500 mb-1" />
              <p className="font-medium text-white">Choose file or drag and drop</p>
              <p className="text-[11px] text-zinc-500 mt-0.5">PDF, PNG, JPG up to 15MB</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                Upload & Store
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

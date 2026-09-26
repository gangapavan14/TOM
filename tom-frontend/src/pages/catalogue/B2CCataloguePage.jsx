import { useState } from 'react'
import { Card, Badge, Modal, FormField } from '../../components/ui'
import { ShoppingBag, Star, ShieldCheck, Phone, Mail, Check, Info, ArrowRight, Sparkles, Filter } from 'lucide-react'
import toast from 'react-hot-toast'

const products = [
  {
    id: 'PRD-01',
    name: 'Tirumala Cold-Pressed Cottonseed Oil',
    tagline: 'Traditional expeller-pressed, zero chemical solvents',
    category: 'Cooking Oils',
    rating: 4.9,
    reviews: 142,
    image: '🌿',
    packs: [
      { size: '1 Litre Pouch', price: 145, mrp: 165 },
      { size: '5 Litre Jar', price: 690, mrp: 790 },
      { size: '15 Litre Commercial Tin', price: 1980, mrp: 2250 },
    ],
    fssai: '10123000000456',
    features: ['High smoke point (232°C)', 'Natural Vitamin E antioxidants', 'Zero trans-fats'],
    specs: {
      freeFattyAcids: '< 0.15%',
      moisture: '< 0.05%',
      peroxideValue: '0.8 meq/kg',
      process: 'Double expeller pressing + filter press (No chemical bleaching)'
    }
  },
  {
    id: 'PRD-02',
    name: 'Tirumala Pure Refined Cottonseed Oil',
    tagline: 'Light, odor-free, ideal for commercial deep frying & snacks',
    category: 'Commercial Oils',
    rating: 4.8,
    reviews: 98,
    image: '🛢️',
    packs: [
      { size: '15 Litre Square Tin', price: 1890, mrp: 2150 },
      { size: '15 Kg Commercial Pack', price: 1940, mrp: 2200 },
    ],
    fssai: '10123000000456',
    features: ['Extended fry life', 'Non-sticky texture', 'Absorbs 20% less oil'],
    specs: {
      freeFattyAcids: '< 0.08%',
      moisture: '< 0.02%',
      smokePoint: '235°C',
      process: 'Centrifugal de-gumming + physical refining'
    }
  },
  {
    id: 'PRD-03',
    name: 'Tirumala Expeller Sunflower Oil',
    tagline: 'Golden clear, cold-filtered sunflower seed oil',
    category: 'Cooking Oils',
    rating: 4.9,
    reviews: 76,
    image: '🌻',
    packs: [
      { size: '1 Litre Pouch', price: 155, mrp: 175 },
      { size: '5 Litre Canister', price: 740, mrp: 840 },
      { size: '15 Litre Food-Grade Tin', price: 2150, mrp: 2450 },
    ],
    fssai: '10123000000456',
    features: ['Rich in Omega-6 Linoleic acid', 'Heart-healthy Phytosterols', 'Crystal clear clarity'],
    specs: {
      freeFattyAcids: '< 0.12%',
      moisture: '< 0.04%',
      dewaxed: 'Winterized at 5°C',
      process: 'Screw press + multi-stage cold polish'
    }
  },
  {
    id: 'PRD-04',
    name: 'Tirumala High-Protein Cotton Oil Cake',
    tagline: 'Superior cattle & dairy feed with 22%+ bypass protein',
    category: 'Animal Feed / By-products',
    rating: 5.0,
    reviews: 215,
    image: '🌾',
    packs: [
      { size: '50 Kg Heavy Jute Bag', price: 1550, mrp: 1700 },
      { size: '1 Metric Ton (20 Bags)', price: 30500, mrp: 33000 },
    ],
    fssai: 'Commercial Feed Standard',
    features: ['High milk fat content yield', '22-24% Crude Protein', 'Low moisture (< 8%)'],
    specs: {
      protein: '23.4%',
      residualOil: '6.5 - 7.5%',
      fibre: '21.0%',
      sandSilica: '< 1.5%'
    }
  },
  {
    id: 'PRD-05',
    name: 'Tirumala Nizamabad Turmeric Fingers & Powder',
    tagline: 'High curcumin (4.2%+), sun-dried Telangana turmeric',
    category: 'Spices & Agri Produce',
    rating: 4.9,
    reviews: 84,
    image: '✨',
    packs: [
      { size: '500g Moisture-Lock Pouch', price: 130, mrp: 150 },
      { size: '1 Kg Vacuum Pack', price: 250, mrp: 290 },
      { size: '50 Kg Wholesale Raw Finger Bag', price: 6250, mrp: 7200 },
    ],
    fssai: '10123000000456',
    features: ['Lab-verified Curcumin 4.2%', 'No artificial lead chromate', 'Sun-cured & polished'],
    specs: {
      curcumin: '4.25%',
      moisture: '8.2%',
      ashInsoluble: '< 1.0%',
      adulteration: '0.00% Pure'
    }
  },
  {
    id: 'PRD-06',
    name: 'Tirumala Cold-Pressed Til / Sesame Oil',
    tagline: 'Wood-churned aroma, unadulterated cold extraction',
    category: 'Cooking Oils',
    rating: 4.8,
    reviews: 52,
    image: '🌱',
    packs: [
      { size: '1 Litre Glass Bottle', price: 320, mrp: 360 },
      { size: '5 Litre Jar', price: 1520, mrp: 1750 },
    ],
    fssai: '10123000000456',
    features: ['Traditional cold pressed', 'Natural sesamol antioxidants', 'Ayurvedic grade'],
    specs: {
      freeFattyAcids: '< 0.18%',
      moisture: '< 0.05%',
      extraction: 'Expeller cold temperature (< 48°C)'
    }
  }
]

export default function B2CCataloguePage() {
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [enquiryModal, setEnquiryModal] = useState(false)
  const [enquiryForm, setEnquiryForm] = useState({
    name: '',
    phone: '',
    city: '',
    product: '',
    quantity: '10 tins / bags',
    notes: ''
  })

  const categories = ['ALL', 'Cooking Oils', 'Commercial Oils', 'Animal Feed / By-products', 'Spices & Agri Produce']

  const filtered = selectedCategory === 'ALL'
    ? products
    : products.filter(p => p.category === selectedCategory)

  const handleEnquirySubmit = (e) => {
    e.preventDefault()
    if (!enquiryForm.name || !enquiryForm.phone) {
      toast.error('Please enter name and phone number')
      return
    }
    toast.success(`Mill wholesale inquiry submitted for ${enquiryForm.product}! Sales team will call within 2 business hours.`)
    setEnquiryModal(false)
    setEnquiryForm({ name: '', phone: '', city: '', product: '', quantity: '', notes: '' })
  }

  const openEnquiry = (product, packSize) => {
    setEnquiryForm(prev => ({
      ...prev,
      product: `${product.name} (${packSize})`
    }))
    setEnquiryModal(true)
  }

  return (
    <div className="space-y-8 animate-fade-in">

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-950/60 via-surface-1 to-emerald-950/40 border border-amber-500/20 p-8">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <Sparkles size={14} /> Direct from Mill Floor — Tirumala Oil Mill Products
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-white font-display tracking-tight leading-tight">
            Wholesale & Retail Product Showcase
          </h1>
          <p className="text-zinc-300 text-sm leading-relaxed">
            Freshly crushed edible oils, unadulterated high-protein cattle cake, and graded Nizamabad turmeric. V1 provides direct-from-mill booking with transparent lab specifications.
          </p>
          <div className="flex flex-wrap gap-4 pt-2 text-xs text-zinc-400">
            <span className="flex items-center gap-1.5"><ShieldCheck size={16} className="text-emerald-400" /> FSSAI Certified (#10123000000456)</span>
            <span className="flex items-center gap-1.5"><Check size={16} className="text-amber-400" /> 100% Single-Source Crushing</span>
            <span className="flex items-center gap-1.5"><Info size={16} className="text-blue-400" /> Direct Mill Dispatches</span>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-amber-500 text-black font-bold shadow-lg shadow-amber-500/20'
                : 'bg-surface-2 text-zinc-400 hover:text-white hover:bg-surface-3'
            }`}
          >
            {cat === 'ALL' ? 'All Mill Products' : cat}
          </button>
        ))}
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map(p => (
          <Card key={p.id} className="p-6 flex flex-col justify-between hover:border-amber-500/30 transition-all group">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-3xl group-hover:scale-105 transition-transform">
                  {p.image}
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-mono text-zinc-500">{p.id}</span>
                  <div className="flex items-center gap-1 text-amber-400 text-xs mt-0.5">
                    <Star size={12} fill="currentColor" />
                    <span className="font-bold">{p.rating}</span>
                    <span className="text-zinc-500">({p.reviews})</span>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">{p.category}</span>
                <h3 className="font-display font-bold text-white text-lg mt-0.5 leading-snug">{p.name}</h3>
                <p className="text-zinc-400 text-xs mt-1.5 leading-relaxed">{p.tagline}</p>
              </div>

              {/* Bullet features */}
              <div className="space-y-1.5 py-2 border-y border-white/5">
                {p.features.map(f => (
                  <div key={f} className="flex items-center gap-2 text-xs text-zinc-300">
                    <Check size={13} className="text-emerald-400 flex-shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              {/* Pack Sizes & Pricing */}
              <div>
                <p className="text-[11px] uppercase tracking-wider font-semibold text-zinc-500 mb-2">Available Pack Sizes</p>
                <div className="space-y-2">
                  {p.packs.map(pk => (
                    <div key={pk.size} className="flex items-center justify-between p-2.5 bg-surface-2/80 rounded-xl border border-white/5 text-xs">
                      <div>
                        <span className="font-medium text-white">{pk.size}</span>
                        <div className="text-[11px] text-zinc-500 line-through">MRP: ₹{pk.mrp}</div>
                      </div>
                      <div className="text-right">
                        <span className="font-display font-bold text-amber-300 text-sm">₹{pk.price}</span>
                        <button
                          onClick={() => openEnquiry(p, pk.size)}
                          className="block text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 mt-0.5"
                        >
                          Book Direct →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-5 mt-4 border-t border-white/5 flex gap-2">
              <button
                onClick={() => setSelectedProduct(p)}
                className="btn-secondary flex-1 text-xs justify-center py-2"
              >
                Lab Specs
              </button>
              <button
                onClick={() => openEnquiry(p, p.packs[0]?.size)}
                className="btn-primary flex-1 text-xs justify-center py-2"
              >
                Inquire / Quote
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Lab Specs Modal */}
      <Modal
        open={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        title={`Certified Lab Specifications — ${selectedProduct?.name}`}
      >
        <div className="space-y-4">
          <div className="p-3 bg-surface-3 rounded-xl flex items-center justify-between text-xs">
            <span className="text-zinc-400">FSSAI License:</span>
            <span className="font-mono text-emerald-400 font-bold">{selectedProduct?.fssai}</span>
          </div>

          <div className="space-y-2 text-xs">
            {selectedProduct?.specs && Object.entries(selectedProduct.specs).map(([k, v]) => (
              <div key={k} className="flex justify-between p-2.5 bg-surface-2 rounded-lg border border-white/5">
                <span className="text-zinc-400 capitalize">{k.replace(/([A-Z])/g, ' $1')}:</span>
                <span className="font-mono text-white font-semibold">{v}</span>
              </div>
            ))}
          </div>

          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300 flex items-start gap-2">
            <Info size={15} className="flex-shrink-0 mt-0.5" />
            <span>Every batch undergoes laboratory testing for FFA, moisture, and purity before leaving the mill premises.</span>
          </div>

          <div className="flex justify-end pt-2">
            <button onClick={() => setSelectedProduct(null)} className="btn-secondary text-xs">Close</button>
          </div>
        </div>
      </Modal>

      {/* Wholesale Enquiry Modal */}
      <Modal
        open={enquiryModal}
        onClose={() => setEnquiryModal(false)}
        title="Direct Mill Booking & Wholesale Quote"
      >
        <form onSubmit={handleEnquirySubmit} className="space-y-4">
          <div className="p-3 bg-surface-3 rounded-xl text-xs text-zinc-300">
            <strong>Selected Item:</strong> <span className="text-amber-400 font-semibold">{enquiryForm.product}</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Your Full Name *">
              <input
                required
                className="tom-input"
                placeholder="e.g. Balaji Traders"
                value={enquiryForm.name}
                onChange={e => setEnquiryForm({ ...enquiryForm, name: e.target.value })}
              />
            </FormField>
            <FormField label="Phone Number *">
              <input
                required
                className="tom-input"
                placeholder="+91-98765-XXXXX"
                value={enquiryForm.phone}
                onChange={e => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Destination City / Town">
              <input
                className="tom-input"
                placeholder="e.g. Warangal / Hyderabad"
                value={enquiryForm.city}
                onChange={e => setEnquiryForm({ ...enquiryForm, city: e.target.value })}
              />
            </FormField>
            <FormField label="Required Quantity">
              <input
                className="tom-input"
                placeholder="e.g. 50 tins / 20 bags"
                value={enquiryForm.quantity}
                onChange={e => setEnquiryForm({ ...enquiryForm, quantity: e.target.value })}
              />
            </FormField>
          </div>

          <FormField label="Delivery Mode / Additional Notes">
            <textarea
              className="tom-input h-20 resize-none"
              placeholder="e.g. Need self-pickup via truck from mill godown on Monday"
              value={enquiryForm.notes}
              onChange={e => setEnquiryForm({ ...enquiryForm, notes: e.target.value })}
            />
          </FormField>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setEnquiryModal(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Submit Direct Booking Inquiry</button>
          </div>
        </form>
      </Modal>

    </div>
  )
}

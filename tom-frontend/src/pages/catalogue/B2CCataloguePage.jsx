import { useState } from 'react'
import { Card, Badge, Modal, FormField } from '../../components/ui'
import {
  ShoppingBag, Star, ShieldCheck, Phone, Mail, Check, Info,
  ArrowRight, Sparkles, Filter, Droplets, Layers, Sun, Wheat, Package
} from 'lucide-react'
import toast from 'react-hot-toast'

const products = [
  {
    id: 'PRD-01',
    name: 'Tirumala Cold-Pressed Cottonseed Oil',
    tagline: 'Traditional expeller-pressed, zero chemical solvents',
    category: 'Cooking Oils',
    rating: 4.9,
    reviews: 142,
    icon: <Droplets className="w-7 h-7 text-zinc-950" />,
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
    icon: <Layers className="w-7 h-7 text-zinc-950" />,
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
    icon: <Sun className="w-7 h-7 text-zinc-950" />,
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
    icon: <Wheat className="w-7 h-7 text-zinc-950" />,
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
    icon: <Sparkles className="w-7 h-7 text-zinc-950" />,
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
    icon: <Package className="w-7 h-7 text-zinc-950" />,
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

      {/* Header Banner — Pristine Monochrome Console Card */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-zinc-200 p-8 shadow-sm">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-950 text-xs font-bold uppercase tracking-wider">
            <Sparkles size={14} className="text-zinc-950" /> Direct from Mill Floor — Tirumala Oil Mill Products
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-zinc-950 font-sans tracking-tight leading-tight">
            Wholesale & Retail Product Showcase
          </h1>
          <p className="text-zinc-700 text-sm leading-relaxed">
            Freshly crushed edible oils, unadulterated high-protein cattle cake, and graded Nizamabad turmeric. Direct-from-mill booking with transparent lab specifications.
          </p>
          <div className="flex flex-wrap gap-4 pt-2 text-xs text-zinc-600 font-medium">
            <span className="flex items-center gap-1.5"><ShieldCheck size={16} className="text-zinc-950" /> FSSAI Certified (#10123000000456)</span>
            <span className="flex items-center gap-1.5"><Check size={16} className="text-zinc-950" /> 100% Single-Source Crushing</span>
            <span className="flex items-center gap-1.5"><Info size={16} className="text-zinc-950" /> Direct Mill Dispatches</span>
          </div>
        </div>
      </div>

      {/* Subcategory Filter Pills — High Contrast Black & White */}
      <div className="space-y-2">
        <p className="text-xs font-bold text-zinc-950 uppercase tracking-wider">Product Categories</p>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer active:scale-[0.98] ${
                selectedCategory === cat
                  ? 'bg-zinc-950 text-white font-bold shadow-sm'
                  : 'bg-white border border-zinc-200 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 hover:border-zinc-300'
              }`}
            >
              {cat === 'ALL' ? 'All Mill Products' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map(p => (
          <Card key={p.id} className="p-6 flex flex-col justify-between hover:border-zinc-400 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md group">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="w-14 h-14 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center group-hover:scale-105 group-hover:bg-zinc-950 group-hover:text-white transition-all duration-200 shadow-sm">
                  {p.icon}
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-mono text-zinc-500 font-bold">{p.id}</span>
                  <div className="flex items-center gap-1 text-zinc-950 text-xs mt-0.5 justify-end">
                    <Star size={12} fill="currentColor" />
                    <span className="font-bold">{p.rating}</span>
                    <span className="text-zinc-500 font-mono">({p.reviews})</span>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-zinc-950 uppercase tracking-wider">{p.category}</span>
                <h3 className="font-sans font-bold text-zinc-950 text-lg mt-0.5 leading-snug">{p.name}</h3>
                <p className="text-zinc-600 text-xs mt-1.5 leading-relaxed">{p.tagline}</p>
              </div>

              {/* Bullet features */}
              <div className="space-y-1.5 py-2 border-y border-zinc-200">
                {p.features.map(f => (
                  <div key={f} className="flex items-center gap-2 text-xs text-zinc-700 font-medium">
                    <Check size={13} className="text-zinc-950 flex-shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              {/* Pack Sizes & Pricing */}
              <div>
                <p className="text-xs uppercase tracking-wider font-bold text-zinc-950 mb-2">Available Pack Sizes</p>
                <div className="space-y-2">
                  {p.packs.map(pk => (
                    <div key={pk.size} className="flex items-center justify-between p-2.5 bg-zinc-50 rounded-xl border border-zinc-200 text-xs hover:border-zinc-300 transition-colors">
                      <div>
                        <span className="font-semibold text-zinc-950">{pk.size}</span>
                        <div className="text-[11px] text-zinc-500 line-through font-mono">MRP: ₹{pk.mrp}</div>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-zinc-950 text-sm">₹{pk.price}</span>
                        <button
                          onClick={() => openEnquiry(p, pk.size)}
                          className="block text-[11px] font-bold text-zinc-950 hover:underline mt-0.5 cursor-pointer"
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
            <div className="pt-5 mt-4 border-t border-zinc-200 flex gap-2">
              <button
                onClick={() => setSelectedProduct(p)}
                className="btn-secondary flex-1 text-xs justify-center py-2 shadow-sm"
              >
                Lab Specs
              </button>
              <button
                onClick={() => openEnquiry(p, p.packs[0]?.size)}
                className="btn-primary flex-1 text-xs justify-center py-2 shadow-sm"
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
          <div className="p-3 bg-zinc-100 border border-zinc-200 rounded-xl flex items-center justify-between text-xs">
            <span className="text-zinc-600 font-semibold">FSSAI License:</span>
            <span className="font-mono text-zinc-950 font-bold">{selectedProduct?.fssai}</span>
          </div>

          <div className="space-y-2 text-xs">
            {selectedProduct?.specs && Object.entries(selectedProduct.specs).map(([k, v]) => (
              <div key={k} className="flex justify-between p-2.5 bg-zinc-50 rounded-lg border border-zinc-200">
                <span className="text-zinc-600 font-medium capitalize">{k.replace(/([A-Z])/g, ' $1')}:</span>
                <span className="font-mono text-zinc-950 font-bold">{v}</span>
              </div>
            ))}
          </div>

          <div className="p-3 bg-zinc-100 border border-zinc-200 rounded-xl text-xs text-zinc-800 flex items-start gap-2">
            <Info size={15} className="flex-shrink-0 mt-0.5 text-zinc-950" />
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
          <div className="p-3 bg-zinc-100 border border-zinc-200 rounded-xl text-xs text-zinc-800">
            <strong>Selected Item:</strong> <span className="text-zinc-950 font-bold">{enquiryForm.product}</span>
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

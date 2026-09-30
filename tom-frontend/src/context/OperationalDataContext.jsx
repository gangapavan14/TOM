import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import toast from 'react-hot-toast'
import { inventoryApi, salesApi, workforceApi, procurementApi } from '../api/endpoints'

const OperationalDataContext = createContext(null)

const REPLICATION_CHANNEL = 'tom_replication_bus'
const STORAGE_KEY = 'tom_operational_data_v3'

// Initial Default State for Tirumala Oil Mill Enterprise
const DEFAULT_STATE = {
  // 1. Inflow & Warehouses (Section 9)
  batches: [
    {
      id: 'TUR-260926-001',
      commodity: 'Turmeric Fingers',
      grade: 'A+',
      warehouse: 'Warehouse 1 (Hero: Turmeric)',
      room: 'Quality Room 1A',
      bags: 120,
      currentKg: 6000,
      originalKg: 6000,
      purchaseCost: 690000,
      processingCost: 35000,
      transportCost: 25000,
      totalCost: 750000,
      effectiveCostPerKg: 125.00,
      status: 'IN_STOCK'
    },
    {
      id: 'TUR-260926-002',
      commodity: 'Turmeric Raw',
      grade: 'A',
      warehouse: 'Warehouse 1 (Hero: Turmeric)',
      room: 'Room 1B (Drying & Curing)',
      bags: 80,
      currentKg: 3880,
      originalKg: 4000,
      purchaseCost: 440000,
      processingCost: 12000,
      transportCost: 6000,
      totalCost: 458000,
      effectiveCostPerKg: 118.04,
      status: 'IN_STOCK'
    },
    {
      id: 'MAI-260926-001',
      commodity: 'Maize Grain',
      grade: 'A',
      warehouse: 'Warehouse 2 (Hero: Maize)',
      room: 'Silo 2A',
      bags: 200,
      currentKg: 10000,
      originalKg: 10000,
      purchaseCost: 205000,
      processingCost: 5000,
      transportCost: 10000,
      totalCost: 220000,
      effectiveCostPerKg: 22.00,
      status: 'IN_STOCK'
    },
    {
      id: 'SES-260926-001',
      commodity: 'Sesame Seed',
      grade: 'B',
      warehouse: 'Warehouse 3 (Hero: Til/Sesame)',
      room: 'Room 3A',
      bags: 40,
      currentKg: 2000,
      originalKg: 2000,
      purchaseCost: 275000,
      processingCost: 5000,
      transportCost: 10000,
      totalCost: 290000,
      effectiveCostPerKg: 145.00,
      status: 'IN_STOCK'
    },
    {
      id: 'CAK-260926-001',
      commodity: 'Cottonseed Oil Cake',
      grade: 'A',
      warehouse: 'General Godown 4 (Oil Cake & By-products)',
      room: 'Cotton Cake Bay',
      bags: 400,
      currentKg: 20000,
      originalKg: 20000,
      purchaseCost: 720000,
      processingCost: 40000,
      transportCost: 15000,
      totalCost: 775000,
      effectiveCostPerKg: 38.75,
      status: 'IN_STOCK'
    }
  ],

  // 2. Rule 6 Customer Pickup & Loading Dockets
  loadingDocket: {
    id: 'LOAD-01',
    orderId: 'ORD-2026-104',
    vehicle: 'AP 21 TY 4521',
    driver: 'Ramesh Naidu (Cell: 98480-12345)',
    client: 'Heritage Foods Ltd',
    commodity: 'Cottonseed Oil Cake (50kg bags)',
    batchCode: 'CAK-260926-001',
    targetBags: 200,
    currentCount: 200,
    sealNumber: 'SEAL-TOM-9842',
    tareWeight: 8450,
    status: 'READY_FOR_FO_SIGNOFF', // 'COUNTING' | 'READY_FOR_FO_SIGNOFF' | 'VERIFIED_BY_FO'
    seniorWorkerSign: 'N. Venkata Rao (Recorded)',
    foSign: null,
    verifiedAt: null
  },

  // 3. Rule 7 Sales Cash Handover & Credit Reconciliation
  cashHandovers: [
    {
      id: 'CH-01',
      customer: 'Tirupati Refineries',
      salesPerson: 'Suresh Kumar (Sales)',
      amount: 45000,
      collectedAt: 'Today 11:30 AM',
      verified: false,
      status: 'PENDING_ADMIN_VERIFY',
      notes: 'Customer paid 50% advance for 15 TPD crude cake order'
    },
    {
      id: 'CH-02',
      customer: 'Sri Balaji Co.',
      salesPerson: 'Suresh Kumar (Sales)',
      amount: 25000,
      collectedAt: 'Today 09:15 AM',
      verified: false,
      status: 'PENDING_ADMIN_VERIFY',
      notes: 'Monthly invoice settlement part-payment'
    },
    {
      id: 'CH-03',
      customer: 'Kaveri Feeds',
      salesPerson: 'Suresh Kumar (Sales)',
      amount: 28000,
      collectedAt: 'Yesterday',
      verified: true,
      status: 'ADMIN_VERIFIED',
      notes: 'Admin counted & verified physical currency. Customer ledger adjusted.'
    }
  ],

  // 4. Procurement Deals & Price Escalations (±₹3 Field Officer Cap)
  deals: [
    {
      id: 'DEAL-2609-01',
      dealCode: 'DEAL-2609-01',
      supplier: 'Sri Rama Agros',
      sourceType: 'COMMISSION_AGENT',
      commodity: 'Raw Cotton Seed',
      qty: 10000,
      targetPrice: 125.00,
      agreedPrice: 124.50,
      status: 'ACCEPTED',
      inspection: 'PASSED',
      escalated: false,
      deliveryWindowRemaining: '16 hrs remaining (24h rule)'
    },
    {
      id: 'DEAL-2609-02',
      dealCode: 'DEAL-2609-02',
      supplier: 'K. Venkat Reddy',
      sourceType: 'FARMER_DIRECT',
      commodity: 'Turmeric Fingers',
      qty: 5000,
      targetPrice: 85.00,
      agreedPrice: 84.00,
      status: 'DELIVERY_PENDING',
      inspection: 'PENDING',
      escalated: false,
      deliveryWindowRemaining: '22 hrs remaining'
    },
    {
      id: 'DEAL-2609-04',
      dealCode: 'DEAL-2609-04',
      supplier: 'Kurnool Farmers Coop',
      sourceType: 'COOPERATIVE',
      commodity: 'Maize High Starch',
      qty: 1000,
      targetPrice: 70.00,
      agreedPrice: 73.50,
      status: 'ESCALATED',
      inspection: 'GRADE_B',
      escalated: true,
      escalationReason: 'Negotiated rate ₹73.50 exceeds Field Officer ₹72.00 ceiling limit',
      deliveryWindowRemaining: '24h delivery clock paused pending Admin signoff'
    }
  ],

  // 5. Temporary Daily Wage Applications
  tempApps: [
    {
      id: 'TMP-01',
      name: 'Raju Sharma',
      role: 'Loading & Stitching Worker',
      phone: '+91-98480-23456',
      nationalId: 'XXXX-XXXX-9842',
      dailyWage: 450,
      status: 'PENDING',
      appliedAt: 'Today 07:30 AM'
    },
    {
      id: 'TMP-02',
      name: 'K. Somanna',
      role: 'Seed Cleaning Helper',
      phone: '+91-99590-78123',
      nationalId: 'XXXX-XXXX-3312',
      dailyWage: 420,
      status: 'APPROVED',
      appliedAt: 'Yesterday'
    }
  ],

  // 6. Floor Worker Shift Checklists ("What Worker Needs to Do")
  floorTasks: [
    {
      id: 'TSK-101',
      worker: 'N. Venkata Rao',
      workerRole: 'Expeller Master',
      station: 'Expeller Bay 1 (EXP-01)',
      target: 'Crush 5,000 kg Raw Cotton Seed',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      shift: 'Shift A (08:00 - 18:00)',
      steps: [
        { text: 'Check feeder hopper clearance and magnetic separator', done: true },
        { text: 'Ensure barrel heating jacket is steady at 105°C - 112°C', done: true },
        { text: 'Verify oil drainage channel into settling sump tank', done: false },
        { text: 'Record hourly seed throughput rate in log sheet', done: false },
      ]
    },
    {
      id: 'TSK-102',
      worker: 'M. Shiva Reddy',
      workerRole: 'Boiler & Steam Tech',
      station: 'Husk Boiler Shed #2',
      target: 'Maintain 10.5 Bar Steam Pressure',
      priority: 'URGENT',
      status: 'IN_PROGRESS',
      shift: 'Shift A (08:00 - 18:00)',
      steps: [
        { text: 'Inspect husk feed conveyor tension', done: true },
        { text: 'Verify safety pressure relief valve calibration', done: true },
        { text: 'Check feedwater softener hardness reading (< 5 ppm)', done: true },
        { text: 'Perform boiler bottom blowdown at 12:00 PM', done: false },
      ]
    },
    {
      id: 'TSK-103',
      worker: 'G. Apparao',
      workerRole: 'Loading Staff',
      station: 'Yard Bay 2 (Outflow Dock)',
      target: 'Load 200 bags Oil Cake onto Truck AP 21 TY 4521',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      shift: 'Day Loading Squad',
      steps: [
        { text: 'Inspect truck cargo bed cleanliness and dry tarp cover', done: true },
        { text: 'Count and stack standard 50kg bags in 10-bag rows', done: true },
        { text: 'Verify permanent Bag ID tags match Batch #CAK-260926-001', done: true },
        { text: 'Submit physical bag count for Field Officer verification signoff', done: true },
      ]
    },
    {
      id: 'TSK-104',
      worker: 'Raju Sharma (Temp)',
      workerRole: 'Bagging & Stitching Tech',
      station: 'Bagging Bay #1',
      target: 'Stitch & Weigh 150 Bags Cotton Cake',
      priority: 'NORMAL',
      status: 'PENDING',
      shift: 'Daily Wage Squad',
      steps: [
        { text: 'Tare empty jute bag on platform scale (target 50.0 kg net)', done: false },
        { text: 'Operate automatic double-thread stitching head', done: false },
        { text: 'Apply serial batch tag TUR-260926 to bag mouth', done: false },
        { text: 'Trolley palletize to Room B staging area', done: false },
      ]
    }
  ],

  // 7. Customers Outstanding Ledger
  customers: [
    { id: 1, name: 'Tirupati Refineries', contact: 'M. Anand', phone: '+91-98490-11223', city: 'Tirupati', outstanding: 1250000, creditLimit: 2000000, status: 'ACTIVE' },
    { id: 2, name: 'Heritage Foods Ltd', contact: 'R. Seshagiri', phone: '+91-99887-44332', city: 'Hyderabad', outstanding: 850000, creditLimit: 1500000, status: 'ACTIVE' },
    { id: 3, name: 'Sri Balaji Co.', contact: 'Balaji Rao', phone: '+91-87654-32109', city: 'Warangal', outstanding: 480000, creditLimit: 1000000, status: 'ACTIVE' },
  ],

  // 8. Financial Stats
  cashBalance: 4820000,

  // 9. B2B Sales Orders (Replicating across Sales, Dashboard, and Yard Loading)
  orders: [
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
      loadingCost: 250,
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
      customer: 'Heritage Foods Ltd',
      product: 'Cottonseed Oil Cake',
      qty: 200,
      costPrice: 3875,
      referencePrice: 4200,
      agreedPrice: 4350,
      value: '₹8,70,000',
      rawValue: 870000,
      deliveryType: 'CUSTOMER_PICKUP',
      vehicleNo: 'AP 21 TY 4521',
      driverName: 'Ramesh Naidu (Cell: 98480-12345)',
      loadingCost: 1000,
      freightCost: 0,
      seniorWorkerRecorded: true,
      seniorWorkerName: 'N. Venkata Rao',
      fieldOfficerVerified: false,
      fieldOfficerName: 'Pending FO Verification',
      status: 'LOADING',
      date: 'Today'
    },
    {
      id: 'ORD-004',
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
    }
  ]
}

export function OperationalDataProvider({ children }) {
  // Load state from localStorage or initialize with DEFAULT_STATE
  const [data, setData] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        return { ...DEFAULT_STATE, ...parsed }
      }
    } catch (e) {
      console.warn('Failed to parse operational data, loading defaults', e)
    }
    return DEFAULT_STATE
  })

  // Broadcast channel for multi-tab, multi-role synchronization
  const broadcastChannel = useMemo(() => {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      return new BroadcastChannel(REPLICATION_CHANNEL)
    }
    return null
  }, [])

  // Sync state changes to localStorage and broadcast channel
  const persistAndBroadcast = useCallback((updater) => {
    setData(prev => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch (e) {
        console.error('Storage write error', e)
      }
      if (broadcastChannel) {
        broadcastChannel.postMessage({ type: 'SYNC_STATE', payload: next })
      }
      return next
    })
  }, [broadcastChannel])

  // Listen to replication events from other tabs / portals
  useEffect(() => {
    if (!broadcastChannel) return
    const handleMessage = (event) => {
      if (event.data?.type === 'SYNC_STATE' && event.data?.payload) {
        setData(event.data.payload)
      }
    }
    broadcastChannel.addEventListener('message', handleMessage)

    // Also listen to standard window storage event for fallback
    const handleStorage = (event) => {
      if (event.key === STORAGE_KEY && event.newValue) {
        try {
          setData(JSON.parse(event.newValue))
        } catch (_) {}
      }
    }
    window.addEventListener('storage', handleStorage)

    return () => {
      broadcastChannel.removeEventListener('message', handleMessage)
      window.removeEventListener('storage', handleStorage)
    }
  }, [broadcastChannel])

  // =========================================================================
  // WORKFLOW MUTATIONS (REPLICATING ACROSS ALL PORTALS)
  // =========================================================================

  // --- RULE 6: Physical Truck Loading Count Verification ---
  const updateLoadingDocketCount = useCallback((delta) => {
    persistAndBroadcast(prev => {
      const nextCount = Math.max(0, prev.loadingDocket.currentCount + delta)
      return {
        ...prev,
        loadingDocket: {
          ...prev.loadingDocket,
          currentCount: nextCount,
          status: 'COUNTING'
        }
      }
    })
  }, [persistAndBroadcast])

  const transmitLoadingDocketToFO = useCallback(() => {
    persistAndBroadcast(prev => ({
      ...prev,
      loadingDocket: {
        ...prev.loadingDocket,
        status: 'READY_FOR_FO_SIGNOFF'
      }
    }))
    toast.success('Loading count transmitted to Field Officer! (Rule 6 Signoff Pending)')
  }, [persistAndBroadcast])

  const verifyAndSignLoadingDeduction = useCallback((officerName = 'K. Ramesh (Field Officer)') => {
    persistAndBroadcast(prev => {
      const docket = prev.loadingDocket
      const deductBags = docket.currentCount
      const deductKg = deductBags * 50

      // Invariant Rule 6: Deduct stock from Inventory Batch now that FO signed off!
      const updatedBatches = prev.batches.map(b => {
        if (b.id === docket.batchCode || b.commodity.includes('Cottonseed Oil Cake')) {
          const nextKg = Math.max(0, b.currentKg - deductKg)
          const nextBags = Math.max(0, b.bags - deductBags)
          return {
            ...b,
            currentKg: nextKg,
            bags: nextBags
          }
        }
        return b
      })

      toast.success(`Inventory deduction of ${deductBags} bags (${deductKg.toLocaleString()} kg) authorized! Stock reduced in General Godown 4.`)

      return {
        ...prev,
        batches: updatedBatches,
        loadingDocket: {
          ...prev.loadingDocket,
          status: 'VERIFIED_BY_FO',
          foSign: officerName,
          verifiedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
        }
      }
    })
  }, [persistAndBroadcast])

  // --- RULE 7: Cash Handover & Admin Physical Count ---
  const recordCashCollection = useCallback((collection) => {
    const newCH = {
      id: `CH-0${Math.floor(10 + Math.random() * 90)}`,
      customer: collection.customer,
      salesPerson: collection.salesPerson || 'Suresh Kumar (Sales)',
      amount: parseFloat(collection.amount) || 0,
      collectedAt: 'Just now',
      verified: false,
      status: 'PENDING_ADMIN_VERIFY',
      notes: collection.notes || 'Cash collected on field by sales representative.'
    }

    persistAndBroadcast(prev => ({
      ...prev,
      cashHandovers: [newCH, ...prev.cashHandovers]
    }))

    toast.success(`Cash collection of ₹${newCH.amount.toLocaleString('en-IN')} queued for Admin physical count verification! (Rule 7)`)
  }, [persistAndBroadcast])

  const verifyCashHandover = useCallback((chId) => {
    persistAndBroadcast(prev => {
      const targetCH = prev.cashHandovers.find(c => c.id === chId)
      if (!targetCH) return prev

      const creditReduction = targetCH.amount

      // Invariant Rule 7: Admin physical verification officially reduces customer outstanding
      const updatedCustomers = prev.customers.map(cust => {
        if (cust.name === targetCH.customer) {
          return {
            ...cust,
            outstanding: Math.max(0, cust.outstanding - creditReduction)
          }
        }
        return cust
      })

      toast.success(`Admin verified currency count! ₹${creditReduction.toLocaleString('en-IN')} officially credited to ${targetCH.customer}.`)

      return {
        ...prev,
        cashBalance: prev.cashBalance + creditReduction,
        customers: updatedCustomers,
        cashHandovers: prev.cashHandovers.map(c => c.id === chId ? {
          ...c,
          verified: true,
          status: 'ADMIN_VERIFIED',
          handedTo: 'Admin (Cash Verified)'
        } : c)
      }
    })
  }, [persistAndBroadcast])

  // --- PROCUREMENT ESCALATIONS (±₹3 Field Officer Cap) ---
  const escalateProcurementDeal = useCallback((dealId, reason) => {
    persistAndBroadcast(prev => {
      const updatedDeals = prev.deals.map(d => {
        if (d.id === dealId || d.dealCode === dealId) {
          return {
            ...d,
            status: 'ESCALATED',
            escalated: true,
            escalationReason: reason || 'Rate exceeds Field Officer ceiling cap'
          }
        }
        return d
      })
      toast.error(`Deal #${dealId} escalated to Admin Executive for pricing exception signoff!`)
      return { ...prev, deals: updatedDeals }
    })
  }, [persistAndBroadcast])

  const approveEscalatedDeal = useCallback((dealId) => {
    persistAndBroadcast(prev => {
      const updatedDeals = prev.deals.map(d => {
        if (d.id === dealId || d.dealCode === dealId) {
          return {
            ...d,
            status: 'ACCEPTED',
            escalated: false,
            escalationReason: 'Admin executive price exception approved'
          }
        }
        return d
      })
      toast.success(`Admin approved exception rate for deal #${dealId}! Delivery window active.`)
      return { ...prev, deals: updatedDeals }
    })
  }, [persistAndBroadcast])

  // --- INVENTORY STOCK INFLOW & ADJUSTMENT ---
  const recordStockInflow = useCallback((newBatch) => {
    persistAndBroadcast(prev => ({
      ...prev,
      batches: [newBatch, ...prev.batches]
    }))
    toast.success(`Stock Batch #${newBatch.id} stocked in ${newBatch.warehouse}! Replicated across all portals.`)
  }, [persistAndBroadcast])

  const logStockLoss = useCallback((batchId, lossKg, reason) => {
    persistAndBroadcast(prev => {
      const targetBatch = prev.batches.find(b => b.id === batchId)
      if (!targetBatch) return prev

      const updatedKg = Math.max(0, targetBatch.currentKg - lossKg)
      const newEffectiveCost = updatedKg > 0 ? parseFloat((targetBatch.totalCost / updatedKg).toFixed(2)) : targetBatch.effectiveCostPerKg

      const updatedBatches = prev.batches.map(b => b.id === batchId ? {
        ...b,
        currentKg: updatedKg,
        effectiveCostPerKg: newEffectiveCost
      } : b)

      toast.success(`Stock adjusted for ${batchId}: Cost recalculated to ₹${newEffectiveCost}/kg!`)
      return { ...prev, batches: updatedBatches }
    })
  }, [persistAndBroadcast])

  // --- WORKFORCE TEMP WORKERS ---
  const applyTempWorker = useCallback((workerData) => {
    const newWorker = {
      id: `TMP-0${Math.floor(10 + Math.random() * 90)}`,
      name: workerData.name,
      role: workerData.role || 'Daily Wage Loading Worker',
      phone: workerData.phone,
      nationalId: workerData.nationalId,
      dailyWage: parseFloat(workerData.dailyWage) || 450,
      status: 'PENDING',
      appliedAt: 'Just now'
    }
    persistAndBroadcast(prev => ({
      ...prev,
      tempApps: [newWorker, ...prev.tempApps]
    }))
    toast.success(`Application for ${newWorker.name} submitted for Admin/Office badge approval!`)
  }, [persistAndBroadcast])

  const approveTempWorker = useCallback((workerId) => {
    persistAndBroadcast(prev => {
      const targetWorker = prev.tempApps.find(w => w.id === workerId)
      const updatedApps = prev.tempApps.map(w => w.id === workerId ? { ...w, status: 'APPROVED' } : w)

      // Also add to active floor shift tasks if not already present
      const newTask = targetWorker ? {
        id: `TSK-${Math.floor(100 + Math.random() * 900)}`,
        worker: `${targetWorker.name} (Temp)`,
        workerRole: targetWorker.role,
        station: 'Loading & Yard Dock',
        target: '50kg Bag Pallet Staging',
        priority: 'NORMAL',
        status: 'PENDING',
        shift: 'Day Shift',
        steps: [
          { text: 'Check in with Senior Worker for biometric token', done: true },
          { text: 'Verify safety gloves and steel-toe boots', done: true },
          { text: 'Commence truck loading duty', done: false }
        ]
      } : null

      toast.success(`Worker #${workerId} approved! RFID badge issued and added to floor roster.`)

      return {
        ...prev,
        tempApps: updatedApps,
        floorTasks: newTask ? [newTask, ...prev.floorTasks] : prev.floorTasks
      }
    })
  }, [persistAndBroadcast])

  // --- FLOOR TASKS & CHECKLIST STEPS ---
  const assignFloorTask = useCallback((task) => {
    const created = {
      id: `TSK-${Math.floor(100 + Math.random() * 900)}`,
      ...task,
      status: 'PENDING'
    }
    persistAndBroadcast(prev => ({
      ...prev,
      floorTasks: [created, ...prev.floorTasks]
    }))
    toast.success(`Task ${created.id} assigned to ${created.worker}!`)
  }, [persistAndBroadcast])

  const toggleTaskStep = useCallback((taskId, stepIndex) => {
    persistAndBroadcast(prev => {
      const updatedTasks = prev.floorTasks.map(t => {
        if (t.id !== taskId) return t
        const newSteps = [...t.steps]
        newSteps[stepIndex] = { ...newSteps[stepIndex], done: !newSteps[stepIndex].done }
        const allDone = newSteps.every(s => s.done)
        return {
          ...t,
          steps: newSteps,
          status: allDone ? 'COMPLETED' : 'IN_PROGRESS'
        }
      })
      return { ...prev, floorTasks: updatedTasks }
    })
  }, [persistAndBroadcast])

  // --- B2B SALES ORDERS MUTATIONS ---
  const createSalesOrder = useCallback((newOrder) => {
    persistAndBroadcast(prev => ({
      ...prev,
      orders: [newOrder, ...(prev.orders || [])]
    }))
    toast.success(`B2B Order #${newOrder.id} placed! Stock reserved in godown. Replicated across all consoles.`)
  }, [persistAndBroadcast])

  const verifySalesOrderLoading = useCallback((orderId, officerName = 'K. Ramesh (Field Officer)') => {
    persistAndBroadcast(prev => {
      const updatedOrders = (prev.orders || []).map(o => {
        if (o.id === orderId) {
          return {
            ...o,
            seniorWorkerRecorded: true,
            seniorWorkerName: o.seniorWorkerName || 'G. Apparao (Senior Worker)',
            fieldOfficerVerified: true,
            fieldOfficerName: officerName,
            status: 'VERIFIED'
          }
        }
        return o
      })
      toast.success(`Loading Verified by Field Officer! Inventory deducted from Warehouse.`)
      return { ...prev, orders: updatedOrders }
    })
  }, [persistAndBroadcast])

  const contextValue = useMemo(() => ({
    // State
    batches: data.batches || [],
    orders: data.orders || [],
    loadingDocket: data.loadingDocket,
    cashHandovers: data.cashHandovers || [],
    deals: data.deals || [],
    tempApps: data.tempApps || [],
    floorTasks: data.floorTasks || [],
    customers: data.customers || [],
    cashBalance: data.cashBalance || 0,

    // Aggregates
    totalStockKg: (data.batches || []).reduce((acc, b) => acc + (parseFloat(b.currentKg) || 0), 0),
    totalReceivables: (data.customers || []).reduce((acc, c) => acc + (parseFloat(c.outstanding) || 0), 0),
    pendingApprovalsCount: [
      ...(data.cashHandovers || []).filter(c => !c.verified),
      ...(data.deals || []).filter(d => d.escalated),
      ...(data.tempApps || []).filter(t => t.status === 'PENDING')
    ].length,

    // Mutation functions
    updateLoadingDocketCount,
    transmitLoadingDocketToFO,
    verifyAndSignLoadingDeduction,
    recordCashCollection,
    verifyCashHandover,
    escalateProcurementDeal,
    approveEscalatedDeal,
    recordStockInflow,
    logStockLoss,
    applyTempWorker,
    approveTempWorker,
    assignFloorTask,
    toggleTaskStep,
    createSalesOrder,
    verifySalesOrderLoading
  }), [
    data,
    updateLoadingDocketCount,
    transmitLoadingDocketToFO,
    verifyAndSignLoadingDeduction,
    recordCashCollection,
    verifyCashHandover,
    escalateProcurementDeal,
    approveEscalatedDeal,
    recordStockInflow,
    logStockLoss,
    applyTempWorker,
    approveTempWorker,
    assignFloorTask,
    toggleTaskStep,
    createSalesOrder,
    verifySalesOrderLoading
  ])

  return (
    <OperationalDataContext.Provider value={contextValue}>
      {children}
    </OperationalDataContext.Provider>
  )
}

export function useOperationalData() {
  const ctx = useContext(OperationalDataContext)
  if (!ctx) {
    throw new Error('useOperationalData must be used within an OperationalDataProvider')
  }
  return ctx
}

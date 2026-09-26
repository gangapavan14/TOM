import { useState } from 'react'
import { Card, CardHeader, Badge } from '../../components/ui'
import { Settings2, Save, Bell, Shield, Database, Cpu } from 'lucide-react'

export default function SettingsPage() {
  const [millName, setMillName] = useState('Tirumala Oil Mill (TOM)')
  const [gstNo, setGstNo] = useState('37AABCT1234F1Z5')
  const [fssaiNo, setFssaiNo] = useState('10123000000456')
  const [weighbridgePort, setWeighbridgePort] = useState('COM3 (9600 baud)')
  const [autoSms, setAutoSms] = useState(true)
  const [saved, setSaved] = useState(false)

  const handleSave = (e) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="page-title">Enterprise System Settings</h1>
          <p className="page-sub">Configure mill enterprise parameters, hardware sensors, weighbridge integration & taxes</p>
        </div>
        {saved && (
          <span className="text-emerald-400 text-sm font-semibold flex items-center gap-1.5 animate-fade-in">
            ✓ Settings Saved Successfully
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-5 space-y-4">
            <h3 className="font-display font-bold text-white text-base flex items-center gap-2">
              <Database size={16} className="text-brand-400" />
              Mill Identity & Tax Registrations
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-zinc-400 font-medium block mb-1">Company / Mill Entity Name</label>
                <input
                  className="tom-input"
                  value={millName}
                  onChange={e => setMillName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs text-zinc-400 font-medium block mb-1">GSTIN Registration</label>
                <input
                  className="tom-input font-mono"
                  value={gstNo}
                  onChange={e => setGstNo(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs text-zinc-400 font-medium block mb-1">FSSAI License #</label>
                <input
                  className="tom-input font-mono"
                  value={fssaiNo}
                  onChange={e => setFssaiNo(e.target.value)}
                />
              </div>
            </div>
          </Card>

          <Card className="p-5 space-y-4">
            <h3 className="font-display font-bold text-white text-base flex items-center gap-2">
              <Cpu size={16} className="text-brand-400" />
              Hardware & Peripheral Gateways
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-zinc-400 font-medium block mb-1">Weighbridge Serial Interface</label>
                <input
                  className="tom-input font-mono"
                  value={weighbridgePort}
                  onChange={e => setWeighbridgePort(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs text-zinc-400 font-medium block mb-1">Boiler Steam Telemetry Interval</label>
                <select className="tom-select">
                  <option>Every 5 seconds (Real-time)</option>
                  <option>Every 30 seconds</option>
                  <option>Every 1 minute</option>
                </select>
              </div>
              <div className="pt-2">
                <label className="flex items-center gap-3 cursor-pointer text-sm text-zinc-300">
                  <input
                    type="checkbox"
                    checked={autoSms}
                    onChange={e => setAutoSms(e.target.checked)}
                    className="w-4 h-4 accent-amber-500 rounded"
                  />
                  Auto-dispatch WhatsApp / SMS gate slip on weighment completion
                </label>
              </div>
            </div>
          </Card>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="btn-primary">
            <Save size={16} /> Save Changes
          </button>
        </div>
      </form>
    </div>
  )
}

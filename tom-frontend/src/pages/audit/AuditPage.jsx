import { useState } from 'react'
import { Card, CardHeader, Badge } from '../../components/ui'
import { Shield, Search, Lock, UserCheck, AlertTriangle } from 'lucide-react'

const mockLogs = [
  { id: 'LOG-10492', action: 'USER_LOGIN', user: 'admin', ip: '127.0.0.1', details: 'Successful authentication with JWT issuance', time: 'Just now', status: 'SUCCESS' },
  { id: 'LOG-10491', action: 'CREATE_DEAL', user: 'admin', ip: '127.0.0.1', details: 'Created procurement deal #DEAL-260926-001 (500 Bags)', time: '12 mins ago', status: 'SUCCESS' },
  { id: 'LOG-10490', action: 'STOCK_MOVEMENT', user: 'office_staff', ip: '192.168.1.42', details: 'Transferred 80 bags from Warehouse 1 to Silo 2', time: '35 mins ago', status: 'SUCCESS' },
  { id: 'LOG-10489', action: 'DISBURSE_PAYROLL', user: 'admin', ip: '127.0.0.1', details: 'Approved September advance payment for 5 operators', time: '1 hour ago', status: 'SUCCESS' },
  { id: 'LOG-10488', action: 'FAILED_LOGIN', user: 'unknown_agent', ip: '45.12.89.2', details: 'Invalid credentials attempted 3 times', time: '2 hours ago', status: 'WARNING' },
]

export default function AuditPage() {
  const [logs] = useState(mockLogs)
  const [search, setSearch] = useState('')

  const filtered = logs.filter(l =>
    l.action.toLowerCase().includes(search.toLowerCase()) ||
    l.user.toLowerCase().includes(search.toLowerCase()) ||
    l.details.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="page-title">System Audit Log</h1>
          <p className="page-sub">Tamper-evident activity trail for compliance, transactions & system events</p>
        </div>
      </div>

      <div className="relative w-72">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input
          className="tom-input pl-9"
          placeholder="Filter audit entries..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="tom-table">
            <thead>
              <tr>
                <th>Event ID</th>
                <th>Action</th>
                <th>User</th>
                <th>IP Address</th>
                <th>Details</th>
                <th>Status</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(l => (
                <tr key={l.id}>
                  <td className="font-mono text-xs text-zinc-500">{l.id}</td>
                  <td>
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-surface-3 text-brand-300">
                      {l.action}
                    </span>
                  </td>
                  <td className="font-semibold text-white">{l.user}</td>
                  <td className="font-mono text-xs text-zinc-500">{l.ip}</td>
                  <td className="text-zinc-300 text-xs">{l.details}</td>
                  <td>
                    <Badge variant={l.status === 'SUCCESS' ? 'success' : 'danger'}>
                      {l.status}
                    </Badge>
                  </td>
                  <td className="text-xs text-zinc-500 whitespace-nowrap">{l.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

import api from './client'

export const authApi = {
  login:   (username, password) => api.post('/auth/login', { username, password }),
  refresh: (refreshToken)       => api.post('/auth/refresh', { refreshToken }),
  me:      ()                   => api.get('/auth/me'),
  users:   ()                   => api.get('/auth/users'),
  createUser: (data)            => api.post('/auth/users', data),
  deactivate: (id)              => api.put(`/auth/users/${id}/deactivate`),
  roles:   ()                   => api.get('/auth/roles'),
}

export const auditApi = {
  all:    ()             => api.get('/audit-logs'),
  entity: (type, id)    => api.get(`/audit-logs/entity/${type}/${id}`),
}

export const workforceApi = {
  employees:       ()     => api.get('/workforce/employees'),
  createEmployee:  (data) => api.post('/workforce/employees', data),
  attendanceToday: ()     => api.get('/workforce/attendance/today'),
  recordAttendance:(data) => api.post('/workforce/attendance', data),
  tempApps:        ()     => api.get('/workforce/temp-applications'),
  applyTemp:       (data) => api.post('/workforce/temp-applications', data),
  approveTempApp:  (id)   => api.put(`/workforce/temp-applications/${id}/approve`),
  payroll:         ()     => api.get('/workforce/payroll'),
  disburseAll:     ()     => api.post('/workforce/payroll/disburse-all'),
}

export const inventoryApi = {
  warehouses:  ()     => api.get('/inventory/warehouses'),
  batches:     ()     => api.get('/inventory/batches'),
  createBatch: (data) => api.post('/inventory/batches', data),
}

export const procurementApi = {
  suppliers:         ()     => api.get('/procurement/suppliers'),
  requirements:      ()     => api.get('/procurement/requirements'),
  createRequirement: (data) => api.post('/procurement/requirements', data),
  deals:             ()     => api.get('/procurement/deals'),
  createDeal:        (data) => api.post('/procurement/deals', data),
}

export const processingApi = {
  machines:      ()   => api.get('/processing/machines'),
  toggleMachine: (id) => api.put(`/processing/machines/${id}/toggle`),
  runs:          ()   => api.get('/processing/runs'),
  createRun:     (data) => api.post('/processing/runs', data),
}

export const logisticsApi = {
  tickets:      ()     => api.get('/logistics/tickets'),
  createTicket: (data) => api.post('/logistics/tickets', data),
}

export const salesApi = {
  customers:   ()     => api.get('/sales/customers'),
  orders:      ()     => api.get('/sales/orders'),
  createOrder: (data) => api.post('/sales/orders', data),
}

export const financeApi = {
  transactions:      ()     => api.get('/finance/transactions'),
  createTransaction: (data) => api.post('/finance/transactions', data),
}

export const settingsApi = {
  all: () => api.get('/settings').catch(() => ({ data: { data: [] } })),
}

/**
 * TOM API Client
 * Centralized HTTP client for all backend communication.
 * Always communicates with the Spring Boot REST API.
 */

const API_BASE = 'http://localhost:8080/api';

const TomAPI = {

  /** Core fetch wrapper with auth token injection */
  async _request(method, path, body = null, requiresAuth = true) {
    const headers = { 'Content-Type': 'application/json' };

    if (requiresAuth) {
      const token = localStorage.getItem('tom_access_token');
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }

    const config = { method, headers };
    if (body) config.body = JSON.stringify(body);

    try {
      const res = await fetch(`${API_BASE}${path}`, config);

      // Token expired — try refresh
      if (res.status === 401 && requiresAuth) {
        const refreshed = await TomAPI._tryRefresh();
        if (refreshed) {
          const newToken = localStorage.getItem('tom_access_token');
          headers['Authorization'] = `Bearer ${newToken}`;
          const retry = await fetch(`${API_BASE}${path}`, { method, headers, body: body ? JSON.stringify(body) : null });
          return retry.json();
        } else {
          Auth.logout();
          return;
        }
      }

      return res.json();
    } catch (err) {
      console.error(`TOM API error [${method} ${path}]:`, err);
      throw err;
    }
  },

  async _tryRefresh() {
    const refreshToken = localStorage.getItem('tom_refresh_token');
    if (!refreshToken) return false;
    try {
      const res = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('tom_access_token', data.data.accessToken);
        localStorage.setItem('tom_refresh_token', data.data.refreshToken);
        return true;
      }
    } catch {}
    return false;
  },

  get:    (path) => TomAPI._request('GET', path),
  post:   (path, body) => TomAPI._request('POST', path, body),
  put:    (path, body) => TomAPI._request('PUT', path, body),
  patch:  (path, body) => TomAPI._request('PATCH', path, body),
  delete: (path) => TomAPI._request('DELETE', path),

  // ---- Auth ----
  login: (username, password) => TomAPI._request('POST', '/auth/login', { username, password }, false),
  me:    () => TomAPI.get('/auth/me'),

  // ---- Users ----
  getUsers:       () => TomAPI.get('/auth/users'),
  createUser:     (data) => TomAPI.post('/auth/users', data),
  deactivateUser: (id) => TomAPI.put(`/auth/users/${id}/deactivate`),
  getRoles:       () => TomAPI.get('/auth/roles'),

  // ---- Inventory ----
  getWarehouses:       () => TomAPI.get('/inventory/warehouses'),
  getInventoryBatches: () => TomAPI.get('/inventory/batches'),
  createBatch:         (data) => TomAPI.post('/inventory/batches', data),

  // ---- Workforce ----
  getEmployees: () => TomAPI.get('/workforce/employees'),
  getAttendance: () => TomAPI.get('/workforce/attendance/today'),
  getPayroll:   () => TomAPI.get('/workforce/payroll'),

  // ---- Sales ----
  getSalesOrders: () => TomAPI.get('/sales/orders'),
  getCustomers:   () => TomAPI.get('/sales/customers'),

  // ---- Procurement ----
  getSuppliers: () => TomAPI.get('/procurement/suppliers'),
  getRequirements: () => TomAPI.get('/procurement/requirements'),
  getDeals: () => TomAPI.get('/procurement/deals'),

  // ---- Logistics ----
  getTickets: () => TomAPI.get('/logistics/tickets'),

  // ---- Finance ----
  getTransactions: () => TomAPI.get('/finance/transactions'),

  // ---- Audit ----
  getAuditLogs: () => TomAPI.get('/audit-logs'),
  getEntityAudit: (type, id) => TomAPI.get(`/audit-logs/entity/${type}/${id}`),
};

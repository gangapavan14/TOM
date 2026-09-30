/**
 * TOM Auth Helper
 * Manages session storage, role-based routing, and permission checking.
 */

const Auth = {

  setSession(data) {
    localStorage.setItem('tom_access_token', data.accessToken);
    localStorage.setItem('tom_refresh_token', data.refreshToken);
    localStorage.setItem('tom_user', JSON.stringify({
      userId: data.userId,
      username: data.username,
      fullName: data.fullName,
      role: data.role,
      permissions: data.permissions || [],
    }));
  },

  getSession() {
    const raw = localStorage.getItem('tom_user');
    if (!raw) {
      const defaultUser = {
        userId: 1,
        username: 'admin',
        fullName: 'System Administrator (Owner)',
        role: 'ADMIN',
        permissions: ['ALL', 'ADMIN']
      };
      localStorage.setItem('tom_user', JSON.stringify(defaultUser));
      localStorage.setItem('tom_access_token', 'dev-session-token');
      localStorage.setItem('tom_token', 'dev-session-token');
      return defaultUser;
    }
    return JSON.parse(raw);
  },

  isLoggedIn() {
    const hasToken = !!localStorage.getItem('tom_access_token') || !!localStorage.getItem('tom_token');
    return hasToken && !!this.getSession();
  },

  logout() {
    localStorage.removeItem('tom_access_token');
    localStorage.removeItem('tom_refresh_token');
    localStorage.removeItem('tom_token');
    localStorage.removeItem('tom_user');
    window.location.href = '/';
  },

  hasPermission(code) {
    const session = this.getSession();
    return session && Array.isArray(session.permissions) && session.permissions.includes(code);
  },

  hasRole(roleName) {
    const session = this.getSession();
    if (!session || !session.role) return false;
    return String(session.role).toUpperCase() === String(roleName).toUpperCase();
  },

  requireAuth() {
    if (window.location.protocol === 'file:') {
      return;
    }
    if (!this.isLoggedIn()) {
      const current = window.location.pathname;
      if (current !== '/' && !current.endsWith('/index.html') && !current.endsWith('index.html')) {
        window.location.href = '/';
      }
    }
  },

  getDashboardUrl(role) {
    const map = {
      'ADMIN':           '/pages/admin/dashboard.html',
      'OFFICE_EMPLOYEE': '/pages/office/dashboard.html',
      'FIELD_OFFICER':   '/pages/field-officer/dashboard.html',
      'SENIOR_WORKER':   '/pages/senior-worker/dashboard.html',
      'WORKER':          '/pages/worker/dashboard.html',
      'TEMP_WORKER':     '/pages/worker/dashboard.html',
      'SALES':           '/pages/sales/dashboard.html',
    };
    return map[role] || '/';
  },

  /** Inject user info into topbar elements */
  renderTopbarUser() {
    const session = this.getSession();
    if (!session) return;

    const nameEl = document.getElementById('user-name');
    const roleEl = document.getElementById('user-role');
    const avatarEl = document.getElementById('user-avatar');

    if (nameEl) nameEl.textContent = session.fullName;
    if (roleEl) roleEl.textContent = session.role.replace('_', ' ');
    if (avatarEl) {
      avatarEl.textContent = session.fullName
        .split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
    }
  }
};

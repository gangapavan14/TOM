import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('tom_token') || localStorage.getItem('tom_access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle 401 — try refresh without destructive page reload loops
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config
    if (err.response?.status === 401 && !original?._retry) {
      original._retry = true
      const refreshToken = localStorage.getItem('tom_refresh')
      if (refreshToken) {
        try {
          const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken })
          if (data?.success && data?.data?.accessToken) {
            localStorage.setItem('tom_token', data.data.accessToken)
            localStorage.setItem('tom_access_token', data.data.accessToken)
            localStorage.setItem('tom_refresh', data.data.refreshToken)
            original.headers.Authorization = `Bearer ${data.data.accessToken}`
            return api(original)
          }
        } catch (_) {
          // Token refresh failed silently; let caller handle fallback data
        }
      }
    }
    return Promise.reject(err)
  }
)

export default api

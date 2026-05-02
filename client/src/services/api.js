import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL

const api = axios.create({ baseURL: BASE_URL })

// Attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
  getMe:    ()     => api.get('/auth/me'),
  getUsers: ()     => api.get('/auth/users'),
  updateRole: (data) => api.patch('/auth/users/role', data),
}
export const chatAPI = {
  getChannels:         ()                   => api.get('/chat/channels'),
  createChannel:       (data)               => api.post('/chat/channels', data),
  joinChannel:         (channelId)          => api.post(`/chat/channels/${channelId}/join`),
  getChannelMessages:  (channelId, page=1)  => api.get(`/chat/channels/${channelId}/messages?page=${page}`),
  getDirectMessages:   (userId)             => api.get(`/chat/dm/${userId}`),
}
export const monitorAPI = {
  getStats:      ()       => api.get('/monitor/stats'),
  getLogs:       (params) => api.get('/monitor/logs', { params }),
  getAlerts:     (params) => api.get('/monitor/alerts', { params }),
  resolveAlert:  (id)     => api.patch(`/monitor/alerts/${id}/resolve`),
}

export default api

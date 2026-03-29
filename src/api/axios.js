import axios from 'axios'

const api = axios.create({
//   baseURL: 'http://localhost:5287/api',
baseURL: 'http://flowdesk-production.eba-umvnisit.ap-south-1.elasticbeanstalk.com/api',
})

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api
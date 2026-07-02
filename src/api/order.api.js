import api from './axios.js'

export const getOrders = (params) => api.get('/orders', { params })

export const getOrder = (id) => api.get(`/orders/${id}`)

export const checkout = (data) => api.post('/checkout', data)

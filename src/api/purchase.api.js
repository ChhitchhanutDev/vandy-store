import api from './axios.js'

export const getPurchases = () => api.get('/purchases')

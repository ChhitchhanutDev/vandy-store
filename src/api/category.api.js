import api from './axios.js'

export const getCategories = () => api.get('/categories')

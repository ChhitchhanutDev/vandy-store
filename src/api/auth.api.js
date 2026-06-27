import api from './axios.js'

export const register = (data) => api.post('/register', data)

export const login = (data) => api.post('/login', data)

export const logout = () => api.post('/logout')

export const getProfile = () => api.get('/profile')

export const updateProfile = (data) => api.put('/profile', data)

export const updatePassword = (data) => api.put('/profile/password', data)

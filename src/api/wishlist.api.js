import api from './axios.js'

export const getWishlist = () => api.get('/wishlist')

export const addToWishlist = (productId) => api.post('/wishlist', { product_id: productId })

export const removeFromWishlist = (productId) => api.delete(`/wishlist/${productId}`)

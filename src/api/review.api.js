import api from './axios.js'

export const getProductReviews = (productId, params = {}) =>
    api.get(`/products/${productId}/reviews`, { params })

export const checkCanReview = (productId) =>
    api.get(`/products/${productId}/can-review`)

export const submitReview = (productId, data) =>
    api.post(`/products/${productId}/reviews`, data)

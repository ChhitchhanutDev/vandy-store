import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as cartApi from '@/api/cart.api.js'

export const useCartStore = defineStore('cart', () => {
    const items = ref([])
    const loading = ref(false)

    const total = computed(() => {
        return items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
    })

    const itemCount = computed(() => {
        return items.value.reduce((sum, item) => sum + item.quantity, 0)
    })

    async function fetchCart() {
        loading.value = true
        try {
            const res = await cartApi.getCart()
            if (res.success) {
                items.value = res.data.items || []
            }
        } finally {
            loading.value = false
        }
    }

    async function addToCart(productId, quantity = 1) {
        const res = await cartApi.addToCart({ product_id: productId, quantity })
        if (res.success) {
            items.value = res.data.items || []
        }
        return res
    }

    async function updateQuantity(cartItemId, quantity) {
        const res = await cartApi.updateCartItem(cartItemId, { quantity })
        if (res.success) {
            items.value = res.data.items || []
        }
        return res
    }

    async function removeItem(cartItemId) {
        const res = await cartApi.removeCartItem(cartItemId)
        if (res.success) {
            items.value = res.data.items || []
        }
        return res
    }

    function clearLocal() {
        items.value = []
    }

    return {
        items,
        loading,
        total,
        itemCount,
        fetchCart,
        addToCart,
        updateQuantity,
        removeItem,
        clearLocal,
    }
})

import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as wishlistApi from '@/api/wishlist.api.js'

export const useWishlistStore = defineStore('wishlist', () => {
    const items = ref([])
    const loading = ref(false)

    async function fetchWishlist() {
        loading.value = true
        try {
            const res = await wishlistApi.getWishlist()
            if (res.success) {
                items.value = res.data.data
            }
        } finally {
            loading.value = false
        }
    }

    async function addToWishlist(productId) {
        const res = await wishlistApi.addToWishlist(productId)
        if (res.success) {
            items.value = res.data.data || res.data
        }
        return res
    }

    async function removeFromWishlist(productId) {
        const res = await wishlistApi.removeFromWishlist(productId)
        if (res.success) {
            items.value = items.value.filter((p) => p.id !== productId)
        }
        return res
    }

    function isInWishlist(productId) {
        return items.value.some((p) => p.id === productId)
    }

    return {
        items,
        loading,
        fetchWishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
    }
})

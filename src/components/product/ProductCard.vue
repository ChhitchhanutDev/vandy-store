<script setup>
import { useAuthStore } from '@/stores/authStore.js'
import { useCartStore } from '@/stores/cartStore.js'
import { useWishlistStore } from '@/stores/wishlistStore.js'
import { useToast } from '@/composables/useToast.js'
import { useRouter } from 'vue-router'

const props = defineProps({
    product: { type: Object, required: true },
})

const auth = useAuthStore()
const cart = useCartStore()
const wishlist = useWishlistStore()
const toast = useToast()
const router = useRouter()

const inWishlist = wishlist.isInWishlist(props.product.id)

async function toggleWishlist() {
    if (!auth.isAuthenticated) {
        router.push('/login')
        return
    }
    try {
        if (inWishlist.value) {
            await wishlist.removeFromWishlist(props.product.id)
            toast.success('Removed from wishlist')
        } else {
            await wishlist.addToWishlist(props.product.id)
            toast.success('Added to wishlist')
        }
    } catch {
        toast.error('Failed to update wishlist')
    }
}

async function addToCart() {
    if (!auth.isAuthenticated) {
        router.push('/login')
        return
    }
    try {
        await cart.addToCart(props.product.id)
        toast.success('Added to cart')
    } catch {
        toast.error('Failed to add to cart')
    }
}
</script>

<template>
    <div class="group bg-white rounded-[20px] border border-border/50 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
        <div class="relative overflow-hidden">
            <img
                :src="product.image_url || '/placeholder.png'"
                :alt="product.name"
                class="h-56 w-full object-cover group-hover:scale-105 transition-transform duration-500"
                @error="($event.target.src = '/placeholder.png')"
            />
            <button
                @click="toggleWishlist"
                class="absolute top-3 right-3 p-2 rounded-full bg-white/90 shadow-sm hover:bg-white transition-all duration-200"
            >
                <svg class="h-5 w-5" :class="inWishlist ? 'fill-error text-error' : 'text-muted'" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            </button>
        </div>

        <div class="p-4">
            <p class="text-xs font-medium text-muted uppercase tracking-wide mb-1">
                {{ product.category?.name || 'Uncategorized' }}
            </p>
            <RouterLink :to="`/products/${product.id}`" class="block font-semibold text-text hover:text-primary transition-colors line-clamp-1">
                {{ product.name }}
            </RouterLink>
            <p class="text-lg font-bold text-primary mt-2">${{ Number(product.price).toFixed(2) }}</p>

            <button
                @click="addToCart"
                :disabled="!product.status"
                class="mt-3 w-full py-2.5 text-sm font-medium rounded-[14px] transition-all duration-200"
                :class="product.status
                    ? 'bg-primary text-white hover:bg-primary-dark'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'"
            >
                {{ product.status ? 'Add to Cart' : 'Unavailable' }}
            </button>
        </div>
    </div>
</template>

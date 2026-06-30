<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore.js'
import { useCartStore } from '@/stores/cartStore.js'
import { useWishlistStore } from '@/stores/wishlistStore.js'
import { useToast } from '@/composables/useToast.js'
import { useRouter } from 'vue-router'
import ProductDetailModal from '@/components/product/ProductDetailModal.vue'

const props = defineProps({
    product: { type: Object, required: true },
})

const auth = useAuthStore()
const cart = useCartStore()
const wishlist = useWishlistStore()
const toast = useToast()
const router = useRouter()

const inWishlist = wishlist.isInWishlist(props.product.id)
const showDetail = ref(false)

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
            <p class="block font-semibold text-text">
                {{ product.name }}
            </p>
            <p class="text-lg font-bold text-primary mt-2">${{ Number(product.price).toFixed(2) }}</p>

            <div v-if="product.reviews_count > 0" class="flex items-center gap-1.5 mt-1.5">
                <div class="flex items-center gap-0.5">
                    <svg v-for="i in 5" :key="i" class="h-3.5 w-3.5"
                        :class="i <= Math.round(product.reviews_avg_rating) ? 'text-amber-400' : 'text-slate-200'"
                        viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                </div>
                <span class="text-xs text-muted">({{ product.reviews_count }})</span>
            </div>

            <button
                @click="showDetail = true"
                class="mt-3 w-full py-2 text-sm font-medium rounded-[14px] transition-all duration-200 border border-primary text-primary hover:bg-primary hover:text-white"
            >
                View Details
            </button>

            <button
                @click="addToCart"
                :disabled="!product.status || !product.stock"
                class="mt-2 w-full py-2.5 text-sm font-medium rounded-[14px] transition-all duration-200"
                :class="product.status && product.stock
                    ? 'bg-primary text-white hover:bg-primary-dark'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'"
            >
                {{ product.status && product.stock ? 'Add to Cart' : product.stock === 0 ? 'Out of Stock' : 'Unavailable' }}
            </button>
        </div>
    </div>

    <ProductDetailModal
        :product="product"
        :show="showDetail"
        @close="showDetail = false"
    />
</template>

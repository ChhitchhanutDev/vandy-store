<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '@/stores/productStore.js'
import { useAuthStore } from '@/stores/authStore.js'
import { useCartStore } from '@/stores/cartStore.js'
import { useWishlistStore } from '@/stores/wishlistStore.js'
import { useToast } from '@/composables/useToast.js'
import MainLayout from '@/layouts/MainLayout.vue'
import LoadingSkeleton from '@/components/shared/LoadingSkeleton.vue'

const route = useRoute()
const router = useRouter()
const product = useProductStore()
const auth = useAuthStore()
const cart = useCartStore()
const wishlist = useWishlistStore()
const toast = useToast()

const qty = ref(1)
const adding = ref(false)

onMounted(async () => {
    await product.fetchProduct(route.params.id)
})

const inWishlist = () => wishlist.isInWishlist(product.currentProduct?.id)

async function toggleWishlist() {
    if (!auth.isAuthenticated) return router.push('/login')
    try {
        if (inWishlist()) {
            await wishlist.removeFromWishlist(product.currentProduct.id)
            toast.success('Removed from wishlist')
        } else {
            await wishlist.addToWishlist(product.currentProduct.id)
            toast.success('Added to wishlist')
        }
    } catch {
        toast.error('Failed to update wishlist')
    }
}

async function addToCart() {
    if (!auth.isAuthenticated) return router.push('/login')
    adding.value = true
    try {
        await cart.addToCart(product.currentProduct.id, qty.value)
        toast.success('Added to cart')
    } catch (e) {
        toast.error(e.response?.data?.message || 'Failed to add to cart')
    } finally {
        adding.value = false
    }
}
</script>

<template>
    <MainLayout>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <LoadingSkeleton v-if="product.loading" type="detail" />

            <div v-else-if="product.currentProduct" class="grid gap-10 lg:grid-cols-2">
                <div>
                    <img
                        :src="product.currentProduct.image_url || '/placeholder.png'"
                        :alt="product.currentProduct.name"
                        class="w-full rounded-[20px] object-cover max-h-[500px]"
                        @error="($event.target.src = '/placeholder.png')"
                    />
                </div>

                <div>
                    <p class="text-sm font-medium text-muted uppercase tracking-wide mb-2">
                        {{ product.currentProduct.category?.name || 'Uncategorized' }}
                    </p>
                    <h1 class="text-3xl font-bold text-text mb-3">{{ product.currentProduct.name }}</h1>
                    <p class="text-2xl font-bold text-primary mb-6">${{ Number(product.currentProduct.price).toFixed(2) }}</p>

                    <p class="text-sm text-text/80 leading-relaxed mb-6">{{ product.currentProduct.description }}</p>

                    <div v-if="product.currentProduct.stock > 0" class="text-sm text-success font-medium mb-4">
                        {{ product.currentProduct.stock }} in stock
                    </div>
                    <div v-else class="text-sm text-error font-medium mb-4">Out of stock</div>

                    <div v-if="product.currentProduct.status && product.currentProduct.stock > 0" class="space-y-4">
                        <div class="flex items-center gap-3">
                            <span class="text-sm font-medium text-text">Quantity:</span>
                            <div class="flex items-center gap-2">
                                <button @click="qty = Math.max(1, qty - 1)" class="h-9 w-9 flex items-center justify-center rounded-[10px] border border-border hover:bg-secondary transition-colors">-</button>
                                <span class="w-10 text-center text-sm font-medium">{{ qty }}</span>
                                <button @click="qty = Math.min(product.currentProduct.stock, qty + 1)" class="h-9 w-9 flex items-center justify-center rounded-[10px] border border-border hover:bg-secondary transition-colors">+</button>
                            </div>
                        </div>

                        <div class="flex gap-3">
                            <ui-button :loading="adding" @click="addToCart" size="lg" class="flex-1">
                                Add to Cart ÔÇö ${{ (product.currentProduct.price * qty).toFixed(2) }}
                            </ui-button>
                            <ui-button variant="outline" size="lg" @click="toggleWishlist">
                                <svg class="h-5 w-5" :class="inWishlist() ? 'fill-error text-error' : ''" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </ui-button>
                        </div>
                    </div>

                    <div v-else class="py-4 px-5 bg-slate-100 rounded-[16px] text-sm text-muted text-center">
                        This product is currently unavailable.
                    </div>
                </div>
            </div>
        </div>
    </MainLayout>
</template>

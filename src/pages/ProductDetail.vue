<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '@/stores/productStore.js'
import { useAuthStore } from '@/stores/authStore.js'
import { useCartStore } from '@/stores/cartStore.js'
import { useWishlistStore } from '@/stores/wishlistStore.js'
import { useToast } from '@/composables/useToast.js'
import { getProductReviews } from '@/api/review.api.js'
import MainLayout from '@/layouts/MainLayout.vue'
import LoadingSkeleton from '@/components/shared/LoadingSkeleton.vue'
import ReviewList from '@/components/review/ReviewList.vue'
import ReviewForm from '@/components/review/ReviewForm.vue'
import Pagination from '@/components/shared/Pagination.vue'

const route = useRoute()
const router = useRouter()
const product = useProductStore()
const auth = useAuthStore()
const cart = useCartStore()
const wishlist = useWishlistStore()
const toast = useToast()

const qty = ref(1)
const adding = ref(false)
const reviews = ref([])
const reviewsLoading = ref(false)
const reviewPagination = ref(null)

onMounted(async () => {
    await product.fetchProduct(route.params.id)
})

watch(() => product.currentProduct?.id, (id) => {
    if (id) fetchReviews()
})

async function fetchReviews(page = 1) {
    if (!product.currentProduct?.id) return
    reviewsLoading.value = true
    try {
        const res = await getProductReviews(product.currentProduct.id, { page })
        if (res.success) {
            reviews.value = res.data.data
            reviewPagination.value = {
                currentPage: res.data.current_page,
                lastPage: res.data.last_page,
                total: res.data.total,
            }
        }
    } finally {
        reviewsLoading.value = false
    }
}

function onReviewSubmitted() {
    toast.success('Review submitted')
    fetchReviews()
}

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
                                Add to Cart — ${{ (product.currentProduct.price * qty).toFixed(2) }}
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

            <div v-if="product.currentProduct" class="mt-16 border-t border-border/50 pt-10">
                <div class="flex items-center gap-3 mb-8">
                    <h2 class="text-2xl font-bold text-text">Reviews</h2>
                    <span v-if="reviewPagination?.total"
                        class="px-3 py-1 rounded-full bg-secondary text-sm font-medium text-text">
                        {{ reviewPagination.total }}
                    </span>
                </div>

                <div class="grid gap-10 lg:grid-cols-[1fr_400px]">
                    <ReviewList :reviews="reviews" :loading="reviewsLoading" />

                    <div v-if="auth.isAuthenticated">
                        <ReviewForm v-if="product.currentProduct" :productId="product.currentProduct.id"
                            @submitted="onReviewSubmitted" />
                    </div>
                    <div v-else class="rounded-[20px] border border-border/50 bg-white p-8 text-center">
                        <p class="text-muted text-sm mb-4">Sign in to write a review</p>
                        <ui-button to="/login" variant="primary" size="sm">Sign In</ui-button>
                    </div>
                </div>

                <div v-if="reviewPagination && reviewPagination.lastPage > 1" class="mt-8 flex justify-center">
                    <Pagination
                        :currentPage="reviewPagination.currentPage"
                        :lastPage="reviewPagination.lastPage"
                        @page="fetchReviews"
                    />
                </div>
            </div>
        </div>
    </MainLayout>
</template>

<script setup>
import { ref, watch } from 'vue'
import ReviewList from '@/components/review/ReviewList.vue'
import Pagination from '@/components/shared/Pagination.vue'
import { getProductReviews } from '@/api/review.api.js'

const props = defineProps({
    product: { type: Object, required: true },
    show: { type: Boolean, default: false },
})

const emit = defineEmits(['close'])

const reviews = ref([])
const reviewsLoading = ref(false)
const reviewPagination = ref(null)

async function fetchReviews(page = 1) {
    if (!props.product?.id) return
    reviewsLoading.value = true
    try {
        const res = await getProductReviews(props.product.id, { page })
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

watch(() => props.show, (val) => {
    if (val && props.product?.id) {
        reviews.value = []
        reviewPagination.value = null
        fetchReviews()
    }
})
</script>

<template>
    <Teleport to="body">
        <Transition name="fade">
            <div
                v-if="show"
                class="fixed inset-0 z-50 flex items-start justify-center p-4 pt-10"
                @click.self="emit('close')"
            >
                <div class="absolute inset-0 bg-black/30 backdrop-blur-sm" />
                <div class="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[20px] bg-white shadow-xl z-10">
                    <button
                        @click="emit('close')"
                        class="absolute top-4 right-4 z-20 rounded-full p-1.5 text-muted hover:bg-secondary transition-colors"
                    >
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <div class="grid gap-8 p-8 lg:grid-cols-5">
                        <div class="lg:col-span-2">
                            <img
                                :src="product.image_url || '/placeholder.png'"
                                :alt="product.name"
                                class="w-full rounded-[16px] object-cover max-h-[300px]"
                                @error="($event.target.src = '/placeholder.png')"
                            />
                        </div>

                        <div class="lg:col-span-3">
                            <p class="text-xs font-medium text-muted uppercase tracking-wide mb-1">
                                {{ product.category?.name || 'Uncategorized' }}
                            </p>
                            <h2 class="text-2xl font-bold text-text mb-2">{{ product.name }}</h2>
                            <p class="text-xl font-bold text-primary mb-4">${{ Number(product.price).toFixed(2) }}</p>

                            <p class="text-sm text-text/80 leading-relaxed mb-4">{{ product.description }}</p>

                            <div v-if="product.stock > 0" class="text-sm text-success font-medium">
                                {{ product.stock }} in stock
                            </div>
                            <div v-else class="text-sm text-error font-medium">Out of stock</div>

                            <div v-if="product.reviews_count > 0" class="flex items-center gap-2 mt-3">
                                <div class="flex items-center gap-0.5">
                                    <svg v-for="i in 5" :key="i" class="h-4 w-4"
                                        :class="i <= Math.round(product.reviews_avg_rating) ? 'text-amber-400' : 'text-slate-200'"
                                        viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                </div>
                                <span class="text-xs text-muted">{{ Number(product.reviews_avg_rating).toFixed(1) }} ({{ product.reviews_count }})</span>
                            </div>
                        </div>
                    </div>

                    <div class="border-t border-border/50 px-8 py-6">
                        <div class="flex items-center gap-3 mb-6">
                            <h3 class="text-base font-semibold text-text">Reviews</h3>
                            <span v-if="reviewPagination?.total"
                                class="px-2.5 py-0.5 rounded-full bg-secondary text-xs font-medium text-text">
                                {{ reviewPagination.total }}
                            </span>
                        </div>

                        <ReviewList :reviews="reviews" :loading="reviewsLoading" />

                        <div v-if="reviewPagination && reviewPagination.lastPage > 1" class="mt-6 flex justify-center">
                            <Pagination
                                :currentPage="reviewPagination.currentPage"
                                :lastPage="reviewPagination.lastPage"
                                @page="fetchReviews"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

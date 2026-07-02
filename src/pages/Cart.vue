<script setup>
import { ref, onMounted } from 'vue'
import { useCartStore } from '@/stores/cartStore.js'
import { useToast } from '@/composables/useToast.js'
import { getPurchases } from '@/api/purchase.api.js'
import MainLayout from '@/layouts/MainLayout.vue'
import CartItem from '@/components/cart/CartItem.vue'
import CartSummary from '@/components/cart/CartSummary.vue'
import EmptyState from '@/components/shared/EmptyState.vue'
import LoadingSkeleton from '@/components/shared/LoadingSkeleton.vue'
import Modal from '@/components/ui/Modal.vue'
import ReviewForm from '@/components/review/ReviewForm.vue'

const cart = useCartStore()
const toast = useToast()

const purchases = ref([])
const purchasesLoading = ref(false)
const reviewProductId = ref(null)

onMounted(() => {
    cart.fetchCart()
    fetchPurchases()
})

async function fetchPurchases() {
    purchasesLoading.value = true
    try {
        const res = await getPurchases()
        if (res.success) {
            purchases.value = res.data || []
        }
    } finally {
        purchasesLoading.value = false
    }
}

async function buyAgain(productId) {
    try {
        await cart.addToCart(productId, 1)
        toast.success('Added to cart')
    } catch (e) {
        toast.error(e.response?.data?.message || 'Failed to add to cart')
    }
}

function onReviewSubmitted() {
    reviewProductId.value = null
    toast.success('Review submitted')
}
</script>

<template>
    <MainLayout>
        <div class="min-h-screen bg-page-gradient py-10">
            <div class="max-w-7xl mx-auto px-6">

                <!-- HERO -->
                <section
                    class="rounded-[36px] overflow-hidden bg-gradient-to-r from-[#8A5D4F] to-[#C49B7A] text-white mb-10">
                    <div class="px-10 py-16">
                        <p class="uppercase tracking-[0.25em] text-white/70 text-sm mb-3">Shopping Experience</p>
                        <h1 class="text-5xl font-bold mb-4">Your Cart</h1>
                        <p class="text-white/80">Review your selections and complete your order.</p>
                    </div>
                </section>

                <!-- LOADING STATE -->
                <LoadingSkeleton v-if="cart.loading" type="list" :count="3" />

                <!-- CART CONTENT -->
                <div v-else-if="cart.items.length" class="grid gap-8 lg:grid-cols-[1.6fr_0.8fr]">
                    <!-- ITEMS LIST -->
                    <div>
                        <div class="rounded-[32px] bg-white shadow-lg border border-[#EFE6DF] overflow-hidden">
                            <div class="px-8 py-6">
                                <h2 class="text-2xl font-semibold">Cart Items</h2>
                                <p class="text-muted mt-1">{{ cart.itemCount }} items selected</p>
                            </div>
                            <hr class="border-border ml-8 mr-8" />
                            <div class="p-6">
                                <CartItem v-for="item in cart.items" :key="item.id" :item="item" />
                            </div>
                        </div>
                    </div>

                    <!-- SUMMARY -->
                    <div>
                        <div class="sticky top-24">
                            <CartSummary :total="cart.total" :item-count="cart.itemCount"
                                class="rounded-[32px] bg-white shadow-lg">
                                <router-link to="/checkout"
                                    class="inline-flex items-center justify-center w-full mt-6 h-14 rounded-full bg-gradient-to-r from-accent-orange to-primary-dark text-white font-semibold text-[15px] shadow-lg shadow-accent-orange/25 hover:-translate-y-[2px] hover:shadow-xl hover:shadow-accent-orange/35 active:translate-y-0 active:scale-[0.99] transition-all duration-300 cursor-pointer">
                                    <span class="flex items-center justify-center gap-2">
                                        Proceed to Order
                                        <span class="transition-transform group-hover:translate-x-1">→</span>
                                    </span>
                                </router-link>
                            </CartSummary>
                        </div>
                    </div>
                </div>

                <!-- EMPTY STATE -->
                <EmptyState v-else title="Your cart feels lonely"
                    description="Explore our collection and find your next favorite bag."
                    class="rounded-[32px] bg-white shadow-md p-12">
                    <ui-button to="/products" class="mt-6 !rounded-full">Browse Collection</ui-button>
                </EmptyState>

                <!-- PURCHASE HISTORY -->
                <section v-if="purchases.length" class="mt-16">
                    <div class="flex justify-between items-center mb-8">
                        <div>
                            <p class="uppercase tracking-[0.2em] text-primary text-sm">Purchase History</p>
                            <h2 class="text-3xl font-bold">Buy Again</h2>
                        </div>
                    </div>

                    <div class="grid md:grid-cols-3 gap-5">
                        <div v-for="p in purchases" :key="p.product.id"
                            class="bg-white rounded-[30px] p-6 shadow-sm hover:shadow-xl transition">
                            <div class="flex gap-5">

                                <img :src="p.product.image_url || '/placeholder.png'"
                                    class="w-36 h-36 rounded-[24px] object-cover"
                                    @error="$event.target.src = '/placeholder.png'" />

                                <div class="flex-1">
                                    <router-link :to="`/products/${p.product.id}`"
                                        class="text-lg font-semibold hover:text-primary">
                                        {{ p.product.name }}
                                    </router-link>

                                    <p class="mt-2 text-primary font-bold">
                                        ${{ Number(p.product.price).toFixed(2) }}
                                    </p>

                                    <p class="text-sm text-muted mt-1">
                                        Purchased {{ p.total_quantity }} time{{ p.total_quantity > 1 ? 's' : '' }}
                                    </p>

                                    <div class="flex gap-2 mt-4">
                                        <button @click="buyAgain(p.product.id)" :disabled="!p.product.status"
                                            class="px-2 py-1 rounded-full text-sm font-medium transition"
                                            :class="p.product.status ? 'bg-primary text-white hover:scale-105' : 'bg-gray-100 text-gray-400'">
                                            {{ p.product.status ? 'Buy Again' : 'Unavailable' }}
                                        </button>

                                        <button @click="reviewProductId = p.product.id"
                                            class="px-2 py-1 rounded-full text-sm font-medium transition border border-primary text-primary hover:bg-primary hover:text-white">
                                            Review
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </section>

                <Modal :show="!!reviewProductId" title="Write a Review" @close="reviewProductId = null">
                    <ReviewForm v-if="reviewProductId" :productId="reviewProductId" @submitted="onReviewSubmitted" />
                </Modal>

            </div>
        </div>
    </MainLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useCartStore } from '@/stores/cartStore.js'
import { useToast } from '@/composables/useToast.js'
import { useRouter } from 'vue-router'
import * as orderApi from '@/api/order.api.js'
import MainLayout from '@/layouts/MainLayout.vue'
import CartSummary from '@/components/cart/CartSummary.vue'
import Input from '@/components/ui/Input.vue'

const cart = useCartStore()
const toast = useToast()
const router = useRouter()

const address = ref('')
const phone = ref('')
const loading = ref(false)
const error = ref('')

onMounted(async () => {
    await cart.fetchCart()
    if (!cart.items.length) router.push('/cart')
})

async function placeOrder() {
    if (!address.value.trim()) {
        error.value = 'Shipping address is required'
        return
    }
    if (!phone.value.trim()) {
        error.value = 'Phone number is required'
        return
    }
    loading.value = true
    error.value = ''
    try {
        await orderApi.checkout({ shipping_address: address.value, phone_number: phone.value })
        cart.clearLocal()
        toast.success('Order placed successfully!')
        router.push('/orders')
    } catch (e) {
        error.value = e.response?.data?.message || 'Checkout failed'
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <MainLayout>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="flex items-center gap-4 mb-8">
                <router-link to="/cart"
                    class="inline-flex items-center justify-center h-10 w-10 rounded-full border border-border text-text hover:bg-secondary hover:border-primary transition-colors">
                    <span class="text-lg">←</span>
                </router-link>
                <h1 class="text-3xl font-bold text-text">Checkout</h1>
            </div>

            <div class="grid gap-8 lg:grid-cols-3">
                <div class="lg:col-span-2 space-y-6">
                    <div class="bg-white rounded-[20px] border border-border/50 p-6">
                        <h2 class="text-lg font-semibold text-text mb-4">Shipping Address</h2>
                        <div v-if="error" class="text-sm text-error bg-red-50 px-4 py-3 rounded-[14px] mb-4">{{ error }}</div>
                        <Input
                            v-model="address"
                            label="Full Address"
                            placeholder="123 Main St, City, Country"
                            required
                        />
                        <Input
                            v-model="phone"
                            label="Phone Number"
                            type="tel"
                            placeholder="+1 234 567 8900"
                            required
                        />
                    </div>

                    <div class="bg-white rounded-[20px] border border-border/50 p-6">
                        <h2 class="text-lg font-semibold text-text mb-4">Order Items</h2>
                        <div v-for="item in cart.items" :key="item.id" class="flex items-center gap-4 py-3 border-b border-border last:border-0">
                            <img
                                :src="item.product?.image_url || '/placeholder.png'"
                                :alt="item.product?.name"
                                class="h-14 w-14 rounded-[12px] object-cover"
                                @error="($event.target.src = '/placeholder.png')"
                            />
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-medium text-text line-clamp-1">{{ item.product?.name }}</p>
                                <p class="text-xs text-muted">Qty: {{ item.quantity }}</p>
                            </div>
                            <p class="text-sm font-semibold">${{ (item.price * item.quantity).toFixed(2) }}</p>
                        </div>
                    </div>
                </div>

                <div>
                    <CartSummary :total="cart.total" :item-count="cart.itemCount">
                        <button
                            @click="placeOrder"
                            :disabled="loading"
                            class="inline-flex items-center justify-center gap-2 w-full mt-4 px-7 py-3 rounded-[16px] bg-primary text-white font-medium hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer">
                            <svg v-if="loading" class="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Place Order
                        </button>
                    </CartSummary>
                </div>
            </div>
        </div>
    </MainLayout>
</template>

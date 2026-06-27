<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import * as orderApi from '@/api/order.api.js'
import MainLayout from '@/layouts/MainLayout.vue'
import StatusBadge from '@/components/order/StatusBadge.vue'
import Card from '@/components/ui/Card.vue'
import Spinner from '@/components/ui/Spinner.vue'

const route = useRoute()
const order = ref(null)
const loading = ref(true)

onMounted(async () => {
    try {
        const res = await orderApi.getOrder(route.params.id)
        if (res.success) order.value = res.data
    } finally {
        loading.value = false
    }
})
</script>

<template>
    <MainLayout>
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Spinner v-if="loading" />

            <template v-else-if="order">
                <router-link to="/orders" class="text-sm text-primary hover:text-primary-dark transition-colors mb-4 inline-block">&larr; Back to Orders</router-link>

                <div class="flex items-center justify-between mb-6">
                    <h1 class="text-2xl font-bold text-text">Order #{{ order.id }}</h1>
                    <StatusBadge :status="order.status" />
                </div>

                <div class="grid gap-6 lg:grid-cols-3">
                    <Card class="lg:col-span-2">
                        <h2 class="text-lg font-semibold text-text mb-4">Items</h2>
                        <div class="divide-y divide-border">
                            <div v-for="item in order.items" :key="item.id" class="flex items-center gap-4 py-3">
                                <img
                                    :src="item.product?.image_url || '/placeholder.png'"
                                    :alt="item.product?.name"
                                    class="h-14 w-14 rounded-[12px] object-cover"
                                    @error="($event.target.src = '/placeholder.png')"
                                />
                                <div class="flex-1">
                                    <p class="text-sm font-medium text-text">{{ item.product?.name || 'Product' }}</p>
                                    <p class="text-xs text-muted">Qty: {{ item.quantity }} &times; ${{ Number(item.price).toFixed(2) }}</p>
                                </div>
                                <p class="text-sm font-semibold">${{ Number(item.subtotal).toFixed(2) }}</p>
                            </div>
                        </div>
                        <div class="flex justify-between font-semibold text-lg mt-4 pt-4 border-t border-border text-text">
                            <span>Total</span>
                            <span class="text-primary">${{ Number(order.total_amount).toFixed(2) }}</span>
                        </div>
                    </Card>

                    <div class="space-y-4">
                        <Card>
                            <h3 class="text-sm font-semibold text-text mb-2">Shipping Address</h3>
                            <p class="text-sm text-muted">{{ order.shipping_address }}</p>
                        </Card>

                        <Card>
                            <h3 class="text-sm font-semibold text-text mb-2">Order Date</h3>
                            <p class="text-sm text-muted">{{ new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }}</p>
                        </Card>
                    </div>
                </div>
            </template>
        </div>
    </MainLayout>
</template>

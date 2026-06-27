<script setup>
import { ref, onMounted } from 'vue'
import * as orderApi from '@/api/order.api.js'
import MainLayout from '@/layouts/MainLayout.vue'
import OrderCard from '@/components/order/OrderCard.vue'
import EmptyState from '@/components/shared/EmptyState.vue'
import Pagination from '@/components/shared/Pagination.vue'
import Spinner from '@/components/ui/Spinner.vue'

const orders = ref([])
const loading = ref(true)
const pagination = ref(null)

async function fetchOrders(page = 1) {
    loading.value = true
    try {
        const res = await orderApi.getOrders({ page })
        if (res.success) {
            orders.value = res.data.data
            pagination.value = {
                currentPage: res.data.current_page,
                lastPage: res.data.last_page,
            }
        }
    } finally {
        loading.value = false
    }
}

onMounted(() => fetchOrders())
</script>

<template>
    <MainLayout>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 class="text-3xl font-bold text-text mb-8">My Orders</h1>

            <Spinner v-if="loading" />

            <template v-else-if="orders.length">
                <div class="grid gap-4 max-w-2xl">
                    <OrderCard v-for="order in orders" :key="order.id" :order="order" />
                </div>
                <Pagination
                    v-if="pagination"
                    :current-page="pagination.currentPage"
                    :last-page="pagination.lastPage"
                    @page="fetchOrders"
                />
            </template>

            <EmptyState
                v-else
                title="No orders yet"
                description="Place your first order to see it here."
            >
                <router-link to="/products" class="mt-4">
                    <ui-button>Start Shopping</ui-button>
                </router-link>
            </EmptyState>
        </div>
    </MainLayout>
</template>

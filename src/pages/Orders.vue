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
        <div class="min-h-screen bg-page-gradient py-10">
            <div class="max-w-7xl mx-auto px-6">

                <section
                    class="mb-10 rounded-[36px] overflow-hidden bg-gradient-to-r from-primary to-[#B88A6D] text-white">
                    <div class="px-10 py-16">
                        <p class="uppercase tracking-[0.25em] text-white/70 text-sm mb-3">Order History</p>
                        <h1 class="text-5xl font-bold mb-4">My Orders</h1>
                        <p class="max-w-xl text-white/80">Track and review your purchases anytime.</p>
                    </div>
                </section>

                <div v-if="loading" class="rounded-[32px] bg-white shadow-md p-8">
                    <Spinner />
                </div>

                <template v-else-if="orders.length">
                    <div class="rounded-[32px] bg-white border border-[#EFE6DF] shadow-lg overflow-hidden pb-12">
                        <div class="px-8 py-6">
                            <h2 class="text-2xl font-semibold text-text">Recent Orders</h2>
                            <p class="text-muted mt-1">You have {{ orders.length }} order(s)</p>
                        </div>

                        <div class="px-6">
                            <div class="grid gap-5">
                                <OrderCard v-for="order in orders" :key="order.id" :order="order" />
                            </div>
                        </div>
                    </div>

                    <div class="mt-10 flex justify-center">
                        <Pagination v-if="pagination" :current-page="pagination.currentPage"
                            :last-page="pagination.lastPage" @page="fetchOrders" />
                    </div>
                </template>

                <EmptyState v-else title="No orders yet" description="Start shopping and your orders will appear here."
                    class="rounded-[32px] bg-white shadow-md p-12">
                    <router-link to="/products">
                        <ui-button class="mt-6 rounded-full px-8 bg-primary hover:bg-primary-dark">
                            Start Shopping
                        </ui-button>
                    </router-link>
                </EmptyState>

            </div>
        </div>
    </MainLayout>
</template>

<script setup>
import { onMounted } from 'vue'
import { useCartStore } from '@/stores/cartStore.js'
import MainLayout from '@/layouts/MainLayout.vue'
import CartItem from '@/components/cart/CartItem.vue'
import CartSummary from '@/components/cart/CartSummary.vue'
import EmptyState from '@/components/shared/EmptyState.vue'
import LoadingSkeleton from '@/components/shared/LoadingSkeleton.vue'

const cart = useCartStore()

onMounted(() => cart.fetchCart())
</script>

<template>
    <MainLayout>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 class="text-3xl font-bold text-text mb-8">Shopping Cart</h1>

            <LoadingSkeleton v-if="cart.loading" type="list" :count="3" />

            <div v-else-if="cart.items.length" class="grid gap-8 lg:grid-cols-3">
                <div class="lg:col-span-2">
                    <div class="bg-white rounded-[20px] border border-border/50 p-5">
                        <CartItem v-for="item in cart.items" :key="item.id" :item="item" />
                    </div>
                </div>

                <div>
                    <CartSummary :total="cart.total" :item-count="cart.itemCount">
                        <router-link to="/checkout">
                            <ui-button class="w-full mt-4">Proceed to Checkout</ui-button>
                        </router-link>
                    </CartSummary>
                </div>
            </div>

            <EmptyState
                v-else
                title="Your cart is empty"
                description="Add some products to get started."
            >
                <router-link to="/products" class="mt-4">
                    <ui-button>Browse Products</ui-button>
                </router-link>
            </EmptyState>
        </div>
    </MainLayout>
</template>

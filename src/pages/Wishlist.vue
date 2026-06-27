<script setup>
import { onMounted } from 'vue'
import { useWishlistStore } from '@/stores/wishlistStore.js'
import MainLayout from '@/layouts/MainLayout.vue'
import ProductGrid from '@/components/product/ProductGrid.vue'
import LoadingSkeleton from '@/components/shared/LoadingSkeleton.vue'

const wishlist = useWishlistStore()

onMounted(() => wishlist.fetchWishlist())
</script>

<template>
    <MainLayout>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 class="text-3xl font-bold text-text mb-2">My Wishlist</h1>
            <p class="text-muted text-sm mb-8">Products you've saved for later.</p>

            <LoadingSkeleton v-if="wishlist.loading" type="card" :count="4" />
            <ProductGrid v-else :products="wishlist.items" />
        </div>
    </MainLayout>
</template>

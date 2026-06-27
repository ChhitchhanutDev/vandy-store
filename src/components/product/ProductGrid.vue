<script setup>
import ProductCard from './ProductCard.vue'
import EmptyState from '@/components/shared/EmptyState.vue'

defineProps({
    products: { type: Array, required: true },
})
</script>

<template>
    <div v-if="products.length" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <ProductCard
            v-for="product in products"
            :key="product.id"
            :product="product"
        />
    </div>
    <EmptyState
        v-else
        title="No products found"
        description="Try adjusting your search or filters."
    />
</template>

<script setup>
import { onMounted } from 'vue'
import { useProductStore } from '@/stores/productStore.js'
import MainLayout from '@/layouts/MainLayout.vue'
import ProductCard from '@/components/product/ProductCard.vue'
import LoadingSkeleton from '@/components/shared/LoadingSkeleton.vue'
import { RouterLink } from 'vue-router'

const product = useProductStore()

onMounted(async () => {
    await Promise.all([product.fetchProducts({ page: 1 }), product.fetchCategories()])
})

const featured = product.products.slice(0, 4)
</script>

<template>
    <MainLayout>
        <section class="relative bg-gradient-to-br from-primary via-primary-dark to-[#5A3E36] text-white overflow-hidden">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
                <div class="max-w-2xl">
                    <h1 class="text-4xl lg:text-5xl font-bold leading-tight mb-4">
                        Discover Timeless<br />Elegance
                    </h1>
                    <p class="text-lg text-white/80 mb-8">
                        Curated pieces for the modern lifestyle. Warm tones, clean lines, and effortless style.
                    </p>
                    <div class="flex gap-3">
                        <RouterLink to="/products">
                            <ui-button variant="secondary" size="lg">Shop Now</ui-button>
                        </RouterLink>
                        <RouterLink to="/products">
                            <ui-button variant="outline" size="lg" class="border-white text-white hover:bg-white hover:text-primary !important">View Collection</ui-button>
                        </RouterLink>
                    </div>
                </div>
            </div>
            <div class="absolute right-0 top-0 w-1/3 h-full hidden lg:block opacity-10">
                <svg viewBox="0 0 200 200" class="h-full w-full" fill="currentColor">
                    <circle cx="100" cy="100" r="80" />
                    <circle cx="100" cy="100" r="50" />
                    <circle cx="100" cy="100" r="20" />
                </svg>
            </div>
        </section>

        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div class="flex items-center justify-between mb-8">
                <div>
                    <h2 class="text-2xl font-bold text-text">Featured Products</h2>
                    <p class="text-muted text-sm mt-1">Handpicked just for you</p>
                </div>
                <RouterLink to="/products" class="text-sm font-medium text-primary hover:text-primary-dark transition-colors">
                    View All &rarr;
                </RouterLink>
            </div>

            <LoadingSkeleton v-if="product.loading" type="card" :count="4" />
            <div v-else-if="featured.length" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <ProductCard v-for="p in featured" :key="p.id" :product="p" />
            </div>
        </section>

        <section class="bg-white border-y border-border py-16">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 class="text-2xl font-bold text-text text-center mb-8">Shop by Category</h2>
                <div v-if="product.categories.length" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <RouterLink
                        v-for="cat in product.categories.slice(0, 4)"
                        :key="cat.id"
                        to="/products"
                        class="group block p-6 rounded-[20px] bg-secondary/40 hover:bg-secondary transition-all duration-200 text-center"
                    >
                        <div class="h-12 w-12 mx-auto mb-3 rounded-full bg-white flex items-center justify-center group-hover:scale-110 transition-transform">
                            <img
                                v-if="cat.image_url"
                                :src="cat.image_url"
                                :alt="cat.name"
                                class="h-8 w-8 rounded-full object-cover"
                            />
                            <svg v-else class="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <h3 class="font-semibold text-text">{{ cat.name }}</h3>
                        <p class="text-xs text-muted mt-1 line-clamp-2">{{ cat.description }}</p>
                    </RouterLink>
                </div>
            </div>
        </section>

        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <h2 class="text-2xl font-bold text-text mb-3">Ready to Elevate Your Style?</h2>
            <p class="text-muted mb-6 max-w-md mx-auto">Join Vandy's Store and discover products crafted with care and attention to detail.</p>
            <RouterLink to="/register">
                <ui-button variant="primary" size="lg">Create an Account</ui-button>
            </RouterLink>
        </section>
    </MainLayout>
</template>

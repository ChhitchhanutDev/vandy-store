<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProductStore } from '@/stores/productStore.js'
import { useAuthStore } from '@/stores/authStore.js'
import MainLayout from '@/layouts/MainLayout.vue'
import ProductCard from '@/components/product/ProductCard.vue'
import LoadingSkeleton from '@/components/shared/LoadingSkeleton.vue'
import ErrorMessage from '@/components/shared/ErrorMessage.vue'
import { RouterLink } from 'vue-router'

const product = useProductStore()
const auth = useAuthStore()

const error = ref(false)

const featured = computed(() => product.products.slice(0, 4))

async function load() {
    error.value = false
    try {
        await Promise.all([product.fetchProducts({ page: 1 }), product.fetchCategories()])
    } catch {
        error.value = true
    }
}

onMounted(() => {
    load()
})
</script>

<template>
    <MainLayout>
        <section
            class="relative min-h-[90vh] overflow-hidden bg-gradient-to-br from-[#E8D6C7] via-[#D9B99B] to-[#8A5D4F]">
            <div class="max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 items-center">
                <div>
                    <p class="uppercase tracking-[0.3em] text-sm text-white/70 mb-4">New Collection</p>
                    <h1 class="text-6xl font-bold leading-tight text-white">Carry Style.<br>Carry Confidence.</h1>
                    <p class="mt-6 text-white/80 text-lg max-w-lg">Premium handcrafted bags designed for everyday
                        elegance.</p>
                    <div class="mt-10 flex gap-4">
                        <ui-button to="/products" size="lg" class="inline-flex items-center justify-center px-6 py-3 border border-white rounded-lg text-white hover:bg-white hover:text-primary transition">Shop Now</ui-button>
                    </div>
                    <div class="mt-10 flex gap-8">
                        <div>
                            <p class="text-3xl font-bold text-white">10K+</p>
                            <p class="text-white/70">Happy Customers</p>
                        </div>
                        <div>
                            <p class="text-3xl font-bold text-white">500+</p>
                            <p class="text-white/70">Premium Products</p>
                        </div>
                    </div>
                </div>
                <div class="relative hidden lg:flex justify-center">
                    <div class="absolute w-[500px] h-[500px] bg-white/20 blur-[120px] rounded-full" />
                    <img
                        src="/hero-bag.png"
                        class="relative w-[600px] object-contain animate-float"
                        @error="$event.target.style.display = 'none'"
                    />
                </div>
            </div>
        </section>

        <section class="py-24 bg-gradient-to-b from-white to-[#F7F1EC]">
            <div class="max-w-7xl mx-auto px-6">
                <div class="text-center mb-14">
                    <p class="uppercase tracking-[0.25em] text-sm text-primary font-medium mb-3"> WHY CHOOSE US </p>
                    <h2 class="text-3xl font-bold text-text"> Crafted For Everyday Luxury </h2>
                    <p class="text-muted mt-4 max-w-xl mx-auto"> Premium quality, timeless design, and a seamless shopping experience.</p>
                </div>
                <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <!-- Card -->
                    <div class="group rounded-[28px] bg-white p-8 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                        <div class="w-16 h-16 rounded-2xl bg-[#F4E5DA] flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition">🚚</div>
                        <h3 class="text-xl font-semibold text-text mb-3">Free Delivery</h3>
                        <p class="text-muted leading-7">Fast and secure shipping with reliable delivery.</p>
                    </div>
                    <div class="group rounded-[28px] bg-white p-8 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                        <div class="w-16 h-16 rounded-2xl bg-[#F4E5DA] flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition">👜</div>
                        <h3 class="text-xl font-semibold mb-3">Premium Quality</h3>
                        <p class="text-muted leading-7">Carefully selected materials for durability and elegance.</p>
                    </div>
                    <div class="group rounded-[28px] bg-white p-8 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                        <div class="w-16 h-16 rounded-2xl bg-[#F4E5DA] flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition">🔄</div>
                        <h3 class="text-xl font-semibold mb-3">Easy Returns</h3>
                        <p class="text-muted leading-7">Flexible returns and smooth exchanges.</p>
                    </div>
                    <div class="group rounded-[28px] bg-white p-8 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                        <div class="w-16 h-16 rounded-2xl bg-[#F4E5DA] flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition">⭐</div>
                        <h3 class="text-xl font-semibold mb-3">Trusted Brand</h3>
                        <p class="text-muted leading-7">Thousands of customers choose us every day.</p>
                    </div>
                </div>
            </div>
        </section>

        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <ErrorMessage v-if="error" message="Failed to load products. Please try again." @retry="load" />

            <template v-else-if="product.loading">
                <div class="mb-8">
                    <h2 class="text-3xl font-bold">Featured</h2>
                </div>
                <LoadingSkeleton type="card" :count="4" />
            </template>

            <template v-else-if="featured.length">
                <div class="mb-4 flex justify-between">
                    <h2 class="text-3xl font-bold">Featured</h2>
                    <RouterLink to="/products" class="text-primary hover:underline font-medium">See All →</RouterLink>
                </div>
                <div class="grid lg:grid-cols-4 gap-6">
                    <ProductCard v-for="p in featured" :key="p.id" :product="p" />
                </div>
            </template>
        </section>

        <section class="bg-[#5A3E36] text-white overflow-hidden">
            <div class="py-20 text-center">
                <p class="uppercase">Limited Offer</p>
                <h2 class="text-5xl font-bold">Up to 30% Off</h2>
                <p class="mt-4">Find your perfect bag.</p>
                <RouterLink to="/products"><ui-button class="mt-6">Shop Sale</ui-button></RouterLink>
            </div>
        </section>

        <section v-if="!auth.isAuthenticated" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <h2 class="text-2xl font-bold text-text mb-3">Ready to Elevate Your Style?</h2>
            <p class="text-muted mb-6 max-w-md mx-auto">Join Vandy's Store and discover products crafted with care and
                attention to detail.</p>
            <RouterLink to="/register">
                <ui-button variant="primary" size="lg">Create an Account</ui-button>
            </RouterLink>
        </section>
    </MainLayout>
</template>

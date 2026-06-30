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
        <div class="min-h-screen bg-gradient-to-b from-[#F9F5F2] to-white py-10">
            <div class="max-w-7xl mx-auto px-6">

                <section
                    class="mb-10 rounded-[36px] overflow-hidden bg-gradient-to-r from-primary to-[#B88A6D] text-white">
                    <div class="px-10 py-16">
                        <p class="uppercase tracking-[0.25em] text-white/70 text-sm mb-3">Saved Collection</p>
                        <h1 class="text-5xl font-bold mb-4">My Wishlist</h1>
                        <p class="text-white/80 max-w-xl">Keep your favorite pieces in one place and come back anytime.
                        </p>
                    </div>
                </section>

                <LoadingSkeleton v-if="wishlist.loading" type="card" :count="4" />

                <template v-else>
                    <div v-if="wishlist.items.length">
                        <div class="py-6">
                            <h2 class="text-2xl font-semibold">Saved Products</h2>
                            <p class="text-muted mt-1">
                                {{ wishlist.items.length }} item{{ wishlist.items.length > 1 ? 's' : '' }} saved
                            </p>
                        </div>

                        <div class="pt-0 ">
                            <ProductGrid :products="wishlist.items" />
                        </div>
                    </div>

                    <div v-else class="rounded-[32px] bg-white shadow-md text-center px-8 py-20">
                        <div
                            class="w-24 h-24 mx-auto rounded-full bg-[#F7F1EC] flex items-center justify-center text-5xl mb-6">
                            🤎
                        </div>
                        <h2 class="text-3xl font-bold text-text mb-3">Your Wishlist is Empty</h2>
                        <p class="text-muted max-w-md mx-auto mb-8">
                            Save products you love and they’ll appear here for later.
                        </p>
                        <ui-button to="/products" class="rounded-full px-8 bg-primary hover:bg-primary-dark">
                            Explore Collection
                        </ui-button>
                    </div>
                </template>

            </div>
        </div>
    </MainLayout>
</template>

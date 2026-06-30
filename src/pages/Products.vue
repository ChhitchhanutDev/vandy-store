<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '@/stores/productStore.js'
import MainLayout from '@/layouts/MainLayout.vue'
import SearchBar from '@/components/product/SearchBar.vue'
import ProductGrid from '@/components/product/ProductGrid.vue'
import Pagination from '@/components/shared/Pagination.vue'
import LoadingSkeleton from '@/components/shared/LoadingSkeleton.vue'
import ErrorMessage from '@/components/shared/ErrorMessage.vue'

const product = useProductStore()
const route = useRoute()
const router = useRouter()

const search = ref(route.query.q || '')
const page = ref(Number(route.query.page) || 1)
const activeCategory = ref(route.query.category ? Number(route.query.category) : null)
const error = ref(false)

onMounted(async () => {
    await product.fetchCategories()
    await load()
})

async function load() {
    error.value = false
    try {
        if (activeCategory.value) {
            const params = { page: page.value }
            if (search.value) params.q = search.value
            await product.fetchCategoryProducts(activeCategory.value, params)
        } else if (search.value) {
            await product.searchProducts(search.value, { page: page.value })
        } else {
            await product.fetchProducts({ page: page.value })
        }
    } catch {
        error.value = true
    }
}

function syncRoute() {
    router.replace({
        query: {
            q: search.value || undefined,
            category: activeCategory.value || undefined,
            page: page.value > 1 ? page.value : undefined,
        },
    })
}

function selectCategory(catId) {
    activeCategory.value = activeCategory.value === catId ? null : catId
    product.selectedCategory = activeCategory.value
    page.value = 1
    syncRoute()
    load()
}

function doSearch() {
    page.value = 1
    syncRoute()
    load()
}

function goToPage(p) {
    page.value = p
    syncRoute()
    load()
    window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
    <MainLayout>
        <!-- HERO SECTION -->
        <section class="overflow-hidden bg-[#5A3E36] mb-10">
            <div class="max-w-7xl mx-auto px-8 py-20 text-center">
                <p class="uppercase tracking-[0.3em] text-white/70 text-sm mb-4">
                    Explore Collection
                </p>
                <h1 class="text-5xl font-bold text-white mb-5">
                    Find Your Perfect Bag
                </h1>
                <p class="text-white/80 max-w-2xl mx-auto">
                    Timeless designs crafted for everyday elegance.
                </p>
            </div>
        </section>

        <!-- MAIN CONTENT CONTAINER -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">

            <!-- FILTER & SEARCH BAR -->
            <div class="bg-white rounded-[30px] p-6 shadow-sm border border-[#F2E8E1] mb-10">
                <div class="flex flex-col lg:flex-row gap-6">
                    <div class="flex-1">
                        <SearchBar v-model="search" placeholder="Search your dream bag..." @search="doSearch" />
                    </div>
                </div>

                <!-- CATEGORIES -->
                <div v-if="product.categories.length" class="mt-8">
                    <div class="flex items-center justify-between mb-4">
                        <h2 class="text-lg font-semibold text-text">Browse Categories</h2>
                        <span class="text-muted text-sm">{{ product.categories.length }} categories</span>
                    </div>

                    <div class="flex flex-wrap gap-3">
                        <button v-for="cat in product.categories" :key="cat.id" @click="selectCategory(cat.id)"
                            class="group flex items-center gap-3 px-5 py-3 rounded-full transition-all duration-300 border"
                            :class="activeCategory === cat.id
                                ? 'bg-primary text-white border-primary shadow-lg'
                                : 'bg-[#F8F3EF] border-transparent hover:bg-white hover:border-primary hover:shadow-md'">
                            <img v-if="cat.image_url" :src="cat.image_url" :alt="cat.name"
                                class="w-8 h-8 rounded-full object-cover group-hover:scale-110 transition" />
                            <span class="font-medium">{{ cat.name }}</span>
                        </button>
                    </div>
                </div>

                <!-- CATEGORIES SKELETON LOADER -->
                <div v-else class="mt-8 flex gap-3">
                    <div v-for="i in 4" :key="i" class="skeleton h-10 w-28 rounded-full" />
                </div>
            </div>

            <!-- ERROR STATE -->
            <ErrorMessage v-if="error" message="Failed to load products. Please try again." @retry="load"
                class="mt-6" />

            <!-- PRODUCTS COLLECTION -->
            <template v-if="!error">
                <div class="mb-6">
                    <div class="flex justify-between items-center">
                        <h2 class="text-2xl font-bold">Featured Collection</h2>
                        <p class="text-muted">{{ product.products.length }} items</p>
                    </div>
                </div>

                <LoadingSkeleton v-if="product.loading" type="card" :count="8" />

                <template v-else>
                    <div class="min-h-[400px]">
                        <ProductGrid :products="product.products" />
                    </div>

                    <div class="mt-16">
                        <Pagination v-if="product.pagination" :current-page="product.pagination.currentPage"
                            :last-page="product.pagination.lastPage" @page="goToPage" />
                    </div>
                </template>
            </template>

        </div>
    </MainLayout>
</template>

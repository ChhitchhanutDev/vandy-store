<script setup>
import { ref, onMounted, watch } from 'vue'
import { useProductStore } from '@/stores/productStore.js'
import { useRoute, useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import SearchBar from '@/components/product/SearchBar.vue'
import ProductGrid from '@/components/product/ProductGrid.vue'
import Pagination from '@/components/shared/Pagination.vue'
import LoadingSkeleton from '@/components/shared/LoadingSkeleton.vue'

const product = useProductStore()
const route = useRoute()
const router = useRouter()

const search = ref(route.query.q || '')
const page = ref(Number(route.query.page) || 1)

async function load() {
    if (search.value) {
        await product.searchProducts(search.value)
    } else {
        await product.fetchProducts({ page: page.value })
    }
}

onMounted(async () => {
    await product.fetchCategories()
    await load()
})

function doSearch() {
    page.value = 1
    router.replace({ query: { q: search.value || undefined, page: undefined } })
    load()
}

function goToPage(p) {
    page.value = p
    router.replace({ query: { ...route.query, page: p } })
    load()
    window.scrollTo({ top: 0, behavior: 'smooth' })
}

watch(() => route.query.q, (val) => {
    if (!val) {
        search.value = ''
        page.value = 1
        product.fetchProducts({ page: 1 })
    }
})
</script>

<template>
    <MainLayout>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 class="text-3xl font-bold text-text mb-6">Products</h1>

            <div class="flex flex-col sm:flex-row gap-4 mb-8">
                <div class="flex-1">
                    <SearchBar v-model="search" placeholder="Search by name or description..." @search="doSearch" />
                </div>
            </div>

            <LoadingSkeleton v-if="product.loading" type="card" :count="8" />
            <template v-else>
                <ProductGrid :products="product.products" />
                <Pagination
                    v-if="product.pagination"
                    :current-page="product.pagination.currentPage"
                    :last-page="product.pagination.lastPage"
                    @page="goToPage"
                />
            </template>
        </div>
    </MainLayout>
</template>

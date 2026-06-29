import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as productApi from '@/api/product.api.js'
import * as categoryApi from '@/api/category.api.js'

export const useProductStore = defineStore('product', () => {
    const products = ref([])
    const categories = ref([])
    const currentProduct = ref(null)
    const loading = ref(false)
    const pagination = ref(null)
    const selectedCategory = ref(null)

    async function fetchProducts(params = {}) {
        loading.value = true
        try {
            if (selectedCategory.value) {
                params.category_id = selectedCategory.value
            }
            const res = await productApi.getProducts(params)
            if (res.success) {
                products.value = res.data.data
                pagination.value = {
                    currentPage: res.data.current_page,
                    lastPage: res.data.last_page,
                    total: res.data.total,
                }
            }
        } finally {
            loading.value = false
        }
    }

    async function fetchProduct(id) {
        loading.value = true
        try {
            const res = await productApi.getProduct(id)
            if (res.success) {
                currentProduct.value = res.data
            }
        } finally {
            loading.value = false
        }
    }

    async function searchProducts(q) {
        loading.value = true
        try {
            const extra = selectedCategory.value ? { category_id: selectedCategory.value } : {}
            const res = await productApi.searchProducts(q, extra)
            if (res.success) {
                products.value = res.data.data
                pagination.value = {
                    currentPage: res.data.current_page,
                    lastPage: res.data.last_page,
                    total: res.data.total,
                }
            }
        } finally {
            loading.value = false
        }
    }

    async function fetchCategoryProducts(categoryId, params = {}) {
        loading.value = true
        try {
            const res = await categoryApi.getCategoryProducts(categoryId, params)
            if (res.success) {
                products.value = res.data.data
                pagination.value = {
                    currentPage: res.data.current_page,
                    lastPage: res.data.last_page,
                    total: res.data.total,
                }
            }
        } finally {
            loading.value = false
        }
    }

    async function fetchCategories() {
        const res = await categoryApi.getCategories()
        if (res.success) {
            categories.value = res.data.data || res.data
        }
    }

    return {
        products,
        categories,
        currentProduct,
        loading,
        pagination,
        selectedCategory,
        fetchProducts,
        fetchProduct,
        searchProducts,
        fetchCategoryProducts,
        fetchCategories,
    }
})

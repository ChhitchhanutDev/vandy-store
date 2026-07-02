import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as authApi from '@/api/auth.api.js'
import router from '@/router/index.js'

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null)
    const token = ref(null)

    const isAuthenticated = computed(() => !!token.value)

    function init() {
        const saved = localStorage.getItem('token')
        if (saved) {
            token.value = saved
            fetchProfile().catch(() => {
                token.value = null
                localStorage.removeItem('token')
            })
        }
    }

    async function login(email, password) {
        const res = await authApi.login({ email, password })
        if (res.success) {
            token.value = res.data.token
            user.value = res.data.user
            localStorage.setItem('token', token.value)
        }
        return res
    }

    async function register(data) {
        const res = await authApi.register(data)
        if (res.success) {
            token.value = res.data.token
            user.value = res.data.user
            localStorage.setItem('token', token.value)
        }
        return res
    }

    async function logout() {
        try {
            await authApi.logout()
        } finally {
            token.value = null
            user.value = null
            localStorage.removeItem('token')
            router.push('/')
        }
    }

    async function fetchProfile() {
        const res = await authApi.getProfile()
        if (res.success) {
            user.value = res.data.user
        }
        return res
    }

    async function updateProfile(data) {
        const res = await authApi.updateProfile(data)
        if (res.success) {
            user.value = res.data.user
        }
        return res
    }

    async function updatePassword(data) {
        return await authApi.updatePassword(data)
    }

    return {
        user,
        token,
        isAuthenticated,
        init,
        login,
        register,
        logout,
        fetchProfile,
        updateProfile,
        updatePassword,
    }
})

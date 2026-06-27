<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore.js'
import { useToast } from '@/composables/useToast.js'
import { useRouter, useRoute } from 'vue-router'
import AuthLayout from '@/layouts/AuthLayout.vue'
import Card from '@/components/ui/Card.vue'
import Input from '@/components/ui/Input.vue'
import Button from '@/components/ui/Button.vue'

const auth = useAuthStore()
const toast = useToast()
const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function submit() {
    error.value = ''
    loading.value = true
    try {
        await auth.login(email.value, password.value)
        toast.success('Welcome back!')
        router.push(route.query.redirect || '/')
    } catch (e) {
        error.value = e.response?.data?.message || 'Login failed'
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <AuthLayout>
        <Card>
            <h1 class="text-2xl font-bold text-text text-center mb-1">Welcome Back</h1>
            <p class="text-sm text-muted text-center mb-6">Sign in to your account</p>

            <form @submit.prevent="submit" class="space-y-4">
                <div v-if="error" class="text-sm text-error bg-red-50 px-4 py-3 rounded-[14px]">{{ error }}</div>

                <Input v-model="email" label="Email" type="email" placeholder="you@example.com" required />
                <Input v-model="password" label="Password" type="password" placeholder="Enter your password" required />

                <Button type="submit" :loading="loading" class="w-full">Sign In</Button>
            </form>

            <p class="mt-6 text-center text-sm text-muted">
                Don't have an account?
                <router-link to="/register" class="font-medium text-primary hover:text-primary-dark transition-colors">Register</router-link>
            </p>
        </Card>
    </AuthLayout>
</template>

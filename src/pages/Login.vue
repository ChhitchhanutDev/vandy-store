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
        <Card
            class="w-[500px] rounded-[36px] bg-white/80 backdrop-blur-md border border-white/40 shadow-[0_20px_60px_rgba(138,93,79,0.15)] p-10">

                <div class="text-center mb-8">
                    <p class="uppercase tracking-[0.3em] text-primary text-xs mb-3">Welcome Back</p>
                    <h1 class="text-4xl font-bold text-text mb-3">Sign In</h1>
                    <p class="text-muted">Continue your premium shopping journey</p>
                </div>

                <form @submit.prevent="submit" class="space-y-5">
                    <div v-if="error" class="rounded-[20px] bg-red-50 text-red-600 px-5 py-4">
                        {{ error }}
                    </div>

                    <Input v-model="email" label="Email" type="email" placeholder="you@example.com" required />

                    <Input v-model="password" label="Password" type="password" placeholder="Enter password" required />

                    <Button type="submit" :loading="loading"
                        class="w-full h-14 rounded-full bg-gradient-to-r from-[#8A5D4F] to-[#B88A6D] text-white font-semibold shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                        Sign In
                    </Button>
                </form>

                <div class="mt-8 flex gap-2 justify-center">
                    <p class="text-sm text-muted">Don't have an account?</p>
                    <router-link to="/register" class="text-sm">
                        Create Account
                    </router-link>
                </div>

        </Card>
    </AuthLayout>
</template>

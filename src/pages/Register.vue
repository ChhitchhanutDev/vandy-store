<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore.js'
import { useToast } from '@/composables/useToast.js'
import { useRouter } from 'vue-router'
import AuthLayout from '@/layouts/AuthLayout.vue'
import Card from '@/components/ui/Card.vue'
import Input from '@/components/ui/Input.vue'
import Button from '@/components/ui/Button.vue'

const auth = useAuthStore()
const toast = useToast()
const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const passwordConfirmation = ref('')
const loading = ref(false)
const errors = ref({})

async function submit() {
    errors.value = {}
    loading.value = true
    try {
        await auth.register({
            name: name.value,
            email: email.value,
            password: password.value,
            password_confirmation: passwordConfirmation.value,
        })
        toast.success('Account created! Welcome.')
        router.push('/')
    } catch (e) {
        if (e.response?.status === 422) {
            errors.value = e.response.data.errors || {}
        } else {
            toast.error(e.response?.data?.message || 'Registration failed')
        }
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <!-- bg-gradient-to-br from-[#F9F5F2] via-[#F4ECE5] to-[#E4D0C0] px-6 py-10 -->
    <AuthLayout>
        <Card
            class="w-[500px] rounded-[36px] bg-white/80 backdrop-blur-md border border-white/40 shadow-[0_20px_60px_rgba(138,93,79,0.15)] p-10">

                <div class="text-center mb-8">
                    <p class="uppercase tracking-[0.3em] text-primary text-xs mb-3">Join The Collection</p>
                    <h1 class="text-4xl font-bold text-text mb-3">Create Account</h1>
                    <p class="text-muted">Become part of Vandy's Store</p>
                </div>

                <form @submit.prevent="submit" class="space-y-5">
                    <Input v-model="name" label="Full Name" placeholder="John Doe" :error="errors.name?.[0]" required />

                    <Input v-model="email" label="Email" type="email" placeholder="you@example.com"
                        :error="errors.email?.[0]" required />

                    <Input v-model="password" label="Password" type="password" placeholder="Minimum 8 characters"
                        :error="errors.password?.[0]" required />

                    <Input v-model="passwordConfirmation" label="Confirm Password" type="password"
                        placeholder="Confirm your password" required />

                    <Button type="submit" :loading="loading"
                        class="w-full h-14 rounded-full bg-gradient-to-r from-[#8A5D4F] to-[#B88A6D] text-white font-semibold shadow-lg shadow-[#8A5D4F]/20 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#8A5D4F]/30 transition-all duration-300">
                        Create Account
                    </Button>
                </form>

                <div class="mt-8 flex gap-2 justify-center">
                    <p class="text-sm text-muted">Already have an account?</p>
                    <router-link to="/login" class="text-sm">
                        Sign In
                    </router-link>
                </div>

                <div
                    class="absolute top-0 right-0 w-48 h-48 bg-[#E8D6C7] blur-[100px] opacity-30 pointer-events-none" />

        </Card>
    </AuthLayout>
</template>

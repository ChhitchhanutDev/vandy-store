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
    <AuthLayout>
        <Card>
            <h1 class="text-2xl font-bold text-text text-center mb-1">Create Account</h1>
            <p class="text-sm text-muted text-center mb-6">Join Vandy's Store today</p>

            <form @submit.prevent="submit" class="space-y-4">
                <Input v-model="name" label="Full Name" placeholder="John Doe" :error="errors.name?.[0]" required />
                <Input v-model="email" label="Email" type="email" placeholder="you@example.com" :error="errors.email?.[0]" required />
                <Input v-model="password" label="Password" type="password" placeholder="Min 8 characters" :error="errors.password?.[0]" required />
                <Input v-model="passwordConfirmation" label="Confirm Password" type="password" placeholder="Confirm your password" required />

                <Button type="submit" :loading="loading" class="w-full">Create Account</Button>
            </form>

            <p class="mt-6 text-center text-sm text-muted">
                Already have an account?
                <router-link to="/login" class="font-medium text-primary hover:text-primary-dark transition-colors">Sign In</router-link>
            </p>
        </Card>
    </AuthLayout>
</template>

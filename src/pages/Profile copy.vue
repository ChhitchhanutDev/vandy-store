<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore.js'
import { useToast } from '@/composables/useToast.js'
import MainLayout from '@/layouts/MainLayout.vue'
import Card from '@/components/ui/Card.vue'
import Input from '@/components/ui/Input.vue'
import Button from '@/components/ui/Button.vue'

const auth = useAuthStore()
const toast = useToast()

const profileForm = ref({ name: '', email: '' })
const profileLoading = ref(false)
const profileError = ref('')

const passwordForm = ref({ current_password: '', password: '', password_confirmation: '' })
const passwordLoading = ref(false)
const passwordError = ref('')
const passwordErrors = ref({})

const showProfile = ref(false)
const showPassword = ref(false)

onMounted(() => {
    profileForm.value.name = auth.user?.name || ''
    profileForm.value.email = auth.user?.email || ''
})

async function updateProfile() {
    profileLoading.value = true
    profileError.value = ''
    try {
        await auth.updateProfile(profileForm.value)
        toast.success('Profile updated')
        showProfile.value = false
    } catch (e) {
        profileError.value = e.response?.data?.message || 'Update failed'
    } finally {
        profileLoading.value = false
    }
}

async function updatePassword() {
    passwordLoading.value = true
    passwordErrors.value = {}
    passwordError.value = ''
    try {
        await auth.updatePassword(passwordForm.value)
        toast.success('Password changed')
        showPassword.value = false
        passwordForm.value = { current_password: '', password: '', password_confirmation: '' }
    } catch (e) {
        if (e.response?.status === 422) {
            passwordErrors.value = e.response.data.errors || {}
        } else {
            passwordError.value = e.response?.data?.message || 'Password change failed'
        }
    } finally {
        passwordLoading.value = false
    }
}
</script>

<template>
    <MainLayout>
        <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 class="text-3xl font-bold text-text mb-8">My Profile</h1>

            <Card class="mb-6">
                <div class="flex items-center gap-4 mb-6">
                    <div class="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold">
                        {{ auth.user?.name?.charAt(0)?.toUpperCase() }}
                    </div>
                    <div>
                        <h2 class="text-xl font-semibold text-text">{{ auth.user?.name }}</h2>
                        <p class="text-sm text-muted">{{ auth.user?.email }}</p>
                    </div>
                </div>

                <div class="flex flex-wrap gap-3">
                    <Button variant="secondary" @click="showProfile = !showProfile">
                        {{ showProfile ? 'Cancel' : 'Edit Profile' }}
                    </Button>
                    <Button variant="outline" @click="showPassword = !showPassword">
                        {{ showPassword ? 'Cancel' : 'Change Password' }}
                    </Button>
                    <Button variant="ghost" class="text-error !important" @click="auth.logout()">
                        Logout
                    </Button>
                </div>
            </Card>

            <Card v-if="showProfile">
                <h2 class="text-lg font-semibold text-text mb-4">Edit Profile</h2>
                <form @submit.prevent="updateProfile" class="space-y-4">
                    <div v-if="profileError" class="text-sm text-error bg-red-50 px-4 py-3 rounded-[14px]">{{ profileError }}</div>
                    <Input v-model="profileForm.name" label="Name" required />
                    <Input v-model="profileForm.email" label="Email" type="email" required />
                    <Button type="submit" :loading="profileLoading">Save Changes</Button>
                </form>
            </Card>

            <Card v-if="showPassword" class="mt-4">
                <h2 class="text-lg font-semibold text-text mb-4">Change Password</h2>
                <form @submit.prevent="updatePassword" class="space-y-4">
                    <div v-if="passwordError" class="text-sm text-error bg-red-50 px-4 py-3 rounded-[14px]">{{ passwordError }}</div>
                    <Input v-model="passwordForm.current_password" label="Current Password" type="password" :error="passwordErrors.current_password?.[0]" required />
                    <Input v-model="passwordForm.password" label="New Password" type="password" :error="passwordErrors.password?.[0]" required />
                    <Input v-model="passwordForm.password_confirmation" label="Confirm New Password" type="password" required />
                    <Button type="submit" :loading="passwordLoading">Change Password</Button>
                </form>
            </Card>
        </div>
    </MainLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore.js'
import { useToast } from '@/composables/useToast.js'
import MainLayout from '@/layouts/MainLayout.vue'
import Card from '@/components/ui/Card.vue'
import Modal from '@/components/ui/Modal.vue'
import Input from '@/components/ui/Input.vue'
import Button from '@/components/ui/Button.vue'

const auth = useAuthStore()
const toast = useToast()

const profileForm = ref({ name: '', email: '' })
const profileLoading = ref(false)
const profileError = ref('')
const profileErrors = ref({})

const passwordForm = ref({ current_password: '', password: '', password_confirmation: '' })
const passwordLoading = ref(false)
const passwordError = ref('')
const passwordErrors = ref({})

const logoutLoading = ref(false)
const showLogoutModal = ref(false)

const showProfile = ref(false)
const showPassword = ref(false)

function toggleProfile() {
    showProfile.value = !showProfile.value
    if (showProfile.value) showPassword.value = false
}

function togglePassword() {
    showPassword.value = !showPassword.value
    if (showPassword.value) showProfile.value = false
}

onMounted(() => {
    profileForm.value.name = auth.user?.name || ''
    profileForm.value.email = auth.user?.email || ''
})

async function updateProfile() {
    profileLoading.value = true
    profileErrors.value = {}
    profileError.value = ''
    try {
        await auth.updateProfile(profileForm.value)
        toast.success('Profile updated')
        showProfile.value = false
    } catch (e) {
        if (e.response?.status === 422) {
            profileErrors.value = e.response.data.errors || {}
        } else {
            profileError.value = e.response?.data?.message || 'Update failed'
        }
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
function logout() {
    showLogoutModal.value = true
}

async function confirmLogout() {
    showLogoutModal.value = false
    logoutLoading.value = true
    try {
        await auth.logout()
    } finally {
        logoutLoading.value = false
    }
}
</script>

<template>
    <MainLayout>
        <div class="min-h-screen bg-gradient-to-b from-[#F9F5F2] to-white py-10">
            <div class="max-w-5xl mx-auto px-6">

                <!-- PAGE TITLE -->
                <div class="mb-8">
                    <p class="uppercase tracking-[0.25em] text-primary text-sm">
                        My Account
                    </p>
                    <h1 class="text-5xl font-bold text-text mt-2">
                        Profile Settings
                    </h1>
                </div>

                <!-- PROFILE CARD -->
                <Card class="rounded-[36px] overflow-hidden border-0 shadow-xl mb-8">
                    <div class="rounded-[28px] bg-gradient-to-r from-[#8A5D4F] to-[#B88A6D] p-10 text-white">
                        <div class="flex flex-col md:flex-row items-center justify-between">

                            <template v-if="auth.user">
                                <div class="flex items-center gap-6">
                                    <div
                                        class="h-24 w-24 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-4xl font-bold">
                                        <template v-if="auth.user.name">
                                            {{ auth.user.name.charAt(0).toUpperCase() }}
                                        </template>
                                        <svg v-else class="h-10 w-10" fill="none" stroke="currentColor"
                                            stroke-width="1.5" viewBox="0 0 24 24">
                                            <path
                                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 class="text-3xl font-bold">{{ auth.user.name }}</h2>
                                        <p class="text-white/80 mt-1">{{ auth.user.email }}</p>
                                    </div>
                                </div>

                                <div class="flex gap-3 mt-6 md:mt-0 flex-wrap">
                                    <Button variant="secondary" class="!rounded-full !px-6" @click="toggleProfile">
                                        {{ showProfile ? 'Close' : 'Edit Profile' }}
                                    </Button>
                                    <Button variant="outline" class="!rounded-full !border-white !text-white"
                                        @click="togglePassword">
                                        {{ showPassword ? 'Close' : 'Change Password' }}
                                    </Button>
                                    <Button variant="ghost" class="!text-white hover:!bg-white/10"
                                        :loading="logoutLoading" @click="logout">
                                        Logout
                                    </Button>
                                </div>
                            </template>

                        </div>
                    </div>
                </Card>

                <!-- EDIT PROFILE -->
                <transition enter-active-class="duration-300 ease-out" leave-active-class="duration-200 ease-in"
                    enter-from-class="opacity-0 -translate-y-2" leave-to-class="opacity-0 -translate-y-2">
                    <Card v-if="showProfile" class="rounded-[32px] p-8 shadow-lg mb-6">
                        <h2 class="text-2xl font-semibold mb-6">Edit Profile</h2>

                        <form @submit.prevent="updateProfile" class="space-y-5">
                            <div v-if="profileError" class="rounded-2xl bg-red-50 text-red-600 p-4">
                                {{ profileError }}
                            </div>
                            <Input v-model="profileForm.name" label="Full Name" required
                                :error="profileErrors.name?.[0]" />
                            <Input v-model="profileForm.email" label="Email Address" type="email" required
                                :error="profileErrors.email?.[0]" />
                            <Button type="submit" :loading="profileLoading">
                                Save Changes
                            </Button>
                        </form>
                    </Card>
                </transition>

                <!-- PASSWORD -->
                <transition enter-active-class="duration-300 ease-out" leave-active-class="duration-200 ease-in"
                    enter-from-class="opacity-0 -translate-y-2" leave-to-class="opacity-0 -translate-y-2">
                    <Card v-if="showPassword" class="rounded-[32px] p-8 shadow-lg">
                        <h2 class="text-2xl font-semibold mb-6">Change Password</h2>

                        <form @submit.prevent="updatePassword" class="space-y-5">
                            <div v-if="passwordError" class="rounded-2xl bg-red-50 text-red-600 p-4">
                                {{ passwordError }}
                            </div>
                            <Input v-model="passwordForm.current_password" label="Current Password" type="password"
                                :error="passwordErrors.current_password?.[0]" />
                            <Input v-model="passwordForm.password" label="New Password" type="password"
                                :error="passwordErrors.password?.[0]" />
                            <Input v-model="passwordForm.password_confirmation" label="Confirm Password" type="password"
                                :error="passwordErrors.password_confirmation?.[0]" />
                            <Button type="submit" :loading="passwordLoading">
                                Update Password
                            </Button>
                        </form>
                    </Card>
                </transition>

            </div>
        </div>

        <Modal :show="showLogoutModal" title="Sign Out" @close="showLogoutModal = false">
            <p class="text-text mb-6">Are you sure you want to sign out?</p>
            <div class="flex gap-3 justify-end">
                <Button variant="secondary" @click="showLogoutModal = false">Cancel</Button>
                <Button variant="danger" @click="confirmLogout">Sign Out</Button>
            </div>
        </Modal>
    </MainLayout>
</template>

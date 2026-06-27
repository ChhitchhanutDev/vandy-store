<script setup>
import { useAuthStore } from '@/stores/authStore.js'
import Toast from '@/components/ui/Toast.vue'

const auth = useAuthStore()
auth.init()
</script>

<template>
    <router-view />
    <Toast />
</template>

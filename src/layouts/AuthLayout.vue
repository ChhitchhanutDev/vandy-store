<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
    <div class="min-h-screen flex flex-col items-center justify-center px-4 py-10">
        <RouterLink to="/" class="mb-8 flex items-center gap-2">
            <div class="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">
                V
            </div>
            <span class="text-2xl font-semibold text-text">Vandy's</span>
        </RouterLink>
        <div class="w-full max-w-md">
            <slot />
        </div>
    </div>
</template>

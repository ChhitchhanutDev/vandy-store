<script setup>
import MainLayout from '@/layouts/MainLayout.vue'
</script>

<template>
    <MainLayout>
        <div class="min-h-[70vh] flex items-center justify-center px-6">
            <div class="text-center max-w-md">
                <div
                    class="w-28 h-28 mx-auto rounded-full bg-secondary flex items-center justify-center text-5xl mb-8">
                    ?
                </div>
                <h1 class="text-6xl font-bold text-text mb-4">404</h1>
                <p class="text-xl text-muted mb-2">Page not found</p>
                <p class="text-sm text-muted/70 mb-8">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <ui-button to="/" class="rounded-full px-8 bg-primary hover:bg-primary-dark">
                    Back to Home
                </ui-button>
            </div>
        </div>
    </MainLayout>
</template>

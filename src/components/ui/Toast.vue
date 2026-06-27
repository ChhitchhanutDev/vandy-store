<script setup>
import { useToastStore } from '@/stores/toastStore.js'

const toast = useToastStore()

const iconMap = {
    success: 'M5 13l4 4L19 7',
    error: 'M6 18L18 6M6 6l12 12',
}

const colorMap = {
    success: 'border-green-200 bg-green-50 text-green-800',
    error: 'border-red-200 bg-red-50 text-red-800',
}
</script>

<template>
    <div class="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        <TransitionGroup name="slide-up">
            <div
                v-for="msg in toast.messages"
                :key="msg.id"
                :class="['rounded-[16px] border px-5 py-3 shadow-lg pointer-events-auto', colorMap[msg.type] || '']"
            >
                <div class="flex items-center gap-3">
                    <svg class="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="iconMap[msg.type]" />
                    </svg>
                    <p class="text-sm font-medium flex-1">{{ msg.text }}</p>
                    <button @click="toast.remove(msg.id)" class="shrink-0 opacity-60 hover:opacity-100 transition">
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        </TransitionGroup>
    </div>
</template>

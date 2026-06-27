<script setup>
defineProps({
    show: { type: Boolean, default: false },
    title: { type: String, default: '' },
})

const emit = defineEmits(['close'])
</script>

<template>
    <Teleport to="body">
        <Transition name="fade">
            <div
                v-if="show"
                class="fixed inset-0 z-50 flex items-center justify-center p-4"
                @click.self="emit('close')"
            >
                <div class="absolute inset-0 bg-black/30 backdrop-blur-sm" />
                <div class="relative w-full max-w-md rounded-[20px] bg-white shadow-xl p-6 z-10">
                    <div v-if="title" class="flex items-center justify-between mb-4">
                        <h2 class="text-lg font-semibold text-text">{{ title }}</h2>
                        <button
                            @click="emit('close')"
                            class="rounded-full p-1 text-muted hover:bg-secondary transition-colors"
                        >
                            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <slot />
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

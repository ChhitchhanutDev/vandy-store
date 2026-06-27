<script setup>
defineProps({
    modelValue: { type: String, default: '' },
    placeholder: { type: String, default: 'Search products...' },
})

const emit = defineEmits(['update:modelValue', 'search'])
</script>

<template>
    <div class="relative">
        <svg class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
            :value="modelValue"
            @input="emit('update:modelValue', $event.target.value)"
            @keyup.enter="emit('search')"
            :placeholder="placeholder"
            class="w-full pl-12 pr-4 py-3 rounded-[16px] border border-border bg-white text-sm text-text placeholder-muted outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200"
        />
    </div>
</template>

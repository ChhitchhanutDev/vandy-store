<script setup>
defineProps({
    padding: { type: String, default: 'p-6' },
})
</script>

<template>
    <div :class="['bg-white rounded-[20px] shadow-sm border border-border/50', padding]">
        <slot />
    </div>
</template>

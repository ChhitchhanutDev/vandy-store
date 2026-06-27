<script setup>
defineProps({
    variant: { type: String, default: 'default' },
})

const styles = {
    default: 'bg-secondary text-text',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-amber-100 text-amber-700',
    error: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
    accent: 'bg-accent/30 text-primary',
}
</script>

<template>
    <span :class="['inline-flex rounded-full px-2.5 py-1 text-xs font-semibold', styles[variant] || styles.default]">
        <slot />
    </span>
</template>

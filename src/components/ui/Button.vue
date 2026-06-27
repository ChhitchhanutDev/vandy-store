<script setup>
defineProps({
    variant: { type: String, default: 'primary' },
    size: { type: String, default: 'md' },
    loading: { type: Boolean, default: false },
    to: { type: String, default: null },
    type: { type: String, default: 'button' },
})

const variants = {
    primary: 'bg-primary text-white hover:bg-primary-dark',
    secondary: 'bg-secondary text-text hover:bg-accent',
    outline: 'border border-primary text-primary hover:bg-primary hover:text-white',
    danger: 'bg-error text-white hover:opacity-90',
    ghost: 'text-text hover:bg-secondary',
}

const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3 text-base',
}
</script>

<template>
    <component
        :is="to ? 'router-link' : 'button'"
        :to="to"
        :type="to ? null : type"
        :disabled="loading"
        :class="[
            'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 rounded-[16px]',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            variants[variant] || variants.primary,
            sizes[size] || sizes.md,
        ]"
    >
        <svg v-if="loading" class="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <slot />
    </component>
</template>

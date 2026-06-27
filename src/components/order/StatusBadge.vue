<script setup>
defineProps({
    status: { type: String, required: true },
})

const map = {
    pending: { label: 'Pending', variant: 'warning' },
    completed: { label: 'Completed', variant: 'success' },
    cancelled: { label: 'Cancelled', variant: 'error' },
}
</script>

<template>
    <span
        :class="[
            'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold',
            status === 'completed' ? 'bg-green-100 text-green-700' : '',
            status === 'pending' ? 'bg-amber-100 text-amber-700' : '',
            status === 'cancelled' ? 'bg-red-100 text-red-700' : '',
        ]"
    >
        {{ map[status]?.label || status }}
    </span>
</template>

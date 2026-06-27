<script setup>
import StatusBadge from './StatusBadge.vue'
import { RouterLink } from 'vue-router'

defineProps({
    order: { type: Object, required: true },
})
</script>

<template>
    <RouterLink
        :to="`/orders/${order.id}`"
        class="block bg-white rounded-[20px] border border-border/50 p-5 hover:shadow-md transition-all duration-200"
    >
        <div class="flex items-center justify-between mb-3">
            <span class="text-sm font-semibold text-text">Order #{{ order.id }}</span>
            <StatusBadge :status="order.status" />
        </div>
        <div class="flex items-center justify-between text-sm">
            <div>
                <p class="text-muted">
                    {{ order.items_count || 0 }} item(s) &middot;
                    {{ new Date(order.created_at).toLocaleDateString() }}
                </p>
            </div>
            <p class="font-semibold text-primary">${{ Number(order.total_amount).toFixed(2) }}</p>
        </div>
    </RouterLink>
</template>

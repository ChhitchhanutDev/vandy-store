<script setup>
defineProps({
    total: { type: Number, required: true },
    itemCount: { type: Number, required: true },
})
</script>

<template>
    <div class="bg-white rounded-[20px] border border-border/50 p-6 space-y-4">
        <h3 class="text-lg font-semibold text-text">Order Summary</h3>

        <div class="space-y-2 text-sm">
            <div class="flex justify-between text-text">
                <span>Items ({{ itemCount }})</span>
                <span>${{ total.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-text">
                <span>Shipping</span>
                <span class="text-success font-medium">Free</span>
            </div>
        </div>

        <hr class="border-border" />

        <div class="flex justify-between font-semibold text-lg text-text">
            <span>Total</span>
            <span class="text-primary">${{ total.toFixed(2) }}</span>
        </div>

        <slot />
    </div>
</template>

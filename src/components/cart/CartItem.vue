<script setup>
import { useCartStore } from '@/stores/cartStore.js'
import { useToast } from '@/composables/useToast.js'
import { RouterLink } from 'vue-router'

const props = defineProps({
    item: { type: Object, required: true },
})

const cart = useCartStore()
const toast = useToast()

async function updateQty(qty) {
    if (qty < 1) return
    try {
        await cart.updateQuantity(props.item.id, qty)
    } catch (e) {
        toast.error(e.response?.data?.message || 'Failed to update quantity')
    }
}

async function remove() {
    try {
        await cart.removeItem(props.item.id)
        toast.success('Item removed')
    } catch {
        toast.error('Failed to remove item')
    }
}
</script>

<template>
    <div class="flex items-center gap-4 py-4 border-b border-border last:border-0">
        <RouterLink :to="`/products/${item.product_id}`" class="shrink-0">
            <img
                :src="item.product?.image_url || '/placeholder.png'"
                :alt="item.product?.name"
                class="h-20 w-20 rounded-[14px] object-cover border border-border/50"
                @error="($event.target.src = '/placeholder.png')"
            />
        </RouterLink>

        <div class="flex-1 min-w-0">
            <RouterLink :to="`/products/${item.product_id}`" class="font-medium text-text hover:text-primary transition-colors line-clamp-1">
                {{ item.product?.name || 'Product' }}
            </RouterLink>
            <p class="text-sm text-primary font-semibold mt-1">${{ Number(item.price).toFixed(2) }}</p>
        </div>

        <div class="flex items-center gap-2">
            <button
                @click="updateQty(item.quantity - 1)"
                class="h-8 w-8 flex items-center justify-center rounded-[10px] border border-border text-text hover:bg-secondary transition-colors"
            >
                -
            </button>
            <span class="w-8 text-center text-sm font-medium">{{ item.quantity }}</span>
            <button
                @click="updateQty(item.quantity + 1)"
                class="h-8 w-8 flex items-center justify-center rounded-[10px] border border-border text-text hover:bg-secondary transition-colors"
            >
                +
            </button>
        </div>

        <div class="text-right min-w-[80px]">
            <p class="font-semibold text-text">${{ (item.price * item.quantity).toFixed(2) }}</p>
            <button
                @click="remove"
                class="mt-1 text-xs text-muted hover:text-error transition-colors"
            >
                Remove
            </button>
        </div>
    </div>
</template>

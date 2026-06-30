<script setup>
import { ref, computed } from 'vue'
import { useCartStore } from '@/stores/cartStore.js'
import { useToast } from '@/composables/useToast.js'
import { RouterLink } from 'vue-router'

const props = defineProps({
    item: { type: Object, required: true },
})

const cart = useCartStore()
const toast = useToast()

const qtyInput = ref(props.item.quantity)
const maxStock = computed(() => props.item.product?.stock ?? 99)
const debounceTimer = ref(null)

function clamp(val) {
    return Math.min(Math.max(parseInt(val) || 1, 1), maxStock.value)
}

async function updateQty(qty) {
    if (qty < 1 || qty > maxStock.value) return
    qtyInput.value = qty
    try {
        await cart.updateQuantity(props.item.id, qty)
    } catch (e) {
        toast.error(e.response?.data?.message || 'Failed to update quantity')
        qtyInput.value = props.item.quantity
    }
}

function onQtyInput() {
    clearTimeout(debounceTimer.value)
    const val = clamp(qtyInput.value)
    qtyInput.value = val
    debounceTimer.value = setTimeout(() => {
        if (val !== props.item.quantity) updateQty(val)
    }, 300)
}

function onQtyBlur() {
    clearTimeout(debounceTimer.value)
    const val = clamp(qtyInput.value)
    qtyInput.value = val
    if (val !== props.item.quantity) updateQty(val)
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
    <div class="
        group
        flex
        items-center
        gap-5
        p-5
        rounded-[28px]
        border border-border
        hover:shadow-xl
        hover:-translate-y-[2px]
        transition-all
        duration-300
        ">

        <!-- Product Image -->
        <RouterLink :to="`/products/${item.product_id}`" class="shrink-0">
            <img :src="item.product?.image_url || '/placeholder.png'" :alt="item.product?.name" class="
                h-24
                w-24
                rounded-3xl
                object-cover
                border
                border-border
                shadow-sm
                " @error="($event.target.src = '/placeholder.png')" />
        </RouterLink>

        <!-- Product Info -->
        <div class="flex-1 min-w-0">

            <RouterLink :to="`/products/${item.product_id}`" class="
                text-[16px]
                font-semibold
                text-text
                hover:text-accent-orange
                transition
                line-clamp-1
                ">
                {{ item.product?.name || 'Product' }}
            </RouterLink>

            <p class="
                mt-2
                text-sm
                font-bold
                text-accent-orange
                ">
                ${{ Number(item.price).toFixed(2) }}
            </p>

        </div>

        <!-- Quantity -->
        <div class="flex items-center gap-3">

            <button @click="updateQty(item.quantity - 1)" class="
                h-10
                w-10
                rounded-full
                border
                border-border
                bg-white
                text-primary-dark
                hover:bg-accent-surface
                hover:border-accent-orange
                transition
                ">
                −
            </button>

            <input v-model.number="qtyInput" @input="onQtyInput" @blur="onQtyBlur" @keydown.enter="$event.target.blur()"
                type="number" :min="1" :max="maxStock" class="
                w-16
                h-10
                rounded-full
                bg-white
                border
                border-border
                text-center
                font-medium
                text-text
                [appearance:textfield]
                [&::-webkit-inner-spin-button]:appearance-none
                [&::-webkit-outer-spin-button]:appearance-none
                focus:outline-none
                focus:border-accent-orange
                focus:ring-2
                focus:ring-accent-orange/20
                " />

            <button @click="updateQty(item.quantity + 1)" :disabled="item.quantity >= maxStock" class="
                h-10
                w-10
                rounded-full
                border
                border-border
                bg-white
                transition
                " :class="item.quantity >= maxStock
                        ? 'opacity-40 cursor-not-allowed'
                        : 'hover:bg-accent-surface hover:border-accent-orange'
                    ">
                +
            </button>

        </div>

        <!-- Total -->
        <div class="text-right min-w-[90px]">

            <p class="
                text-lg
                font-bold
                text-text
                ">
                ${{ (item.price * item.quantity).toFixed(2) }}
            </p>

            <button @click="remove" class="
                mt-2
                text-xs
                text-muted
                hover:text-accent-orange
                hover:underline
                underline-offset-4
                transition
                ">
                Remove
            </button>

        </div>

    </div>
</template>

<script setup>
const props = defineProps({
    currentPage: { type: Number, required: true },
    lastPage: { type: Number, required: true },
})

const emit = defineEmits(['page'])

function pages() {
    const p = []
    const start = Math.max(1, props.currentPage - 2)
    const end = Math.min(props.lastPage, props.currentPage + 2)
    for (let i = start; i <= end; i++) p.push(i)
    return p
}
</script>

<template>
    <div v-if="lastPage > 1" class="flex items-center justify-center gap-2 mt-8">
        <button
            :disabled="currentPage === 1"
            @click="emit('page', currentPage - 1)"
            class="px-3 py-2 text-sm font-medium rounded-[12px] transition-all duration-200 disabled:opacity-30 text-text hover:bg-secondary"
        >
            Prev
        </button>

        <button
            v-for="p in pages()"
            :key="p"
            @click="emit('page', p)"
            :class="[
                'px-3.5 py-2 text-sm font-medium rounded-[12px] transition-all duration-200',
                p === currentPage ? 'bg-primary text-white' : 'text-text hover:bg-secondary',
            ]"
        >
            {{ p }}
        </button>

        <button
            :disabled="currentPage === lastPage"
            @click="emit('page', currentPage + 1)"
            class="px-3 py-2 text-sm font-medium rounded-[12px] transition-all duration-200 disabled:opacity-30 text-text hover:bg-secondary"
        >
            Next
        </button>
    </div>
</template>

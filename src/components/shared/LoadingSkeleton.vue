<script setup>
defineProps({
    type: { type: String, default: 'card' },
    count: { type: Number, default: 4 },
})
</script>

<template>
    <div v-if="type === 'card'" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div v-for="i in count" :key="i" class="rounded-[20px] bg-white p-4 border border-border/50">
            <div class="skeleton h-48 w-full mb-4" />
            <div class="skeleton h-4 w-3/4 mb-2" />
            <div class="skeleton h-4 w-1/2 mb-4" />
            <div class="flex justify-between items-center">
                <div class="skeleton h-6 w-20" />
                <div class="skeleton h-8 w-24 rounded-[12px]" />
            </div>
        </div>
    </div>

    <div v-else-if="type === 'list'" class="space-y-3">
        <div v-for="i in count" :key="i" class="flex items-center gap-4 p-4 bg-white rounded-[16px] border border-border/50">
            <div class="skeleton h-16 w-16 rounded-[12px] shrink-0" />
            <div class="flex-1 space-y-2">
                <div class="skeleton h-4 w-2/3" />
                <div class="skeleton h-3 w-1/3" />
            </div>
            <div class="skeleton h-8 w-20 rounded-[12px]" />
        </div>
    </div>

    <div v-else-if="type === 'detail'" class="space-y-6">
        <div class="skeleton h-80 w-full rounded-[20px]" />
        <div class="skeleton h-8 w-1/2" />
        <div class="skeleton h-6 w-24" />
        <div class="space-y-2">
            <div class="skeleton h-4 w-full" />
            <div class="skeleton h-4 w-3/4" />
            <div class="skeleton h-4 w-1/2" />
        </div>
    </div>
</template>

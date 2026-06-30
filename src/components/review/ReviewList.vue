<script setup>
defineProps({
    reviews: { type: Array, default: () => [] },
    loading: { type: Boolean, default: false },
})

function timeAgo(date) {
    const diff = Date.now() - new Date(date).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'Just now'
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    if (days < 30) return `${days}d ago`
    const months = Math.floor(days / 30)
    if (months < 12) return `${months}mo ago`
    return `${Math.floor(months / 12)}y ago`
}
</script>

<template>
    <div class="space-y-4">
        <div v-if="loading" class="space-y-4">
            <div v-for="n in 3" :key="n" class="flex gap-4 p-5 rounded-[20px] border border-border/50">
                <div class="skeleton h-10 w-10 rounded-full shrink-0" />
                <div class="flex-1 space-y-2">
                    <div class="skeleton h-4 w-24" />
                    <div class="skeleton h-3 w-32" />
                    <div class="skeleton h-4 w-full" />
                </div>
            </div>
        </div>

        <template v-else-if="reviews.length">
            <div v-for="review in reviews" :key="review.id"
                class="flex gap-4 p-5 rounded-[20px] border border-border/50 bg-white">
                <div
                    class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold text-text">
                    {{ (review.user?.name || 'A')[0].toUpperCase() }}
                </div>
                <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-3 flex-wrap">
                        <span class="text-sm font-semibold text-text">{{ review.user?.name || 'Anonymous' }}</span>
                        <div class="flex items-center gap-0.5">
                            <svg v-for="i in 5" :key="i"
                                class="h-4 w-4"
                                :class="i <= review.rating ? 'text-amber-400' : 'text-slate-200'"
                                viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        </div>
                        <span class="text-xs text-muted">{{ timeAgo(review.created_at) }}</span>
                    </div>
                    <p class="mt-2 text-sm text-text/80 leading-relaxed">{{ review.comment }}</p>
                </div>
            </div>
        </template>

        <div v-else class="py-12 text-center text-muted text-sm">
            No reviews yet.
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { submitReview } from '@/api/review.api.js'

const props = defineProps({
    productId: { type: [String, Number], required: true },
})

const emit = defineEmits(['submitted'])

const rating = ref(0)
const hoverRating = ref(0)
const comment = ref('')
const submitting = ref(false)
const error = ref('')

async function submit() {
    if (rating.value === 0) {
        error.value = 'Please select a rating'
        return
    }
    if (!comment.value.trim()) {
        error.value = 'Please write a review'
        return
    }

    submitting.value = true
    error.value = ''
    try {
        await submitReview(props.productId, {
            rating: rating.value,
            comment: comment.value.trim(),
        })
        rating.value = 0
        comment.value = ''
        emit('submitted')
    } catch (e) {
        error.value = e.response?.data?.message || 'Failed to submit review'
    } finally {
        submitting.value = false
    }
}
</script>

<template>
    <div class="rounded-[20px] border border-border/50 bg-white p-6">
        <h3 class="text-base font-semibold text-text mb-4">Write a Review</h3>

        <form @submit.prevent="submit" class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-text mb-2">Rating</label>
                <div class="flex items-center gap-1">
                    <button
                        v-for="i in 5" :key="i"
                        type="button"
                        @click="rating = i"
                        @mouseenter="hoverRating = i"
                        @mouseleave="hoverRating = 0"
                        class="transition-all duration-150 hover:scale-110"
                    >
                        <svg
                            class="h-7 w-7"
                            :class="i <= (hoverRating || rating) ? 'text-amber-400' : 'text-slate-200'"
                            viewBox="0 0 20 20" fill="currentColor"
                        >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    </button>
                    <span v-if="rating" class="ml-2 text-sm text-muted">
                        {{ ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating] }}
                    </span>
                </div>
            </div>

            <div>
                <label class="block text-sm font-medium text-text mb-1.5">Review</label>
                <textarea
                    v-model="comment"
                    maxlength="1000"
                    rows="4"
                    placeholder="Share your experience with this product..."
                    class="w-full rounded-[14px] border border-border bg-white px-4 py-2.5 text-sm text-text placeholder-muted transition-all duration-200 outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                />
                <div class="mt-1 flex justify-between">
                    <span class="text-xs text-muted">Share your honest opinion (min 1 character)</span>
                    <span class="text-xs" :class="comment.length >= 1000 ? 'text-error' : 'text-muted'">
                        {{ comment.length }}/1000
                    </span>
                </div>
            </div>

            <div v-if="error" class="rounded-[14px] bg-red-50 px-4 py-3 text-sm text-error">
                {{ error }}
            </div>

            <button
                type="submit"
                :disabled="submitting"
                class="w-full py-2.5 text-sm font-medium rounded-[14px] transition-all duration-200 bg-primary text-white hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
            >
                <svg v-if="submitting" class="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {{ submitting ? 'Submitting...' : 'Submit Review' }}
            </button>
        </form>
    </div>
</template>

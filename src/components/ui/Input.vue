<script setup>
defineProps({
    label: { type: String, default: '' },
    modelValue: { type: [String, Number], default: '' },
    type: { type: String, default: 'text' },
    placeholder: { type: String, default: '' },
    error: { type: String, default: '' },
    required: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
    <div>
        <label v-if="label" class="block text-sm font-medium text-text mb-1.5">
            {{ label }}
            <span v-if="required" class="text-error">*</span>
        </label>
        <input
            :type="type"
            :value="modelValue"
            :placeholder="placeholder"
            :required="required"
            @input="emit('update:modelValue', $event.target.value)"
            :class="[
                'w-full rounded-[14px] border bg-white px-4 py-2.5 text-sm text-text placeholder-muted',
                'transition-all duration-200 outline-none',
                'focus:ring-2 focus:ring-primary/30 focus:border-primary',
                error ? 'border-error' : 'border-border',
            ]"
        />
        <p v-if="error" class="mt-1 text-xs text-error">{{ error }}</p>
    </div>
</template>

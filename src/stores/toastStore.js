import { defineStore } from 'pinia'
import { ref } from 'vue'

let nextId = 0

export const useToastStore = defineStore('toast', () => {
    const messages = ref([])

    function add(type, text) {
        const id = ++nextId
        messages.value.push({ id, type, text })
        setTimeout(() => remove(id), 3500)
    }

    function success(text) {
        add('success', text)
    }

    function error(text) {
        add('error', text)
    }

    function remove(id) {
        messages.value = messages.value.filter((m) => m.id !== id)
    }

    return { messages, success, error, remove }
})

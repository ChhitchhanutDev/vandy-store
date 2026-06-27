import { useToastStore } from '@/stores/toastStore.js'

export function useToast() {
    const toast = useToastStore()
    return {
        success: toast.success,
        error: toast.error,
    }
}

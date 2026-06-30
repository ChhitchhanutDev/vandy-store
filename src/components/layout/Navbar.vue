<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore.js'
import { useCartStore } from '@/stores/cartStore.js'
import { useWishlistStore } from '@/stores/wishlistStore.js'
import { useToast } from '@/composables/useToast.js'
import { RouterLink, useRouter } from 'vue-router'

const auth = useAuthStore()
const cart = useCartStore()
const wishlist = useWishlistStore()
const toast = useToast()
const router = useRouter()

const mobileOpen = ref(false)

if (auth.isAuthenticated) {
    cart.fetchCart()
    wishlist.fetchWishlist()
}

async function handleLogout() {
    await auth.logout()
    toast.success('Logged out successfully')
}

function closeMobile() {
    mobileOpen.value = false
}
</script>

<template>
    <nav class="bg-white border-b border-border sticky top-0 z-40">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-16">
                <RouterLink to="/" class="flex items-center gap-2 shrink-0">
                    <img src="/logo.png" alt="Vandy's Store" class="h-9 w-9 rounded-full object-cover" />
                    <span class="text-xl font-semibold text-text">Vandy's Store</span>
                </RouterLink>

                <div class="hidden md:flex items-center gap-1">
                    <RouterLink to="/"
                        class="px-4 py-2 text-sm font-medium text-text hover:text-primary rounded-[14px] hover:bg-secondary/50 transition-all duration-200"
                        exact-active-class="text-primary bg-secondary/50">
                        Home
                    </RouterLink>
                    <RouterLink to="/products"
                        class="px-4 py-2 text-sm font-medium text-text hover:text-primary rounded-[14px] hover:bg-secondary/50 transition-all duration-200"
                        active-class="text-primary bg-secondary/50">
                        Products
                    </RouterLink>
                    <RouterLink :to="auth.isAuthenticated ? '/wishlist' : '/login'"
                        class="relative px-4 py-2 text-sm font-medium text-text hover:text-primary rounded-[14px] hover:bg-secondary/50 transition-all duration-200"
                        active-class="text-primary bg-secondary/50">
                        Wishlist
                        <span v-if="auth.isAuthenticated && wishlist.items.length"
                            class="absolute -top-0.5 -right-0.5 h-4 min-w-[16px] flex items-center justify-center rounded-full bg-error text-white text-[10px] font-bold px-1">
                            {{ wishlist.items.length }}
                        </span>
                    </RouterLink>

                    <RouterLink :to="auth.isAuthenticated ? '/cart' : '/login'"
                        class="relative px-4 py-2 text-sm font-medium text-text hover:text-primary rounded-[14px] hover:bg-secondary/50 transition-all duration-200"
                        active-class="text-primary bg-secondary/50">
                        Cart
                        <span v-if="auth.isAuthenticated && cart.itemCount"
                            class="absolute -top-0.5 -right-0.5 h-4 min-w-[16px] flex items-center justify-center rounded-full bg-primary text-white text-[10px] font-bold px-1">
                            {{ cart.itemCount }}
                        </span>
                    </RouterLink>

                    <RouterLink :to="auth.isAuthenticated ? '/orders' : '/login'"
                        class="relative px-4 py-2 text-sm font-medium text-text hover:text-primary rounded-[14px] hover:bg-secondary/50 transition-all duration-200"
                        active-class="text-primary bg-secondary/50">
                        Orders
                    </RouterLink>
                </div>

                <div class="hidden md:flex items-center gap-2">
                    <template v-if="auth.isAuthenticated">
                        <RouterLink to="/profile"
                            class="ml-1 flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-text hover:text-primary rounded-[14px] hover:bg-secondary/50 transition-all">
                            <div
                                class="h-7 w-7 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                                {{ auth.user?.name?.charAt(0)?.toUpperCase() }}
                            </div>
                            <span class="hidden lg:inline">{{ auth.user?.name }}</span>
                        </RouterLink>
                    </template>

                    <template v-else>
                        <RouterLink to="/login">
                            <ui-button variant="ghost" size="sm" class="h-15 px-5 py-2 rounded-[14px] text-sm font-medium text-text hover:text-primary hover:bg-secondary/50 transition-all duration-200">Login</ui-button>
                        </RouterLink>
                        <RouterLink to="/register">
                            <ui-button variant="primary" size="sm" class="h-15 px-5 py-2 rounded-[14px] text-sm font-medium bg-primary text-white hover:opacity-90 transition-all duration-200">Register</ui-button>
                        </RouterLink>
                    </template>
                </div>

                <button @click="mobileOpen = !mobileOpen" class="md:hidden p-2 text-text">
                    <svg v-if="!mobileOpen" class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    <svg v-else class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>

        <Transition name="slide-up">
            <div v-if="mobileOpen" class="md:hidden border-t border-border bg-white px-4 py-4 space-y-2">
                <RouterLink to="/" @click="closeMobile"
                    class="block px-3 py-2 text-sm font-medium text-text rounded-[12px] hover:bg-secondary/50">Home
                </RouterLink>
                <RouterLink to="/products" @click="closeMobile"
                    class="block px-3 py-2 text-sm font-medium text-text rounded-[12px] hover:bg-secondary/50">Products
                </RouterLink>
                <RouterLink :to="auth.isAuthenticated ? '/wishlist' : '/login'" @click="closeMobile"
                    class="block px-3 py-2 text-sm font-medium text-text rounded-[12px] hover:bg-secondary/50">Wishlist
                </RouterLink>
                <RouterLink :to="auth.isAuthenticated ? '/cart' : '/login'" @click="closeMobile"
                    class="block px-3 py-2 text-sm font-medium text-text rounded-[12px] hover:bg-secondary/50">Cart
                </RouterLink>
                <RouterLink :to="auth.isAuthenticated ? '/orders' : '/login'" @click="closeMobile"
                    class="block px-3 py-2 text-sm font-medium text-text rounded-[12px] hover:bg-secondary/50">Orders
                </RouterLink>
                <template v-if="auth.isAuthenticated">
                    <RouterLink to="/profile" @click="closeMobile"
                        class="block px-3 py-2 text-sm font-medium text-text rounded-[12px] hover:bg-secondary/50">
                        Profile</RouterLink>
                    <button @click="handleLogout(); closeMobile()"
                        class="block w-full text-left px-3 py-2 text-sm font-medium text-error rounded-[12px] hover:bg-red-50">Logout</button>
                </template>
                <template v-else>
                    <RouterLink to="/register" @click="closeMobile"
                        class="block px-3 py-2 text-sm font-medium text-text rounded-[12px] hover:bg-secondary/50">
                        Register</RouterLink>
                </template>
            </div>
        </Transition>
    </nav>
</template>

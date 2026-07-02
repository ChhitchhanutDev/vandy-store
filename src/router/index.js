import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('@/pages/Home.vue'),
        meta: { title: 'Home' },
    },
    {
        path: '/products',
        name: 'Products',
        component: () => import('@/pages/Products.vue'),
        meta: { title: 'Products' },
    },
    {
        path: '/products/:id',
        name: 'ProductDetail',
        component: () => import('@/pages/ProductDetail.vue'),
        meta: { title: 'Product Details' },
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/pages/Login.vue'),
        meta: { title: 'Sign In' },
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('@/pages/Register.vue'),
        meta: { title: 'Create Account' },
    },
    {
        path: '/wishlist',
        name: 'Wishlist',
        component: () => import('@/pages/Wishlist.vue'),
        meta: { requiresAuth: true, title: 'My Wishlist' },
    },
    {
        path: '/cart',
        name: 'Cart',
        component: () => import('@/pages/Cart.vue'),
        meta: { requiresAuth: true, title: 'Shopping Cart' },
    },
    {
        path: '/checkout',
        name: 'Checkout',
        component: () => import('@/pages/Checkout.vue'),
        meta: { requiresAuth: true, title: 'Checkout' },
    },
    {
        path: '/orders',
        name: 'Orders',
        component: () => import('@/pages/Orders.vue'),
        meta: { requiresAuth: true, title: 'My Orders' },
    },
    {
        path: '/orders/:id',
        name: 'OrderDetail',
        component: () => import('@/pages/OrderDetail.vue'),
        meta: { requiresAuth: true, title: 'Order Details' },
    },
    {
        path: '/profile',
        name: 'Profile',
        component: () => import('@/pages/Profile.vue'),
        meta: { requiresAuth: true, title: 'Profile Settings' },
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/pages/NotFound.vue'),
        meta: { title: 'Page Not Found' },
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior() {
        return { top: 0 }
    },
})

router.afterEach((to) => {
    document.title = to.meta?.title ? `${to.meta.title} | Vandy's Store` : "Vandy's Store"
})

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token')

    if (to.meta.requiresAuth && !token) {
        return next({ name: 'Login', query: { redirect: to.fullPath } })
    }

    if ((to.name === 'Login' || to.name === 'Register') && token) {
        return next({ name: 'Home' })
    }

    next()
})

export default router

import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('@/pages/Home.vue'),
    },
    {
        path: '/products',
        name: 'Products',
        component: () => import('@/pages/Products.vue'),
    },
    {
        path: '/products/:id',
        name: 'ProductDetail',
        component: () => import('@/pages/ProductDetail.vue'),
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/pages/Login.vue'),
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('@/pages/Register.vue'),
    },
    {
        path: '/wishlist',
        name: 'Wishlist',
        component: () => import('@/pages/Wishlist.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/cart',
        name: 'Cart',
        component: () => import('@/pages/Cart.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/checkout',
        name: 'Checkout',
        component: () => import('@/pages/Checkout.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/orders',
        name: 'Orders',
        component: () => import('@/pages/Orders.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/orders/:id',
        name: 'OrderDetail',
        component: () => import('@/pages/OrderDetail.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/profile',
        name: 'Profile',
        component: () => import('@/pages/Profile.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/',
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior() {
        return { top: 0 }
    },
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

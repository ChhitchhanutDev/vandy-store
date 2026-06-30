<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
    <div class="relative min-h-screen overflow-hidden flex flex-col items-center justify-center px-4 py-10 select-none">

        <!-- FULL-SCREEN ANIMATED HERO -->
        <div class="absolute inset-0 bg-gradient-to-br from-[#8A5D4F] via-[#B88A6D] to-[#C49B7A] -z-0">
            <div class="absolute top-[8%] left-[6%] w-8 h-8 rounded-full bg-white/15"
                style="animation: animate-float 3s ease-in-out infinite" />
            <div class="absolute top-[18%] right-[10%] w-12 h-12 rounded-full bg-white/10"
                style="animation: animate-float 3.5s ease-in-out .7s infinite" />
            <div class="absolute bottom-[20%] left-[12%] w-6 h-6 rounded-full bg-white/15"
                style="animation: animate-float 2.8s ease-in-out 1.4s infinite" />
            <div class="absolute bottom-[12%] right-[8%] w-10 h-10 rounded-full bg-white/10"
                style="animation: animate-float 3.2s ease-in-out 2.1s infinite" />
            <div class="absolute top-[25%] right-[22%] w-7 h-7 border border-white/25"
                style="animation: animate-float 4s ease-in-out .5s infinite; transform: rotate(45deg)" />
            <div class="absolute top-[55%] left-[20%] w-5 h-5 rounded-full bg-white/10"
                style="animation: animate-float 3.8s ease-in-out 1.8s infinite" />

            <div class="absolute inset-0 flex items-center justify-center">
                <div class="w-[34rem] h-[34rem] rounded-full bg-white/5 blur-3xl animate-pulse" />
            </div>

            <div class="absolute inset-0 overflow-hidden pointer-events-none">
                <div class="absolute top-0 -left-full h-full"
                    style="animation: shimmer 4s ease-in-out infinite; background: linear-gradient(25deg, transparent 0%, rgba(255,255,255,.03) 45%, rgba(255,255,255,.1) 50%, rgba(255,255,255,.03) 55%, transparent 100%); width: 80%" />
            </div>
        </div>

        <!-- BRAND + FORM -->
        <div class="relative z-10 w-[1000px] flex justify-center items-center gap-16">
            <RouterLink to="/" class="flex flex-col items-center gap-5 mb-8">
                <img src="/logo.png" alt="Vandy's Store"
                    class="w-24 h-24 rounded-full object-cover border-4 border-white shadow-xl" />
                <div>
                    <h1 class="text-5xl font-bold text-white text-center">Vandy's Store</h1>
                    <p class="mt-2 text-white text-lg text-center">Timeless Bags For Modern Living</p>
                </div>
            </RouterLink>

            <slot />
        </div>
    </div>
</template>

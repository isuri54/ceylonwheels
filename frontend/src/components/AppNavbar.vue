<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

// Simple utility to check active page for color highlights
const isActive = (path: string) => route.path === path;
</script>

<template>
  <header class="bg-white border-b border-slate-100 h-16 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-50 shadow-sm">
    
    <div class="flex items-center space-x-3 cursor-pointer" @click="router.push('/dashboard')">
      <div class="w-9 h-9 rounded-lg overflow-hidden bg-slate-50 flex items-center justify-center p-0.5 border border-slate-100">
        <img 
          src="https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=100" 
          alt="CeylonWheels Logo" 
          class="w-full h-full object-cover rounded-md"
        />
      </div>
      <span class="text-lg font-black tracking-tight text-[#4A0004]">CeylonWheels</span>
    </div>
    
    <nav class="hidden lg:flex items-center space-x-7 text-xs font-bold uppercase tracking-wider text-slate-500">
      <router-link to="/dashboard" :class="isActive('/dashboard') ? 'text-[#4A0004]' : 'hover:text-[#4A0004] transition'">Home</router-link>
      <a href="#" class="hover:text-[#4A0004] transition">Vehicles</a>
      <a href="#" class="hover:text-[#4A0004] transition">Deals/Offers</a>
      <a href="#" class="hover:text-[#4A0004] transition">About Us</a>
      <a href="#" class="hover:text-[#4A0004] transition">Contact</a>
      <a href="#" class="hover:text-[#4A0004] transition">Support</a>
    </nav>

    <div class="flex items-center space-x-3.5">
      <button class="text-slate-500 hover:text-[#4A0004] flex items-center space-x-1 text-xs font-bold transition px-2 py-1.5 rounded-lg hover:bg-slate-50 cursor-pointer">
        <svg class="w-4 h-4 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
        <span class="hidden sm:inline">Colombo</span>
      </button>

      <button class="text-slate-400 hover:text-slate-600 relative p-2 rounded-full hover:bg-slate-50 transition cursor-pointer">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
        </svg>
        <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-[#4A0004] rounded-full"></span>
      </button>

      <div class="w-8 h-8 rounded-full bg-slate-200 overflow-hidden border border-slate-200 cursor-pointer transition hover:border-[#4A0004]">
        <img 
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" 
          alt="Customer Profile" 
          class="w-full h-full object-cover" 
        />
      </div>
    </div>
  </header>
</template>
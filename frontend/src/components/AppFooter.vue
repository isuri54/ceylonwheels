<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();
const currentYear = new Date().getFullYear();
</script>

<template>
  <footer class="bg-brand-maroon text-slate-400 text-xs font-medium border-t border-slate-800 pt-12 pb-6 mt-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-10 pb-10 border-b border-slate-800">
      
      <div class="space-y-4">
        <div class="flex items-center space-x-2.5 cursor-pointer" @click="router.push('/cusdashboard')">
          <div class="w-8 h-8 rounded-lg overflow-hidden bg-white/10 flex items-center justify-center p-1">
            <img src="/ceylonwheels-logo.png" alt="CeylonWheels Logo" class="w-full h-full object-cover rounded" />
          </div>
          <span class="text-base font-black tracking-tight text-white">CeylonWheels</span>
        </div>
        <p class="text-slate-400 leading-relaxed text-[11px]">
          CeylonWheels is Sri Lanka's premier peer-to-peer vehicle rental marketplace. We connect trusted vehicle owners with verified renters across the island, providing seamless corporate, casual, and commercial mobility options without the traditional hassle.
        </p>
      </div>

      <div class="space-y-3">
        <h4 class="text-xs font-bold uppercase tracking-wider text-white">Quick Navigation</h4>
        <ul class="space-y-2 font-semibold">
          <li><router-link to="/cusdashboard" class="hover:text-white transition">Home Dashboard</router-link></li>
          <li><router-link to="/categories" class="hover:text-white transition">Browse Vehicles</router-link></li>
          <li><a href="#" class="hover:text-white transition">Current Deals & Offers</a></li>
          <li><a href="#" class="hover:text-white transition">Support Center</a></li>
        </ul>
      </div>

      <div class="space-y-3">
        <h4 class="text-xs font-bold uppercase tracking-wider text-white">Rental Guidelines</h4>
        <ul class="space-y-2 text-[11px] leading-relaxed">
          <li>• Minimum renting age limit: 23 years</li>
          <li>• Mandatory verified NIC / Passport & Valid Driving License</li>
          <li>• Flexible self-drive or professional chauffeur packages</li>
          <li>• 24/7 Island-wide roadside mechanical assistance safety net</li>
        </ul>
      </div>

      <div class="space-y-3">
        <h4 class="text-xs font-bold uppercase tracking-wider text-white">Get In Touch</h4>
        <ul class="space-y-2.5">
          <li class="flex items-start space-x-2">
            <svg class="w-4 h-4 text-[#FF4D4D] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            </svg>
            <span>No. 00, Colombo 03, Sri Lanka.</span>
          </li>
          <li class="flex items-center space-x-2">
            <svg class="w-4 h-4 text-[#FF4D4D] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
            </svg>
            <span>+94 11 234 5678 / +94 77 123 4567</span>
          </li>
          <li class="flex items-center space-x-2">
            <svg class="w-4 h-4 text-[#FF4D4D] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
            <span class="truncate">support@ceylonwheels.lk</span>
          </li>
        </ul>
      </div>

    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 font-bold uppercase tracking-wider space-y-2 sm:space-y-0">
      <span>&copy; {{ currentYear }} CeylonWheels Marketplace. All Rights Reserved.</span>
      <div class="flex space-x-6">
        <a href="#" class="hover:text-white transition">Privacy Policy</a>
        <a href="#" class="hover:text-white transition">Terms of Service</a>
      </div>
    </div>
  </footer>
</template>
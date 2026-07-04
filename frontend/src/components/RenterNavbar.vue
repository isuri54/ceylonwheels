<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

// Navbar layout active link tracking utility
const isActive = (path: string) => route.path === path;

// User Profile & Location State
const userTown = ref<string>('Loading...');

// Profile Dropdown State
const isProfileMenuOpen = ref<boolean>(false);
let profileMenuTimeout: any = null;

const openProfileMenu = () => {
  clearTimeout(profileMenuTimeout);
  isProfileMenuOpen.value = true;
};

const closeProfileMenu = () => {
  profileMenuTimeout = setTimeout(() => {
    isProfileMenuOpen.value = false;
  }, 200);
};

const handleLogout = () => {
  localStorage.removeItem('ceylonwheels_token');
  localStorage.removeItem('token');
  isProfileMenuOpen.value = false;
  router.push('/login'); 
};

// Fetch renter profile details on mount
const fetchUserProfile = async () => {
  try {
    const token = localStorage.getItem('ceylonwheels_token') || localStorage.getItem('token');

    if (!token) {
      userTown.value = 'Owner';
      return;
    }

    const response = await fetch('http://localhost:3000/api/v1/auth/profile', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      const userData = await response.json();
      if (userData?.location?.town) {
        userTown.value = userData.location.town;
      } else {
        userTown.value = 'Set Location';
      }
    } else {
      userTown.value = 'Owner';
    }
  } catch (error) {
    console.error("Failed to fetch authenticated renter location profile:", error);
    userTown.value = 'Sri Lanka';
  }
};

onMounted(() => {
  fetchUserProfile();
});
</script>

<template>
  <header class="bg-white border-b border-slate-100 h-16 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-50 shadow-sm">
    
    <div class="flex items-center space-x-3 cursor-pointer shrink-0" @click="router.push('/renterdashboard')">
      <div class="w-9 h-9 rounded-lg overflow-hidden flex items-center justify-center ">
        <img 
          src="/ceylonwheels-logo.png" 
          alt="CeylonWheels Logo" 
          class="w-full h-full object-cover rounded-md"
        />
      </div>
      <div class="flex flex-col leading-none">
        <span class="text-lg font-black tracking-tight text-[#4A0004]">CeylonWheels</span>
        <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Renter Portal</span>
      </div>
    </div>
    
    <nav class="hidden lg:flex items-center space-x-8 text-xs font-bold uppercase tracking-wider text-slate-500 ml-96 mr-auto">
      <router-link to="/renterdashboard" :class="isActive('/renterdashboard') ? 'text-[#4A0004]' : 'hover:text-[#4A0004] transition'">Home</router-link>
      <router-link to="/rentervehicles" :class="isActive('/rentervehicles') ? 'text-[#4A0004]' : 'hover:text-[#4A0004] transition'">My Vehicles</router-link>
      <router-link to="/renterbookings" :class="isActive('/renterbookings') ? 'text-[#4A0004]' : 'hover:text-[#4A0004] transition'">Bookings & Requests</router-link>
      <router-link to="/renterrevenue" :class="isActive('/renterrevenue') ? 'text-[#4A0004]' : 'hover:text-[#4A0004] transition'">Revenue</router-link>
    </nav>

    <div class="flex items-center space-x-3.5 shrink-0">
      
      <button class="text-slate-500 hover:text-[#4A0004] flex items-center space-x-1 text-xs font-bold transition px-2 py-1.5 rounded-lg hover:bg-slate-50 cursor-pointer">
        <svg class="w-4 h-4 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
        <span class="hidden sm:inline capitalize">{{ userTown }}</span>
      </button>

      <button @click="router.push('/renternotifications')" class="text-slate-400 hover:text-slate-600 relative p-2 rounded-full hover:bg-slate-50 transition cursor-pointer">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
        </svg>
        <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-[#4A0004] rounded-full"></span>
      </button>

      <div 
        class="relative"
        @mouseenter="openProfileMenu"
        @mouseleave="closeProfileMenu"
      >
        <div class="w-8 h-8 rounded-full bg-slate-200 overflow-hidden border border-slate-200 cursor-pointer transition hover:border-[#4A0004]">
          <img 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" 
            alt="Renter Profile Image" 
            class="w-full h-full object-cover" 
          />
        </div>

        <transition 
          enter-active-class="transition ease-out duration-100" 
          enter-from-class="transform opacity-0 scale-95" 
          enter-to-class="transform opacity-100 scale-100" 
          leave-active-class="transition ease-in duration-75" 
          leave-from-class="transform opacity-100 scale-100" 
          leave-to-class="transform opacity-0 scale-95"
        >
          <div 
            v-if="isProfileMenuOpen" 
            class="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-lg py-2 z-50 flex flex-col"
          >
            <div class="px-4 py-2 border-b border-slate-50 mb-1">
              <span class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Renter Account</span>
            </div>
            
            <router-link to="/renterprofile" class="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-[#4A0004] transition flex items-center space-x-2">
              <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
              <span>Profile</span>
            </router-link>

            <router-link to="/rentersettings" class="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-[#4A0004] transition flex items-center space-x-2">
              <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              <span>Settings</span>
            </router-link>
            
            <div class="border-t border-slate-100 mt-1 pt-1">
              <button 
                @click="handleLogout" 
                class="w-full text-left px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-50 transition flex items-center space-x-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </transition>
      </div>

    </div>
  </header>
</template>
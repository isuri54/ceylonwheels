<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

// Navbar layout active link tracking utility
const isActive = (path: string) => route.path === path;

// User Profile & Location State
const userTown = ref<string>('Loading...');

// Live Reactive Search State
const searchQuery = ref<string>('');
const isDropdownOpen = ref<boolean>(false);
const searchResults = ref<any[]>([]);
const isLoading = ref<boolean>(false);

// Profile Dropdown State
const isProfileMenuOpen = ref<boolean>(false);
let profileMenuTimeout: any = null;

const openProfileMenu = () => {
  clearTimeout(profileMenuTimeout);
  isProfileMenuOpen.value = true;
};

const closeProfileMenu = () => {
  // Adds a slight delay so the menu doesn't disappear immediately when moving the mouse
  profileMenuTimeout = setTimeout(() => {
    isProfileMenuOpen.value = false;
  }, 200);
};

const handleLogout = () => {
  // Clear authentication tokens
  localStorage.removeItem('ceylonwheels_token');
  localStorage.removeItem('token');
  
  // Close menu and redirect to login or home
  isProfileMenuOpen.value = false;
  router.push('/login'); 
};

// Utility function to scroll smoothly to a specific footer section ID
const scrollToFooterSection = (elementId: string) => {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } else {
    // If the user isn't on the dashboard home layout, take them there first
    router.push('/cusdashboard').then(() => {
      setTimeout(() => {
        document.getElementById(elementId)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    });
  }
};

// Fetch user profile details on mount to parse signup location
const fetchUserProfile = async () => {
  try {
    const token = localStorage.getItem('ceylonwheels_token') || localStorage.getItem('token');

    if (!token) {
      userTown.value = 'Guest';
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
      userTown.value = 'Guest';
    }
  } catch (error) {
    console.error("Failed to fetch authenticated user location profile:", error);
    userTown.value = 'Sri Lanka';
  }
};

onMounted(() => {
  fetchUserProfile();
});

watch(searchQuery, async (newQuery) => {
  const trimmedQuery = newQuery.trim();
  
  if (trimmedQuery.length === 0) {
    searchResults.value = [];
    isDropdownOpen.value = false;
    return;
  }

  try {
    isLoading.value = true;
    isDropdownOpen.value = true;
    
    const response = await fetch(`http://localhost:3000/api/v1/vehicles/search?q=${encodeURIComponent(trimmedQuery)}`);
    if (response.ok) {
      searchResults.value = await response.json();
    }
  } catch (error) {
    console.error("Failed to sync client autocomplete streams:", error);
  } finally {
    isLoading.value = false;
  }
});

const handleBlur = () => {
  setTimeout(() => {
    isDropdownOpen.value = false;
  }, 200);
};

const selectVehicle = (vehicleId: string) => {
  searchQuery.value = '';
  isDropdownOpen.value = false;
  router.push(`/vehicles/${vehicleId}`);
};
</script>

<template>
  <header class="bg-white border-b border-slate-100 h-16 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-50 shadow-sm">
    
    <div class="flex items-center space-x-3 cursor-pointer shrink-0" @click="router.push('/cusdashboard')">
      <div class="w-9 h-9 rounded-lg overflow-hidden flex items-center justify-center ">
        <img 
          src="/ceylonwheels-logo.png" 
          alt="CeylonWheels Logo" 
          class="w-full h-full object-cover rounded-md"
        />
      </div>
      <span class="text-lg font-black tracking-tight text-[#4A0004]">CeylonWheels</span>
    </div>
    
    <nav class="hidden lg:flex items-center space-x-10 text-xs font-bold uppercase tracking-wider text-slate-500 ml-28 mr-auto">
      <router-link to="/cusdashboard" :class="isActive('/cusdashboard') ? 'text-[#4A0004]' : 'hover:text-[#4A0004] transition'">Home</router-link>
      <router-link to="/categories" :class="isActive('/categories') ? 'text-[#4A0004]' : 'hover:text-[#4A0004] transition'">Vehicles</router-link>
      <a href="#" class="hover:text-[#4A0004] transition">Deals/Offers</a>
      
      <button @click="scrollToFooterSection('footer-about')" class="hover:text-[#4A0004] transition uppercase font-bold text-xs cursor-pointer focus:outline-none">About Us</button>
      
      <button @click="scrollToFooterSection('footer-contact')" class="hover:text-[#4A0004] transition uppercase font-bold text-xs cursor-pointer focus:outline-none">Contact</button>
      
      <router-link to="/support" :class="isActive('/support') ? 'text-[#4A0004]' : 'hover:text-[#4A0004] transition'">Support</router-link>
    </nav>

    <div class="relative w-64 mx-4 hidden md:block">
      <div class="relative flex items-center">
        <input 
          v-model="searchQuery"
          @focus="isDropdownOpen = searchQuery.trim().length > 0"
          @blur="handleBlur"
          type="text" 
          placeholder="Search vehicles..." 
          class="w-full bg-slate-50 border border-slate-200 text-slate-700 placeholder-slate-400 rounded-xl py-1.5 pl-9 pr-4 text-xs font-medium focus:outline-none focus:border-[#4A0004] focus:bg-white transition"
        />
        <svg class="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
      </div>

      <div 
        v-if="isDropdownOpen" 
        class="absolute left-0 right-0 mt-2 bg-white border border-slate-100 rounded-xl shadow-xl max-h-64 overflow-y-auto z-50 py-1"
      >
        <div v-if="isLoading" class="text-center p-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Searching Vehicles...
        </div>
        
        <div v-else-if="searchResults.length === 0" class="text-center p-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          No matches found
        </div>

        <div v-else>
          <div 
            v-for="car in searchResults" 
            :key="car._id"
            @mousedown="selectVehicle(car._id)"
            class="px-3 py-2 hover:bg-slate-50 flex items-center space-x-3 cursor-pointer transition border-b border-slate-50/50 last:border-0"
          >
            <div class="w-8 h-6 rounded bg-slate-100 overflow-hidden flex-shrink-0">
              <img :src="car.image || 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=50'" class="w-full h-full object-cover" />
            </div>
            <div class="flex-1 min-w-0">
              <span class="text-xs font-bold text-slate-800 block truncate">{{ car.name }}</span>
              <span class="text-[10px] text-slate-400 font-bold block uppercase tracking-tight">{{ car.category }}</span>
            </div>
            <div class="text-right flex-shrink-0">
              <span class="text-[11px] font-extrabold text-[#4A0004] block">LKR {{ car.price.toLocaleString() }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex items-center space-x-3.5 shrink-0">
      <button class="text-slate-500 hover:text-[#4A0004] flex items-center space-x-1 text-xs font-bold transition px-2 py-1.5 rounded-lg hover:bg-slate-50 cursor-pointer">
        <svg class="w-4 h-4 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
        <span class="hidden sm:inline capitalize">{{ userTown }}</span>
      </button>

      <button class="text-slate-400 hover:text-slate-600 relative p-2 rounded-full hover:bg-slate-50 transition cursor-pointer">
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
            alt="Customer Profile" 
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
              <span class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">My Account</span>
            </div>
            
            <router-link to="/cusprofile" class="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-[#4A0004] transition flex items-center space-x-2">
              <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
              <span>Profile</span>
            </router-link>
            
            <router-link to="/cusbookings" class="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-[#4A0004] transition flex items-center space-x-2">
              <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              <span>My Bookings</span>
            </router-link>
            
            <router-link to="/saved-vehicles" class="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-[#4A0004] transition flex items-center space-x-2">
              <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
              <span>Saved Vehicles</span>
            </router-link>

            <router-link to="/cussettings" class="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-[#4A0004] transition flex items-center space-x-2">
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
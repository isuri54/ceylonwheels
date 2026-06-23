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

// Fetch user profile details on mount to parse signup location
const fetchUserProfile = async () => {
  try {
    // Retrieve stored JWT auth token
    const token = localStorage.getItem('ceylonwheels_token') || localStorage.getItem('token');

    // If there's no token, show Guest immediately
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
      // Accessing the 'town' field from the nested 'location' object in MongoDB
      if (userData?.location?.town) {
        userTown.value = userData.location.town;
      } else {
        userTown.value = 'Set Location'; // Fallback if town field isn't populated
      }
    } else {
      userTown.value = 'Guest';
    }
  } catch (error) {
    console.error("Failed to fetch authenticated user location profile:", error);
    userTown.value = 'Sri Lanka'; // Universal rescue fallback string
  }
};

onMounted(() => {
  fetchUserProfile();
});

// Watches input to instantly trigger backend data query streams as the user types
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

// Closes autocomplete panel when input focus is dropped safely
const handleBlur = () => {
  setTimeout(() => {
    isDropdownOpen.value = false;
  }, 200);
};

// Route redirection on selecting a suggestion record item
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
      <router-link to="/categories" class="hover:text-[#4A0004] transition">Vehicles</router-link>
      <a href="#" class="hover:text-[#4A0004] transition">Deals/Offers</a>
      <a href="#" class="hover:text-[#4A0004] transition">About Us</a>
      <a href="#" class="hover:text-[#4A0004] transition">Contact</a>
      <a href="#" class="hover:text-[#4A0004] transition">Support</a>
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
      <!-- Dynamic Real-Time User Location Button Component -->
      <button class="text-slate-500 hover:text-[#4A0004] flex items-center space-x-1 text-xs font-bold transition px-2 py-1.5 rounded-lg hover:bg-slate-50 cursor-pointer">
        <svg class="w-4 h-4 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
        <!-- Binds to userTown variable parsing DB location object -->
        <span class="hidden sm:inline capitalize">{{ userTown }}</span>
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
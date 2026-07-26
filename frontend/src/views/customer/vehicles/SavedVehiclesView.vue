<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AppNavbar from '../../../components/AppNavbar.vue';
import AppFooter from '../../../components/AppFooter.vue';

const router = useRouter();
const savedVehicles = ref<any[]>([]);
const isLoading = ref(true);

// Fetch saved vehicles populated from NestJS backend
const fetchSavedVehicles = async () => {
  try {
    isLoading.value = true;
    const token = localStorage.getItem('ceylonwheels_token');
    
    if (!token) {
      router.push('/login');
      return;
    }

    const response = await fetch('http://localhost:3000/api/v1/vehicles/saved/my-list', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      savedVehicles.value = await response.json();
    } else if (response.status === 401) {
      router.push('/login');
    }
  } catch (error) {
    console.error('Failed to load saved vehicles:', error);
  } finally {
    isLoading.value = false;
  }
};

// Toggle/Remove vehicle directly from saved view list
const removeSavedVehicle = async (vehicleId: string) => {
  try {
    const token = localStorage.getItem('ceylonwheels_token');
    if (!token) return;

    const response = await fetch(`http://localhost:3000/api/v1/vehicles/saved/${vehicleId}/toggle`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      // Optimistically remove from state without re-fetching
      savedVehicles.value = savedVehicles.value.filter(v => v._id !== vehicleId);
    }
  } catch (error) {
    console.error('Failed to remove saved vehicle:', error);
  }
};

onMounted(() => {
  fetchSavedVehicles();
});
</script>

<template>
  <div class="min-h-screen bg-[#FAFAFA] flex flex-col font-sans text-slate-900 antialiased">
    <AppNavbar />

    <main class="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-12 space-y-8">
      
      <div class="border-b border-slate-200/80 pb-6 flex justify-between items-end">
        <div>
          <p class="text-[10px] font-black tracking-widest uppercase text-[#4A0004]">My Account</p>
          <h1 class="text-3xl md:text-4xl font-black tracking-tight uppercase text-slate-900">
            Saved Vehicles
          </h1>
        </div>
        <span class="text-xs font-bold text-slate-500 uppercase tracking-widest">
          {{ savedVehicles.length }} {{ savedVehicles.length === 1 ? 'Listing' : 'Listings' }}
        </span>
      </div>

      <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        <div v-for="i in 3" :key="i" class="h-80 bg-slate-200 rounded-none"></div>
      </div>

      <div v-else-if="savedVehicles.length === 0" class="py-20 text-center space-y-4 bg-white border border-slate-200/60 p-8">
        <div class="text-4xl">🤍</div>
        <h3 class="text-lg font-black uppercase text-slate-800">No Saved Vehicles Yet</h3>
        <p class="text-xs text-slate-500 max-w-md mx-auto">
          You haven't saved any vehicles to your wishlist. Browse our categories and click "Save for Later" on vehicles you like!
        </p>
        <button 
          @click="router.push('/cusdashboard')" 
          class="inline-block bg-[#4A0004] text-white px-6 py-3 text-xs font-black uppercase tracking-widest hover:bg-[#340003] transition"
        >
          Explore Fleet
        </button>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="vehicle in savedVehicles" 
          :key="vehicle._id"
          class="bg-white border border-slate-200/80 hover:shadow-md transition duration-200 flex flex-col group relative"
        >
          <div class="aspect-[16/10] w-full bg-slate-900 overflow-hidden relative">
            <img 
              v-if="vehicle.vehicleImages && Object.values(vehicle.vehicleImages)[0]"
              :src="`http://localhost:3000/${Object.values(vehicle.vehicleImages)[0]}`" 
              :alt="vehicle.model"
              class="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
            <div v-else class="w-full h-full flex items-center justify-center text-slate-500 text-xs uppercase font-mono">
              No Image
            </div>

            <button 
              @click.stop="removeSavedVehicle(vehicle._id)"
              title="Remove from saved"
              class="absolute top-3 right-3 bg-white/90 hover:bg-red-600 hover:text-white text-slate-800 p-2 text-xs transition backdrop-blur-sm shadow"
            >
              ❤️
            </button>
          </div>

          <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
            <div class="space-y-1">
              <span class="text-[9px] font-black uppercase tracking-widest text-slate-400 block">
                {{ vehicle.category }}
              </span>
              <h2 class="text-xl font-black uppercase tracking-tight text-slate-900">
                {{ vehicle.brand }} <span class="text-slate-400 font-light">{{ vehicle.model }}</span>
              </h2>
              <p class="text-xs text-slate-500 font-medium">
                📍 {{ vehicle.addressCity || vehicle.pickupLocation }}
              </p>
            </div>

            <div class="flex items-center space-x-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-t border-slate-100 pt-3">
              <span>{{ vehicle.transmission }}</span>
              <span>•</span>
              <span class="text-[#4A0004]">{{ vehicle.fuelType }}</span>
            </div>

            <div class="flex items-center justify-between border-t border-slate-100 pt-4">
              <div>
                <span class="text-xs text-slate-400 block font-medium">Daily Rate</span>
                <span class="text-lg font-black text-slate-900 tracking-tight">
                  LKR {{ vehicle.dailyPrice?.toLocaleString() }}
                </span>
              </div>

              <button 
                @click="router.push(`/vehicles/${vehicle._id}`)"
                class="bg-slate-900 hover:bg-[#4A0004] text-white text-[10px] font-black uppercase tracking-widest py-2.5 px-4 transition"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>

    </main>

    <AppFooter />
  </div>
</template>
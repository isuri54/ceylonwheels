<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AppNavbar from '../../../components/AppNavbar.vue';

const route = useRoute();
const router = useRouter();

// Pull directly from route params without manual URI decoding wrappers
const categoryTitle = ref(route.params.categoryName as string);
const vehicles = ref<any[]>([]);
const isLoading = ref(true);

const fetchCategoryVehicles = async () => {
  try {
    isLoading.value = true;
    const categoryName = (categoryTitle.value || '').trim();
    const response = await fetch(`http://localhost:3000/api/v1/vehicles/category?name=${encodeURIComponent(categoryName)}`);

    if (response.ok) {
      vehicles.value = await response.json();
    } else {
      const errorText = await response.text();
      console.error('Failed to load vehicles for category:', errorText);
      vehicles.value = [];
    }
  } catch (error) {
    console.error('Error:', error);
    vehicles.value = [];
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchCategoryVehicles();
});
</script>

<template>
  <div class="min-h-screen bg-[#FAFAFA] flex flex-col font-sans text-slate-800 antialiased">
    <AppNavbar />

    <main class="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8 space-y-6">
      <div class="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-400">
        <span class="hover:text-[#4A0004] cursor-pointer transition" @click="router.push('/cusdashboard')">Home</span>
        <span>/</span>
        <span class="hover:text-[#4A0004] cursor-pointer transition" @click="router.push('/categories')">Categories</span>
        <span>/</span>
        <span class="text-slate-600">{{ categoryTitle }}</span>
      </div>

      <div class="space-y-1">
        <h2 class="text-2xl font-black text-slate-900 tracking-tight">{{ categoryTitle }} Showcase</h2>
        <p class="text-slate-400 text-xs font-medium">Browse verified dynamic collection entries matching your chosen classification parameters.</p>
      </div>

      <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div v-for="i in 3" :key="i" class="h-64 bg-slate-200/60 animate-pulse rounded-2xl"></div>
      </div>

      <div v-else-if="vehicles.length === 0" class="bg-white border border-slate-100 p-12 text-center rounded-2xl shadow-sm space-y-2">
        <p class="text-slate-600 font-bold text-sm">No vehicles listed under this category yet.</p>
        <p class="text-slate-400 text-xs">Check back later or view alternative transportation options.</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="vehicle in vehicles" 
          :key="vehicle._id"
          class="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition duration-200 flex flex-col"
        >
          <div class="h-44 bg-slate-100 relative overflow-hidden group">
            <img 
              :src="vehicle.vehicleImages?.front ? `http://localhost:3000/${vehicle.vehicleImages.front}` : 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=400'" 
              :alt="vehicle.model" 
              class="w-full h-full object-cover" 
            />
            <div class="absolute top-3 right-3 bg-gray-100 backdrop-blur-sm shadow-sm border border-slate-100 px-2.5 py-1 rounded-lg text-[11px] font-bold text-slate-700 flex items-center space-x-1 z-10 opacity-80">
              <span>📍</span>
              <span>{{ vehicle.addressCity }}</span>
            </div>
          </div>

          <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
            <div class="space-y-1">
              <div class="flex items-center justify-between">
                <h3 class="font-bold text-slate-900 text-base">{{ vehicle.brand }} {{ vehicle.model }}</h3>
                <span class="text-xs bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded">{{ vehicle.modelYear }}</span>
              </div>
            </div>

            <div class="flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-wider">
              <span class="px-2.5 py-1 bg-slate-50 text-slate-500 rounded-full border border-slate-100">{{ vehicle.fuelType }}</span>
              <span class="px-2.5 py-1 bg-slate-50 text-slate-500 rounded-full border border-slate-100">{{ vehicle.transmission }}</span>
            </div>

            <div class="pt-3 border-t border-slate-50 flex items-center justify-between">
              <div>
                <span class="text-lg font-black text-[#4A0004]">LKR {{ vehicle.dailyPrice }}</span>
                <span class="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Per Day</span>
              </div>
              
              <div class="flex items-center space-x-2">
                <button 
                  @click="router.push(`/vehicles/${vehicle._id}`)" 
                  class="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-3 py-2 rounded-xl text-xs font-bold tracking-wide transition shadow-sm"
                >
                  Details
                </button>
                <button 
                  @click="router.push(`/booking/${vehicle._id}`)" 
                  class="bg-[#4A0004] hover:bg-[#340003] text-white px-3 py-2 rounded-xl text-xs font-bold tracking-wide transition shadow-sm"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
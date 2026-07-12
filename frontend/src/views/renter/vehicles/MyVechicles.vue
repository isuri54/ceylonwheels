<script setup lang="ts">
import { ref } from 'vue';
import RenterNavbar from '../../../components/RenterNavbar.vue';
import RenterSidebar from '../../../components/RenterSidebar.vue';

// Filter states for active/inactive fleet management
const selectedStatusFilter = ref<'all' | 'available' | 'rented' | 'maintenance'>('all');

// Dummy fleet array representing typical Sri Lankan rental options
const vehicles = ref([
  {
    id: 1,
    name: 'Toyota Prius',
    plate: 'WP CAD-1234',
    type: 'Hybrid (White)',
    status: 'available',
    statusLabel: 'Available',
    earningsThisMonth: 'Rs. 120,000',
    tripsCount: 14
  },
  {
    id: 2,
    name: 'Honda Vezel',
    plate: 'WP CAS-5678',
    type: 'SUV (Black)',
    status: 'rented',
    statusLabel: 'Currently Rented',
    earningsThisMonth: 'Rs. 165,000',
    tripsCount: 9
  },
  {
    id: 3,
    name: 'BMW X5',
    plate: 'WP CBA-9012',
    type: 'Luxury SUV (Midnight Blue)',
    status: 'maintenance',
    statusLabel: 'In Garage',
    earningsThisMonth: 'Rs. 90,000',
    tripsCount: 4
  }
]);
</script>

<template>
  <div class="min-h-screen bg-[#FDFCFB] flex flex-col text-slate-800 antialiased">
    <RenterNavbar />

    <div class="flex flex-1 w-full max-w-[1600px] mx-auto">
      
      <RenterSidebar />

      <main class="flex-1 p-4 sm:p-8 md:p-10 min-w-0">
        
        <header class="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <h1 class="text-3xl font-black text-slate-900 tracking-tight">My Vehicles</h1>
          </div>
          
          <router-link 
            :to="{ name: 'add-vehicle' }" 
            class="bg-[#4A0004] hover:bg-[#320003] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition shadow-sm cursor-pointer self-start sm:self-auto flex items-center space-x-2 no-underline"
            >
            <span>+</span>
            <span>Add Vehicle</span>
           </router-link>
        </header>

        <div class="flex space-x-6 border-b border-slate-200/60 pb-3 mb-8 text-xs font-semibold">
          <button @click="selectedStatusFilter = 'all'" :class="selectedStatusFilter === 'all' ? 'text-[#4A0004] border-b-2 border-[#4A0004] pb-3' : 'text-slate-400 hover:text-slate-600'" class="cursor-pointer transition">All Fleet (18)</button>
          <button @click="selectedStatusFilter = 'available'" :class="selectedStatusFilter === 'available' ? 'text-[#4A0004] border-b-2 border-[#4A0004] pb-3' : 'text-slate-400 hover:text-slate-600'" class="cursor-pointer transition">Available (12)</button>
          <button @click="selectedStatusFilter = 'rented'" :class="selectedStatusFilter === 'rented' ? 'text-[#4A0004] border-b-2 border-[#4A0004] pb-3' : 'text-slate-400 hover:text-slate-600'" class="cursor-pointer transition">On Rental (5)</button>
          <button @click="selectedStatusFilter = 'maintenance'" :class="selectedStatusFilter === 'maintenance' ? 'text-[#4A0004] border-b-2 border-[#4A0004] pb-3' : 'text-slate-400 hover:text-slate-600'" class="cursor-pointer transition">Maintenance (1)</button>
        </div>

        <section class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          
          <div v-for="car in vehicles" :key="car.id" class="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between">
            
            <div>
              <div class="w-full h-44 bg-slate-50 border-b border-slate-100 flex items-center justify-center relative">
                <span class="text-xs text-slate-400 font-medium">No Image Uploaded</span>
                <!-- <img :src="car.image" class="w-full h-full object-cover" /> -->
                
                <span :class="{
                  'bg-emerald-50 text-emerald-700 border-emerald-100': car.status === 'available',
                  'bg-blue-50 text-blue-700 border-blue-100': car.status === 'rented',
                  'bg-amber-50 text-amber-700 border-amber-100': car.status === 'maintenance'
                }" class="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border">
                  {{ car.statusLabel }}
                </span>
              </div>

              <div class="p-5">
                <div class="flex items-baseline justify-between">
                  <h3 class="text-lg font-bold text-slate-900 truncate">{{ car.name }}</h3>
                  <span class="text-[11px] font-mono font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{{ car.plate }}</span>
                </div>
                <p class="text-xs text-slate-400 mt-0.5">{{ car.type }}</p>

                <div class="grid grid-cols-2 gap-4 mt-5 pt-4 border-t border-slate-100">
                  <div>
                    <span class="text-[10px] uppercase font-bold text-slate-400 tracking-wide">Monthly Revenue</span>
                    <p class="text-sm font-bold text-slate-800 mt-0.5">{{ car.earningsThisMonth }}</p>
                  </div>
                  <div>
                    <span class="text-[10px] uppercase font-bold text-slate-400 tracking-wide">Total Trips</span>
                    <p class="text-sm font-bold text-slate-800 mt-0.5">{{ car.tripsCount }} bookings</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-slate-50 px-5 py-3 border-t border-slate-100 flex justify-between items-center text-xs">
              <button class="text-slate-500 hover:text-slate-800 font-semibold cursor-pointer transition">View Logs</button>
              <button class="text-[#4A0004] hover:underline font-bold cursor-pointer transition">Edit Details</button>
            </div>

          </div>

        </section>

      </main>
    </div>
  </div>
</template>
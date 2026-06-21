<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AppNavbar from '../../../components/AppNavbar.vue';

const router = useRouter();

const allCategories = ref([
  { name: 'Luxury Sedans', count: '14 Available Cars', desc: 'Premium executive saloons tailored for corporate positioning.', img: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=400' },
  { name: 'Premium SUVs', count: '22 Available Vehicles', desc: 'Robust AWD architectures ready for remote long tours.', img: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=400' },
  { name: 'Exotic Supercars', count: '6 Available Models', desc: 'High-performance tracks to make an unforgettable entrance.', img: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=400' },
  { name: 'Luxury Passenger Vans', count: '11 Available Vans', desc: 'Spacious transport layouts maximizing collective interior comfort.', img: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&q=80&w=400' },
  { name: 'Wedding Luxury Classics', count: '8 Available Cars', desc: 'Timeless vintage selections styled for dynamic wedding shoots.', img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=400' },
  { name: 'Electric Premium Eco', count: '5 Available Models', desc: 'Sustainable, high-autonomy electric drive systems.', img: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&q=80&w=400' },
]);
</script>

<template>
  <div class="min-h-screen bg-[#FAFAFA] flex flex-col font-sans text-slate-800 antialiased">
    <AppNavbar />

    <main class="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8 space-y-6">
      
      <div class="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-400">
        <span class="hover:text-[#4A0004] cursor-pointer transition" @click="router.push('/dashboard')">Home</span>
        <span>/</span>
        <span class="text-slate-600">All Categories</span>
      </div>

      <div class="space-y-1">
        <h2 class="text-2xl font-black text-slate-900 tracking-tight">Vehicle Categories Showcase</h2>
        <p class="text-slate-400 text-xs font-medium">Select a specified vehicle class parameters to view our deep inventory structures.</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="cat in allCategories" 
          :key="cat.name"
          class="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition duration-200 group cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div class="h-44 bg-slate-100 relative overflow-hidden">
              <img :src="cat.img" :alt="cat.name" class="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
            </div>
            <div class="p-5 space-y-1.5">
              <h3 class="text-sm font-bold text-slate-900 group-hover:text-[#4A0004] transition uppercase tracking-wide">{{ cat.name }}</h3>
              <p class="text-slate-500 text-xs font-medium leading-relaxed">{{ cat.desc }}</p>
            </div>
          </div>
          
          <div class="p-5 pt-0 flex items-center justify-between text-xs font-bold border-t border-slate-50/60 mt-2">
            <span class="text-slate-400 uppercase tracking-wider text-[10px]">{{ cat.count }}</span>
            <span class="text-[#4A0004] group-hover:underline flex items-center space-x-1">
              <span>View Selection</span>
              <span>→</span>
            </span>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
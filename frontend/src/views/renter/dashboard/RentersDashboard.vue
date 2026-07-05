<script setup lang="ts">
import { ref } from 'vue';
import RenterNavbar from '../../../components/RenterNavbar.vue';
import RenterSidebar from '../../../components/RenterSidebar.vue';

// Filter state for dashboard timeline
const activeTimeFilter = ref<'today' | 'week'>('today');
</script>

<template>
  <div class="min-h-screen bg-[#FDFCFB] flex flex-col text-slate-800 antialiased">
    <RenterNavbar />

    <div class="flex flex-1 w-full max-w-[1600px] mx-auto">
      
      <RenterSidebar />

      <main class="flex-1 p-4 sm:p-8 md:p-10 min-w-0">
        
        <header class="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-100 pb-2">
          <div>
            
            <h1 class="text-3xl font-black text-slate-900 tracking-tight">Fleet Overview</h1>
          </div>
          
          <div class="flex items-center space-x-1 bg-slate-100/80 p-1 rounded-lg self-start sm:self-auto text-[11px] font-bold">
            <button @click="activeTimeFilter = 'today'" :class="activeTimeFilter === 'today' ? 'bg-white text-[#4A0004] shadow-sm' : 'text-slate-500'" class="px-3 py-1.5 rounded-md transition cursor-pointer">Today</button>
            <button @click="activeTimeFilter = 'week'" :class="activeTimeFilter === 'week' ? 'bg-white text-[#4A0004] shadow-sm' : 'text-slate-500'" class="px-3 py-1.5 rounded-md transition cursor-pointer">This Week</button>
          </div>
        </header>

        <section class="grid grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-12">
          
          <div class="bg-gradient-to-br from-[#3B0003] via-[#4A0004] to-[#250002] rounded-2xl p-5 text-white flex flex-col justify-between shadow-md relative overflow-hidden h-[160px]">
            <div class="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px)] bg-[size:12px] pointer-events-none"></div>
            <div class="flex justify-between items-start relative z-10">
              <span class="text-[10px] font-extrabold uppercase tracking-widest text-slate-300">Total Fleet</span>
              <span class="text-[9px] font-bold bg-white/10 px-2 py-0.5 rounded-full text-white backdrop-blur-sm">Vehicles</span>
            </div>
            <div class="my-auto relative z-10">
              <div class="text-4xl font-black tracking-tight">18</div>
            </div>
            <div class="pt-2.5 border-t border-white/10 relative z-10 flex justify-between text-[10px] text-slate-300 font-bold">
              <span>12 Available</span>
              <span class="text-amber-300">5 Rented</span>
            </div>
          </div>

          <div class="bg-gradient-to-br from-[#064E3B] via-[#047857] to-[#065F46] rounded-2xl p-5 text-white flex flex-col justify-between shadow-md relative overflow-hidden h-[160px]">
            <div class="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px)] bg-[size:12px] pointer-events-none"></div>
            <div class="flex justify-between items-start relative z-10">
              <span class="text-[10px] font-extrabold uppercase tracking-widest text-slate-200">Total Earnings</span>
              <span class="text-[9px] font-bold bg-white/10 px-2 py-0.5 rounded-full text-emerald-100 backdrop-blur-sm">This Month</span>
            </div>
            <div class="my-auto relative z-10">
              <div class="text-2xl sm:text-3xl font-black tracking-tight">Rs. 385,000</div>
            </div>
            <div class="pt-2.5 border-t border-white/10 relative z-10 flex justify-between text-[10px] text-emerald-200">
              <span>Progress to target</span>
              <span class="font-bold text-white">84%</span>
            </div>
          </div>

          <div class="bg-gradient-to-br from-[#1E3A8A] via-[#1D4ED8] to-[#1E40AF] rounded-2xl p-5 text-white flex flex-col justify-between shadow-md relative overflow-hidden h-[160px]">
            <div class="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px)] bg-[size:12px] pointer-events-none"></div>
            <div class="flex justify-between items-start relative z-10">
              <span class="text-[10px] font-extrabold uppercase tracking-widest text-slate-200">New Bookings</span>
              <span class="text-[9px] font-bold bg-white/10 px-2 py-0.5 rounded-full text-blue-100 backdrop-blur-sm">Pending</span>
            </div>
            <div class="my-auto relative z-10">
              <div class="text-4xl font-black tracking-tight">03</div>
            </div>
            <div class="pt-2.5 border-t border-white/10 relative z-10 text-[10px] text-blue-200 font-bold">
              <span>Requires approval</span>
            </div>
          </div>

          <div class="bg-gradient-to-br from-[#1E293B] via-[#334155] to-[#0F172A] rounded-2xl p-5 text-white flex flex-col justify-between shadow-md relative overflow-hidden h-[160px]">
            <div class="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px)] bg-[size:12px] pointer-events-none"></div>
            <div class="flex justify-between items-start relative z-10">
              <span class="text-[10px] font-extrabold uppercase tracking-widest text-slate-300">Rating</span>
              <span class="text-[9px] font-bold bg-white/10 px-2 py-0.5 rounded-full text-amber-300 backdrop-blur-sm">Reviews</span>
            </div>
            <div class="my-auto relative z-10 flex items-baseline space-x-1">
              <div class="text-4xl font-black tracking-tight">4.8</div>
              <span class="text-amber-400 text-lg">★</span>
            </div>
            <div class="pt-2.5 border-t border-white/10 relative z-10 text-[10px] text-slate-300 font-bold">
              <span class="text-emerald-400">Top 5% Renter tier</span>
            </div>
          </div>

        </section>

        <section>
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="text-lg font-bold text-slate-900 tracking-tight">Today's Schedule</h2>
              <p class="text-xs text-slate-500">Timetable of vehicle handovers and customer arrivals.</p>
            </div>
            <button class="text-xs font-semibold text-[#4A0004] hover:text-[#320003] transition tracking-tight bg-slate-100 px-3 py-1.5 rounded-lg cursor-pointer">
              View Full Calendar →
            </button>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between min-h-[220px]">
              <div>
                <div class="flex justify-between items-baseline border-b border-slate-100 pb-3 mb-4">
                  <span class="text-sm font-bold text-slate-900">9:00 AM</span>
                  <span class="text-[11px] font-medium text-blue-600">Customer Pickup</span>
                </div>
                
                <div class="flex items-start justify-between gap-4">
                  <div class="flex-1 min-w-0">
                    <h4 class="text-base font-bold text-slate-900 truncate">Toyota Prius</h4>
                    <p class="text-xs text-slate-500 mt-1 leading-relaxed">Check cleanliness and battery charge level before handing over keys.</p>
                  </div>
                  <div class="w-20 h-14 bg-slate-50 border border-slate-100 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                    <span class="text-[10px] text-slate-400 font-medium">No Image</span>
                  </div>
                </div>
              </div>
              
              <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-xs mt-4">
                <div class="text-slate-500">
                  Status: <span class="text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded">Ready at Bay</span>
                </div>
                <button class="text-[#4A0004] hover:underline font-bold cursor-pointer transition">Hand Over</button>
              </div>
            </div>

            <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between min-h-[220px]">
              <div>
                <div class="flex justify-between items-baseline border-b border-slate-100 pb-3 mb-4">
                  <span class="text-sm font-bold text-slate-900">11:30 AM</span>
                  <span class="text-[11px] font-medium text-emerald-600">Vehicle Return</span>
                </div>
                
                <div class="flex items-start justify-between gap-4">
                  <div class="flex-1 min-w-0">
                    <h4 class="text-base font-bold text-slate-900 truncate">Honda Vezel</h4>
                    <p class="text-xs text-slate-500 mt-1 leading-relaxed">Check fuel levels, look for damage, and accept keys.</p>
                  </div>
                  <div class="w-20 h-14 bg-slate-50 border border-slate-100 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                    <span class="text-[10px] text-slate-400 font-medium">No Image</span>
                    <!-- <img src="/path-to-vezel.jpg" alt="Honda Vezel" class="w-full h-full object-cover" /> -->
                  </div>
                </div>
              </div>
              
              <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-xs mt-4">
                <div class="text-slate-500">
                  Status: <span class="text-slate-600 font-semibold bg-slate-100 px-2 py-0.5 rounded">On the Way</span>
                </div>
                <button class="text-[#4A0004] hover:underline font-bold cursor-pointer transition">Check-In</button>
              </div>
            </div>

            <div class="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between min-h-[220px]">
              <div>
                <div class="flex justify-between items-baseline border-b border-slate-100 pb-3 mb-4">
                  <span class="text-sm font-bold text-slate-900">4:00 PM</span>
                  <span class="text-[11px] font-medium text-purple-600">Trip Starts</span>
                </div>
                
                <div class="flex items-start justify-between gap-4">
                  <div class="flex-1 min-w-0">
                    <h4 class="text-base font-bold text-slate-900 truncate">BMW X5</h4>
                    <p class="text-xs text-slate-500 mt-1 leading-relaxed">Verify driver details and sign contract files.</p>
                  </div>
                  <div class="w-20 h-14 bg-slate-50 border border-slate-100 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                    <span class="text-[10px] text-slate-400 font-medium">No Image</span>
                    <!-- <img src="/path-to-x5.jpg" alt="BMW X5" class="w-full h-full object-cover" /> -->
                  </div>
                </div>
              </div>
              
              <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-xs mt-4">
                <div class="text-slate-500">
                  Status: <span class="text-slate-600 font-semibold bg-slate-100 px-2 py-0.5 rounded">Ready</span>
                </div>
                <button class="text-[#4A0004] hover:underline font-bold cursor-pointer transition">Review Agreement</button>
              </div>
            </div>

          </div>
        </section>

      </main>
    </div>
  </div>
</template>
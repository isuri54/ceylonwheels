<script setup lang="ts">
import { ref } from 'vue';

// Minimal reactive view state if needed later for filtering
const activeTimeFilter = ref<'today' | 'week'>('today');
</script>

<template>
  <div class="min-h-screen bg-[#FDFCFB] text-slate-800 antialiased p-4 sm:p-8 md:p-10 max-w-[1600px] mx-auto">
    
    <!-- Editorial Header Section -->
    <header class="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-100 pb-6">
      <div>
        <div class="flex items-center space-x-2 text-[10px] font-bold text-[#4A0004] tracking-widest uppercase mb-1">
          <span class="w-1.5 h-1.5 rounded-full bg-[#4A0004]"></span>
          <span>Fleet Partner Control</span>
        </div>
        <h1 class="text-3xl font-black text-slate-900 tracking-tight">Fleet Operations</h1>
      </div>
      
      <!-- Timeframe Toggle Indicator -->
      <div class="flex items-center space-x-1 bg-slate-100/80 p-1 rounded-lg self-start sm:self-auto text-[11px] font-bold">
        <button @click="activeTimeFilter = 'today'" :class="activeTimeFilter === 'today' ? 'bg-white text-[#4A0004] shadow-sm' : 'text-slate-500'" class="px-3 py-1.5 rounded-md transition cursor-pointer">Today</button>
        <button @click="activeTimeFilter = 'week'" :class="activeTimeFilter === 'week' ? 'bg-white text-[#4A0004] shadow-sm' : 'text-slate-500'" class="px-3 py-1.5 rounded-md transition cursor-pointer">This Week</button>
      </div>
    </header>

    <!-- Asymmetrical Performance Metrics Architecture (KPIs) -->
    <!-- Broken into structural operational weights instead of 6 identical boxes -->
    <section class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      
      <!-- Primary Core Capacity Card (Merged Context) -->
      <div class="bg-gradient-to-br from-[#290002] via-[#4A0004] to-[#1F0001] rounded-2xl p-6 text-white flex flex-col justify-between shadow-xl relative overflow-hidden group min-h-[180px]">
        <div class="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px)] bg-[size:16px] pointer-events-none"></div>
        <div class="flex justify-between items-start relative z-10">
          <span class="text-[10px] font-extrabold uppercase tracking-widest text-slate-300">Fleet Strength</span>
          <span class="text-[10px] font-bold bg-white/10 px-2 py-0.5 rounded-full text-white backdrop-blur-sm">Total Metrics</span>
        </div>
        <div class="mt-4 relative z-10">
          <div class="text-5xl font-black tracking-tighter">18</div>
          <p class="text-xs font-medium text-slate-300 mt-1">Total managed vehicles registered under contract.</p>
        </div>
        <div class="grid grid-cols-2 gap-2 pt-4 border-t border-white/10 mt-4 relative z-10 text-center">
          <div>
            <div class="text-lg font-black text-emerald-400">12</div>
            <div class="text-[9px] font-bold uppercase text-slate-400 tracking-wider">Available</div>
          </div>
          <div class="border-l border-white/10">
            <div class="text-lg font-black text-amber-400">5</div>
            <div class="text-[9px] font-bold uppercase text-slate-400 tracking-wider">Rented</div>
          </div>
        </div>
      </div>

      <!-- Financial Status Canvas -->
      <div class="bg-white border border-slate-200/80 rounded-2xl p-6 flex flex-col justify-between shadow-sm min-h-[180px] hover:border-slate-300 transition">
        <div class="flex justify-between items-start">
          <span class="text-[10px] font-bold uppercase tracking-widest text-slate-400">Gross Yield</span>
          <span class="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-wider">Live Statement</span>
        </div>
        <div class="my-auto pt-2">
          <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">Monthly Revenue</div>
          <div class="text-3xl font-black text-slate-900 tracking-tight">Rs. 385,000</div>
        </div>
        <div class="text-[10px] font-medium text-slate-400 border-t border-slate-100 pt-3 flex items-center justify-between">
          <span>Pacing against target allocation</span>
          <span class="font-bold text-slate-700">84%</span>
        </div>
      </div>

      <!-- Operational Hurdles & Sentiment Split -->
      <div class="grid grid-cols-2 gap-4">
        <!-- Pending Action Card -->
        <div class="bg-white border border-slate-200/80 rounded-2xl p-5 flex flex-col justify-between shadow-sm group hover:border-[#4A0004]/30 transition">
          <div class="text-[10px] font-bold uppercase tracking-widest text-slate-400">Approvals</div>
          <div class="my-3">
            <div class="text-4xl font-black text-slate-900 tracking-tight group-hover:text-[#4A0004] transition">03</div>
            <div class="text-[10px] font-bold text-[#4A0004] mt-0.5 uppercase tracking-wider">Pending Requests</div>
          </div>
          <div class="text-[9px] font-medium text-slate-400 bg-slate-50 p-1.5 rounded-lg text-center font-bold">Needs Review</div>
        </div>
        
        <!-- Reputation Matrix -->
        <div class="bg-white border border-slate-200/80 rounded-2xl p-5 flex flex-col justify-between shadow-sm">
          <div class="text-[10px] font-bold uppercase tracking-widest text-slate-400">Sentiment</div>
          <div class="my-3">
            <div class="text-4xl font-black text-slate-900 tracking-tight flex items-baseline space-x-1">
              <span>4.8</span>
              <span class="text-xs text-amber-500 font-normal">★</span>
            </div>
            <div class="text-[10px] font-bold text-slate-500 mt-0.5 uppercase tracking-wider">Customer Rating</div>
          </div>
          <div class="text-[9px] font-medium text-emerald-600 bg-emerald-50/50 p-1.5 rounded-lg text-center font-bold">Top 5% Tier</div>
        </div>
      </div>

    </section>

    <!-- Today's Schedule Container Layout -->
    <!-- Re-imagined as a continuous premium horizontal time-flow canvas -->
    <section>
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-lg font-black text-slate-900 tracking-tight">Today's Agenda Ledger</h2>
          <p class="text-xs font-semibold text-slate-400">Chronological pipeline of vehicle deployments and physical turnovers.</p>
        </div>
        <div class="text-xs font-bold text-[#4A0004] hover:underline cursor-pointer tracking-tight">View Master Calendar →</div>
      </div>

      <!-- The Horizontal Timeline Ribbon -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
        
        <!-- Timeline Step 1 -->
        <div class="bg-white border border-slate-200 rounded-2xl p-6 relative shadow-sm transition hover:shadow-md flex flex-col justify-between min-h-[170px]">
          <!-- Top Accent Ribbon Line showing flow continuity -->
          <div class="absolute top-0 left-6 right-6 h-1 bg-[#4A0004] rounded-b-full"></div>
          
          <div class="flex justify-between items-center mt-2">
            <div class="text-sm font-black text-[#4A0004] tracking-tight bg-[#4A0004]/5 px-2.5 py-1 rounded-lg">
              9:00 AM
            </div>
            <span class="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
              Customer Pickup
            </span>
          </div>
          
          <div class="my-4">
            <h4 class="text-base font-bold text-slate-900">Toyota Prius</h4>
            <p class="text-[11px] font-medium text-slate-400 mt-0.5">Ensure detailing protocol and full charge status checkpoint.</p>
          </div>
          
          <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span class="text-slate-400">Status: <strong class="text-amber-600 font-bold">Ready at Bay</strong></span>
            <button class="text-slate-700 hover:text-[#4A0004] font-bold cursor-pointer transition">Dispatch</button>
          </div>
        </div>

        <!-- Timeline Step 2 -->
        <div class="bg-white border border-slate-200 rounded-2xl p-6 relative shadow-sm transition hover:shadow-md flex flex-col justify-between min-h-[170px]">
          <div class="absolute top-0 left-6 right-6 h-1 bg-slate-300 rounded-b-full"></div>
          
          <div class="flex justify-between items-center mt-2">
            <div class="text-sm font-black text-slate-700 tracking-tight bg-slate-100 px-2.5 py-1 rounded-lg">
              11:30 AM
            </div>
            <span class="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
              Vehicle Return
            </span>
          </div>
          
          <div class="my-4">
            <h4 class="text-base font-bold text-slate-900">Honda Vezel</h4>
            <p class="text-[11px] font-medium text-slate-400 mt-0.5">Standard intake evaluation, fuel monitoring, and security logging.</p>
          </div>
          
          <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span class="text-slate-400">Status: <strong class="text-slate-500 font-bold">In Transit</strong></span>
            <button class="text-slate-700 hover:text-[#4A0004] font-bold cursor-pointer transition">Check-In</button>
          </div>
        </div>

        <!-- Timeline Step 3 -->
        <div class="bg-white border border-slate-200 rounded-2xl p-6 relative shadow-sm transition hover:shadow-md flex flex-col justify-between min-h-[170px]">
          <div class="absolute top-0 left-6 right-6 h-1 bg-slate-800 rounded-b-full"></div>
          
          <div class="flex justify-between items-center mt-2">
            <div class="text-sm font-black text-slate-900 tracking-tight bg-slate-900 text-white px-2.5 py-1 rounded-lg">
              4:00 PM
            </div>
            <span class="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-100">
              Booking Starts
            </span>
          </div>
          
          <div class="my-4">
            <h4 class="text-base font-bold text-slate-900">BMW X5</h4>
            <p class="text-[11px] font-medium text-slate-400 mt-0.5">VIP Chauffeur assignment validation & keys verification.</p>
          </div>
          
          <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span class="text-slate-400">Status: <strong class="text-slate-400 font-bold">Staged</strong></span>
            <button class="text-slate-700 hover:text-[#4A0004] font-bold cursor-pointer transition">Review Contract</button>
          </div>
        </div>

      </div>
    </section>

  </div>
</template>
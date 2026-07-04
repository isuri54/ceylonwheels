<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

// Utility to track active styling
const isActive = (path: string) => route.path === path;

// Sidebar navigation structure matching requested items
const menuItems = [
  { name: 'Calendar', path: '/renter/calendar', icon: '📅' },
  { name: 'Availability Manager', path: '/renter/availability', icon: '🟢' },
  { name: 'Maintenance', path: '/renter/maintenance', icon: '🛠' },
  { name: 'Customers', path: '/renter/customers', icon: '👥' },
  { name: 'Reviews', path: '/renter/reviews', icon: '⭐' },
  { name: 'Reports', path: '/renter/reports', icon: '📊' },
  { name: 'Documents', path: '/renter/documents', icon: '📄' },
  { name: 'Settings', path: '/rentersettings', icon: '⚙' },
  { name: 'Help & Support', path: '/renter/support', icon: '❓' }
];
</script>

<template>
  <aside class="w-64 bg-white border-r border-slate-100 h-[calc(100vh-4rem)] sticky top-16 flex flex-col justify-between p-4 shrink-0 hidden md:flex">
    <div class="flex flex-col space-y-1">
      <div class="px-3 py-2 mb-2">
        <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Management</span>
      </div>

      <router-link
        v-for="item in menuItems"
        :key="item.name"
        :to="item.path"
        :class="[
          'flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold transition group',
          isActive(item.path)
            ? 'bg-slate-50 text-[#4A0004]'
            : 'text-slate-600 hover:bg-slate-50/80 hover:text-[#4A0004]'
        ]"
      >
        <span class="text-sm shrink-0 opacity-80 group-hover:opacity-100 transition">
          {{ item.icon }}
        </span>
        <span class="tracking-wide">{{ item.name }}</span>
      </router-link>
    </div>

    <div class="p-3 bg-slate-50/50 rounded-xl border border-slate-100/50">
      <div class="flex items-center justify-between">
        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">System Status</span>
        <span class="flex h-2 w-2 relative">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
      </div>
    </div>
  </aside>
</template>
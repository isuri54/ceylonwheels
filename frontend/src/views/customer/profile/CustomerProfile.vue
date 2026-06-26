<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// UI Management State
const activeTab = ref<'personal' | 'security' | 'history'>('personal');
const isSaving = ref<boolean>(false);
const saveSuccess = ref<boolean>(false);
const saveError = ref<string | null>(null);

// Profile Data Fields
const profileData = ref({
  fullName: '',
  email: '',
  phone: '',
  address: {
    line1: '',
    town: '',
    district: ''
  }
});

// Mock Quick Summary Data for context
const rentalStats = ref({
  activeBookingsCount: 2,
  totalRentalsCount: 12,
  savedVehiclesCount: 5
});

// Fetch user profile details on mount
const fetchUserProfile = async () => {
  try {
    const token = localStorage.getItem('ceylonwheels_token') || localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const response = await fetch('http://localhost:3000/api/v1/auth/profile', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      const responseData = await response.json();
      
      // DEBUG LOG: Run your app, open F12 inspect tools, and look at the actual database payload shape!
      console.log("CeylonWheels API Raw Response Data:", responseData);

      // Extract the object containing user data (handles direct return vs nested object wrappers)
      const data = responseData.user || responseData.data || responseData;

      profileData.value = {
        fullName: data.fullName || '',
        email: data.email || '',
        phone: data.phone || '',
        address: {
          line1: data.location?.line1 || data.address?.line1 || '',
          town: data.location?.town || data.address?.town || '',
          district: data.location?.district || data.address?.district || ''
        }
      };
    }
  } catch (error) {
    console.error("Failed to fetch customer profile details:", error);
  }
};

// Update profile records via API endpoint streams
const updateProfile = async () => {
  isSaving.value = true;
  saveSuccess.value = false;
  saveError.value = null;

  try {
    const token = localStorage.getItem('ceylonwheels_token') || localStorage.getItem('token');
    const response = await fetch('http://localhost:3000/api/v1/auth/profile/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        fullName: profileData.value.fullName,
        phone: profileData.value.phone,
        location: {
          line1: profileData.value.address.line1,
          town: profileData.value.address.town,
          district: profileData.value.address.district
        }
      })
    });

    if (response.ok) {
      saveSuccess.value = true;
      // Auto dismiss success alert window after short pause
      setTimeout(() => { saveSuccess.value = false; }, 3000);
    } else {
      const errData = await response.json();
      saveError.value = errData.message || "Failed to update profile changes.";
    }
  } catch (error) {
    saveError.value = "A client connection pipeline error occurred.";
    console.error(error);
  } finally {
    isSaving.value = false;
  }
};

onMounted(() => {
  fetchUserProfile();
});
</script>

<template>
  <div class="min-h-screen bg-slate-50/50 pb-12">
    <!-- Profile Top Banner section -->
    <div class="bg-white border-b border-slate-100 py-8 px-4 sm:px-6 shadow-sm">
      <div class="max-w-5xl mx-auto flex flex-col md:flex-row items-center md:justify-between space-y-4 md:space-y-0">
        <div class="flex flex-col sm:flex-row items-center sm:space-x-5 text-center sm:text-left">
          <div class="w-20 h-20 rounded-full bg-slate-100 overflow-hidden border-2 border-[#4A0004] shrink-0 shadow-sm relative">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150" 
              alt="Profile avatar"
              class="w-full h-full object-cover"
            />
          </div>
          <div class="mt-3 sm:mt-0">
            <h1 class="text-xl font-black text-slate-800 tracking-tight">{{ profileData.fullName || 'CeylonWheels Member' }}</h1>
            <p class="text-xs font-semibold text-slate-400 mt-0.5">{{ profileData.email }}</p>
            <div class="flex items-center space-x-2 mt-2 justify-center sm:justify-start">
              <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase tracking-wider">Verified Customer</span>
            </div>
          </div>
        </div>

        <!-- System Summary Metric Pill Counters -->
        <div class="flex space-x-3 text-center">
          <div @click="router.push('/bookings')" class="bg-slate-50 border border-slate-200/60 p-3 rounded-xl min-w-[90px] cursor-pointer hover:border-[#4A0004] transition">
            <span class="block text-lg font-black text-[#4A0004]">{{ rentalStats.activeBookingsCount }}</span>
            <span class="text-[10px] font-bold uppercase tracking-tight text-slate-400">Active Trips</span>
          </div>
          <div class="bg-slate-50 border border-slate-200/60 p-3 rounded-xl min-w-[90px]">
            <span class="block text-lg font-black text-slate-700">{{ rentalStats.totalRentalsCount }}</span>
            <span class="text-[10px] font-bold uppercase tracking-tight text-slate-400">Total Rides</span>
          </div>
          <div @click="router.push('/saved')" class="bg-slate-50 border border-slate-200/60 p-3 rounded-xl min-w-[90px] cursor-pointer hover:border-[#4A0004] transition">
            <span class="block text-lg font-black text-slate-700">{{ rentalStats.savedVehiclesCount }}</span>
            <span class="text-[10px] font-bold uppercase tracking-tight text-slate-400">Saved Cars</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main settings tabs container grids -->
    <div class="max-w-5xl mx-auto px-4 sm:px-6 mt-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
      
      <!-- Side Tab Navigation Links Layout Component -->
      <div class="lg:col-span-1 flex flex-col space-y-1">
        <button 
          @click="activeTab = 'personal'"
          :class="activeTab === 'personal' ? 'bg-white text-[#4A0004] border-l-2 border-[#4A0004] shadow-sm font-bold' : 'text-slate-600 hover:bg-white hover:text-[#4A0004] font-medium'"
          class="w-full text-left px-4 py-2.5 rounded-r-xl transition text-xs flex items-center space-x-2.5"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
          <span>Personal Information</span>
        </button>
        
        <button 
          @click="activeTab = 'security'"
          :class="activeTab === 'security' ? 'bg-white text-[#4A0004] border-l-2 border-[#4A0004] shadow-sm font-bold' : 'text-slate-600 hover:bg-white hover:text-[#4A0004] font-medium'"
          class="w-full text-left px-4 py-2.5 rounded-r-xl transition text-xs flex items-center space-x-2.5"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
          <span>Login & Security</span>
        </button>
      </div>

      <!-- Settings Central Processing Panel -->
      <div class="lg:col-span-3 bg-white border border-slate-100 rounded-2xl shadow-sm p-5 sm:p-6">
        
        <!-- Tab 1: Personal Verification & Information Records -->
        <div v-if="activeTab === 'personal'">
          <div class="mb-5 pb-3 border-b border-slate-50">
            <h2 class="text-sm font-bold text-slate-800 uppercase tracking-wider">Verification & Identity</h2>
            <p class="text-[11px] font-medium text-slate-400 mt-0.5">Manage your identity and licensing credentials required for vehicle verification protocols.</p>
          </div>

          <form @submit.prevent="updateProfile" class="space-y-4">
            <!-- Alert Modals UI Status streams -->
            <div v-if="saveSuccess" class="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-xs font-bold text-emerald-600">
              Profile details successfully synchronized with CeylonWheels servers.
            </div>
            <div v-if="saveError" class="bg-rose-50 border border-rose-100 rounded-xl p-3 text-xs font-bold text-rose-600">
              {{ saveError }}
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Full Name</label>
                <input 
                  v-model="profileData.fullName"
                  type="text" 
                  required
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-medium focus:outline-none focus:border-[#4A0004] focus:bg-white transition"
                />
              </div>

              <div>
                <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Email Address</label>
                <!-- Email remains locked to protect account unique entity keys -->
                <input 
                  v-model="profileData.email"
                  type="email" 
                  disabled
                  class="w-full bg-slate-100/70 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-400 font-medium cursor-not-allowed focus:outline-none"
                />
              </div>

              <div>
                <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Phone Number</label>
                <input 
                  v-model="profileData.phone"
                  type="text" 
                  placeholder="e.g., +94771234567"
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-medium focus:outline-none focus:border-[#4A0004] focus:bg-white transition"
                />
              </div>

            </div>

            <!-- Address Regional Metadata mapping blocks -->
            <div class="border-t border-slate-50 mt-6 pt-4">
              <h3 class="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Address & Delivery Delivery Location</h3>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div class="sm:col-span-1">
                  <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Street Address</label>
                  <input 
                    v-model="profileData.address.line1"
                    type="text" 
                    placeholder="No. 12, Main St"
                    class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-medium focus:outline-none focus:border-[#4A0004] focus:bg-white transition"
                  />
                </div>
                <div>
                  <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">City / Town</label>
                  <input 
                    v-model="profileData.address.town"
                    type="text" 
                    placeholder="Pannipitiya"
                    class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-medium focus:outline-none focus:border-[#4A0004] focus:bg-white transition"
                  />
                </div>
                <div>
                  <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">District</label>
                  <input 
                    v-model="profileData.address.district"
                    type="text" 
                    placeholder="Colombo"
                    class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-medium focus:outline-none focus:border-[#4A0004] focus:bg-white transition"
                  />
                </div>
              </div>
            </div>

            <!-- Save Action Button -->
            <div class="flex justify-end pt-4 border-t border-slate-50 mt-6">
              <button 
                type="submit"
                :disabled="isSaving"
                class="bg-[#4A0004] text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl hover:bg-[#340003] transition flex items-center space-x-2 disabled:opacity-50 cursor-pointer"
              >
                <span>{{ isSaving ? 'Saving Changes...' : 'Save Profile' }}</span>
              </button>
            </div>
          </form>
        </div>

        <!-- Tab 2: Security & Password Updating Form -->
        <div v-if="activeTab === 'security'">
          <div class="mb-5 pb-3 border-b border-slate-50">
            <h2 class="text-sm font-bold text-slate-800 uppercase tracking-wider">Account Password</h2>
            <p class="text-[11px] font-medium text-slate-400 mt-0.5">Keep your account guarded by securely modifying your password credentials periodically.</p>
          </div>

          <form @submit.prevent class="space-y-4 max-w-md">
            <div>
              <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Current Password</label>
              <input type="password" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#4A0004] focus:bg-white transition" />
            </div>
            <div>
              <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">New Password</label>
              <input type="password" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#4A0004] focus:bg-white transition" />
            </div>
            <div>
              <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Confirm New Password</label>
              <input type="password" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-[#4A0004] focus:bg-white transition" />
            </div>

            <button type="submit" class="bg-slate-800 text-white font-bold text-xs uppercase tracking-wider px-4 py-2 rounded-xl hover:bg-slate-900 transition mt-2 cursor-pointer">
              Update Security Code
            </button>
          </form>
        </div>

      </div>
    </div>
  </div>
</template>
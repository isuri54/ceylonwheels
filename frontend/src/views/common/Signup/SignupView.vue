<script setup lang="ts">
import { ref, watch } from 'vue';

// Account Hierarchy State Management
const accountRole = ref<'customer' | 'renter'>('customer');
const isCompany = ref<boolean>(false);

const fullName = ref<string>('');
const email = ref<string>('');
const town = ref<string>('');
const district = ref<string>('');
const contactNumber = ref<string>('');
const password = ref<string>('');
const showPassword = ref<boolean>(false);

// Status Messages & Loading states
const isLoading = ref<boolean>(false);
const statusMessage = ref<string | null>(null);
const statusType = ref<'success' | 'error' | null>(null);

const sriLankanDistricts = [
  'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya', 
  'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar', 
  'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee', 
  'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla', 
  'Moneragala', 'Ratnapura', 'Kegalle'
];

// Reset company state if user jumps back to customer tab to prevent stale flags
watch(accountRole, (newRole) => {
  if (newRole === 'customer') {
    isCompany.value = false;
  }
});

// Connected API Form Submission handler
const handleSignupSubmit = async () => {
  isLoading.value = true;
  statusMessage.value = null;
  statusType.value = null;

  const payload = {
    role: accountRole.value,
    isCorporateEntity: isCompany.value, 
    fullName: fullName.value, 
    email: email.value,
    location: { town: town.value, district: district.value },
    phone: contactNumber.value,
    password: password.value
  };
  
  try {
    const response = await fetch('http://localhost:3000/api/v1/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'An error occurred during registration.');
    }

    statusType.value = 'success';
    statusMessage.value = data.message || 'Registration completed successfully!';
    
    if (data.accessToken) {
      localStorage.setItem('ceylonwheels_token', data.accessToken);
    }

    fullName.value = '';
    email.value = '';
    town.value = '';
    district.value = '';
    contactNumber.value = '';
    password.value = '';

  } catch (error: any) {
    statusMessage.value = Array.isArray(error.message) ? error.message[0] : error.message;
    statusType.value = 'error';
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-[#8f0106] via-[#4A0004] to-[#1F0001] flex items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden">
    
    <div class="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
    <div class="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#4A0004]/20 rounded-full blur-[120px] pointer-events-none"></div>

    <div class="bg-white rounded-2xl shadow-2xl flex max-w-5xl w-full overflow-hidden min-h-[640px] border border-white/10 relative z-10 backdrop-blur-sm">
      
      <div class="hidden md:flex md:w-1/2 relative flex-col justify-end overflow-hidden bg-slate-100">
        <img 
          src="https://w0.peakpx.com/wallpaper/791/841/HD-wallpaper-white-car-car-white.jpg" 
          alt="Premium White Vehicle" 
          class="absolute inset-0 object-cover w-full h-full transition-transform duration-700 hover:scale-105"
        />
        
        <div class="relative z-20 w-full bg-gradient-to-b from-[#4A0004]/95 via-[#340003] to-[#1F0001] text-center px-8 pt-6 pb-12 rounded-t-[50%_25%] border-t border-white/10 backdrop-blur-md shadow-[0_-20px_40px_rgba(0,0,0,0.3)]">
          <div class="w-10 h-0.5 bg-white/20 rounded-full mx-auto mb-4"></div>
          <h1 class="text-3xl font-extrabold tracking-tight text-white mb-2">CeylonWheels</h1>
          <p class="text-slate-200/90 text-xs sm:text-sm leading-relaxed font-medium mx-auto max-w-xs">
            Experience the zenith of automotive luxury. Sign up to access our curated collection of premium vehicles.
          </p>
        </div>
      </div>

      <div class="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center bg-white relative">
        
        <div class="mb-6 flex items-center space-x-2.5 cursor-pointer self-start">
          <div class="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-slate-50 border border-slate-100 shadow-sm">
            <img 
              src="/ceylonwheels-logo.png" 
              alt="CeylonWheels Logo" 
              class="w-full h-full object-cover rounded-md"
            />
          </div>
          <span class="text-base font-black tracking-tight text-[#4A0004] uppercase">CeylonWheels</span>
        </div>

        <div>
          <h2 class="text-2xl font-black text-slate-900 tracking-tight">Create Account</h2>
          <p class="text-slate-400 text-xs font-semibold mt-1 mb-5">Join the exclusive network of premium mobility.</p>
        </div>

        <div class="grid grid-cols-2 gap-4 mb-6">
          <div 
            @click="accountRole = 'customer'"
            :class="accountRole === 'customer' ? 'border-[#4A0004] bg-[#4A0004]/[0.02] ring-1 ring-[#4A0004]' : 'border-slate-200 hover:border-slate-300'"
            class="border rounded-xl p-4 flex flex-col justify-between cursor-pointer transition relative group"
          >
            <div class="flex items-center justify-between mb-2">
              <div :class="accountRole === 'customer' ? 'bg-[#4A0004] text-white' : 'bg-slate-50 text-slate-400 group-hover:text-slate-600'" class="w-7 h-7 rounded-lg flex items-center justify-center transition">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
              </div>
              <div v-if="accountRole === 'customer'" class="w-2 h-2 rounded-full bg-[#4A0004]"></div>
            </div>
            <div>
              <h3 class="text-xs font-bold text-slate-800">Customer</h3>
              <p class="text-[10px] font-medium text-slate-400 mt-0.5 leading-tight">Rent premium vehicles</p>
            </div>
          </div>

          <div 
            @click="accountRole = 'renter'"
            :class="accountRole === 'renter' ? 'border-[#4A0004] bg-[#4A0004]/[0.02] ring-1 ring-[#4A0004]' : 'border-slate-200 hover:border-slate-300'"
            class="border rounded-xl p-4 flex flex-col justify-between cursor-pointer transition relative group"
          >
            <div class="flex items-center justify-between mb-2">
              <div :class="accountRole === 'renter' ? 'bg-[#4A0004] text-white' : 'bg-slate-50 text-slate-400 group-hover:text-slate-600'" class="w-7 h-7 rounded-lg flex items-center justify-center transition">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
              </div>
              <div v-if="accountRole === 'renter'" class="w-2 h-2 rounded-full bg-[#4A0004]"></div>
            </div>
            <div>
              <h3 class="text-xs font-bold text-slate-800">Renter</h3>
              <p class="text-[10px] font-medium text-slate-400 mt-0.5 leading-tight">List & manage assets</p>
            </div>
          </div>
        </div>

        <div 
          v-if="accountRole === 'renter'" 
          class="flex items-center space-x-3 mb-5 py-1 px-1 transition-all duration-300"
        >
          <button
            type="button"
            @click="isCompany = !isCompany"
            :class="isCompany ? 'bg-[#4A0004]' : 'bg-slate-200'"
            class="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
          >
            <span
              :class="isCompany ? 'translate-x-4' : 'translate-x-0'"
              class="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out"
            ></span>
          </button>
          <span class="text-xs font-bold text-slate-400 tracking-wide">Register as a Company</span>
        </div>

        <div 
          v-if="statusMessage" 
          :class="statusType === 'success' ? 'bg-emerald-50 border-emerald-500 text-emerald-800' : 'bg-rose-50 border-rose-500 text-rose-800'"
          class="mb-4 p-3.5 border-l-4 rounded-r-xl text-xs font-bold flex items-start space-x-2.5 shadow-sm"
        >
          <svg v-if="statusType === 'success'" class="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <svg v-else class="w-4 h-4 text-rose-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <span>{{ statusMessage }}</span>
        </div>

        <form @submit.prevent="handleSignupSubmit" class="space-y-3.5">
          
          <div>
            <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              <span v-if="accountRole === 'customer'">Full Name</span>
              <span v-else-if="accountRole === 'renter' && isCompany">Company Name</span>
              <span v-else>Name (Renter's Name)</span>
            </label>
            <div class="relative">
              <input 
                v-model="fullName"
                type="text" 
                :placeholder="accountRole === 'renter' && isCompany ? 'e.g., Ceylon Car Rentals Ltd' : 'Jane Smith'" 
                required
                class="w-full border border-slate-200 bg-slate-50/50 rounded-xl py-2 px-4 text-xs font-medium focus:outline-none focus:border-[#4A0004] focus:bg-white transition text-slate-800 placeholder:text-slate-300"
              />
              <span class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none">
                <svg v-if="isCompany" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                <svg v-else class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
              </span>
            </div>
          </div>

          <div>
            <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Email Address</label>
            <div class="relative">
              <input 
                v-model="email"
                type="email" 
                placeholder="john@gmail.com" 
                required
                class="w-full border border-slate-200 bg-slate-50/50 rounded-xl py-2 px-4 text-xs font-medium focus:outline-none focus:border-[#4A0004] focus:bg-white transition text-slate-800 placeholder:text-slate-300"
              />
              <span class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 00-2 2z"/></svg>
              </span>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Town</label>
              <input 
                v-model="town"
                type="text" 
                placeholder="Colombo" 
                required
                class="w-full border border-slate-200 bg-slate-50/50 rounded-xl py-2 px-4 text-xs font-medium focus:outline-none focus:border-[#4A0004] focus:bg-white transition text-slate-800 placeholder:text-slate-300"
              />
            </div>
            <div>
              <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">District</label>
              <div class="relative">
                <select 
                  v-model="district"
                  required
                  class="w-full border border-slate-200 bg-slate-50/50 rounded-xl py-2 pl-4 pr-8 text-xs font-medium focus:outline-none focus:border-[#4A0004] focus:bg-white transition appearance-none cursor-pointer text-slate-700"
                >
                  <option value="" disabled selected>Select District</option>
                  <option v-for="dist in sriLankanDistricts" :key="dist" :value="dist">{{ dist }}</option>
                </select>
                <span class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                </span>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Contact Number</label>
            <div class="relative">
              <input 
                v-model="contactNumber"
                type="tel" 
                placeholder="+94 7X XXX XXXX" 
                required
                class="w-full border border-slate-200 bg-slate-50/50 rounded-xl py-2 px-4 text-xs font-medium focus:outline-none focus:border-[#4A0004] focus:bg-white transition text-slate-800 placeholder:text-slate-300"
              />
              <span class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
              </span>
            </div>
          </div>

          <div>
            <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Password</label>
            <div class="relative">
              <input 
                v-model="password"
                :type="showPassword ? 'text' : 'password'" 
                placeholder="••••••••" 
                required
                class="w-full border border-slate-200 bg-slate-50/50 rounded-xl py-2.5 pl-4 pr-10 text-xs font-medium focus:outline-none focus:border-[#4A0004] focus:bg-white transition text-slate-800 placeholder:text-slate-300"
              />
              <button 
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
              >
                <svg v-if="showPassword" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"/></svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            :disabled="isLoading"
            class="w-full bg-[#4A0004] hover:bg-[#340003] disabled:opacity-60 text-white font-bold py-3 px-4 rounded-xl transition flex items-center justify-center space-x-2 shadow-lg shadow-[#4A0004]/10 mt-5 cursor-pointer text-xs uppercase tracking-wider"
          >
            <svg v-if="isLoading" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            <span v-else class="w-full text-center">Create Account</span>
            <svg v-if="!isLoading" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </button>
        </form>

        <div class="text-center mt-4">
          <p class="text-xs font-semibold text-slate-400">
            Already have an account? 
            <router-link to="/login" class="text-[#4A0004] hover:underline font-bold ml-0.5">Login</router-link>
          </p>
        </div>

        <hr class="border-slate-100 my-4" />

      </div>

    </div>
  </div>
</template>
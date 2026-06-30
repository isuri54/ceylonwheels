<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Form Input State Fields
const email = ref<string>('');
const password = ref<string>('');
const rememberMe = ref<boolean>(false);
const showPassword = ref<boolean>(false);

// Operational Status States
const isLoading = ref<boolean>(false);
const statusMessage = ref<string | null>(null);
const statusType = ref<'success' | 'error' | null>(null);

// Handles communication with the NestJS /api/v1/auth/login endpoint
const handleLoginSubmit = async () => {
  isLoading.value = true;
  statusMessage.value = null;
  statusType.value = null;

  const payload = {
    email: email.value,
    password: password.value
  };

  try {
    const response = await fetch('http://localhost:3000/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Invalid email credentials or password string.');
    }

    statusType.value = 'success';
    statusMessage.value = 'Authentication successful! Redirecting...';

    // Persist JWT token payload to localStorage
    if (data.accessToken) {
      localStorage.setItem('ceylonwheels_token', data.accessToken);
    }

    // Securely route user to their specific dashboard based on their registered system role
    setTimeout(() => {
      if (data.role === 'renter') {
        router.push('/renterdashboard');
      } else {
        // Default fallback routes to customer dashboard if role is 'customer' or unassigned
        router.push('/cusdashboard');
      }
    }, 1200);

  } catch (error: any) {
    statusType.value = 'error';
    statusMessage.value = error.message;
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
            Experience the pinnacle of automotive luxury with our curated collection of world-class vehicles.
          </p>
        </div>
      </div>

      <div class="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center bg-white relative">
        
        <div class="mb-8 flex items-center space-x-2.5 cursor-pointer self-start" @click="router.push('/cusdashboard')">
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
          <h2 class="text-2xl font-black text-slate-900 tracking-tight mt-10">Welcome Back</h2>
          <p class="text-slate-400 text-xs font-semibold mt-1 mb-6">Sign in to access your premium rental collection.</p>
        </div>

        <div 
          v-if="statusMessage" 
          :class="statusType === 'success' ? 'bg-emerald-50 border-emerald-500 text-emerald-800' : 'bg-rose-50 border-rose-500 text-rose-800'"
          class="mb-5 p-3.5 border-l-4 rounded-r-xl text-xs font-bold flex items-start space-x-2.5 shadow-sm"
        >
          <svg v-if="statusType === 'success'" class="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <svg v-else class="w-4 h-4 text-rose-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <span>{{ statusMessage }}</span>
        </div>

        <form @submit.prevent="handleLoginSubmit" class="space-y-4">
          
          <div>
            <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Email Address</label>
            <input 
              v-model="email"
              type="email" 
              placeholder="name@gmail.com" 
              required
              class="w-full border border-slate-200 bg-slate-50/50 rounded-xl py-2.5 px-4 text-xs font-medium focus:outline-none focus:border-[#4A0004] focus:bg-white transition text-slate-800 placeholder:text-slate-300"
            />
          </div>

          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Password</label>
              <a href="#" class="text-[11px] font-bold text-[#4A0004] hover:underline">Forgot Password?</a>
            </div>
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
            <span v-else class="w-full text-center">Login</span>
            <svg v-if="!isLoading" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </button>
        </form>

        <div class="relative flex py-4 items-center">
          <div class="flex-grow border-t border-slate-100"></div>
          <span class="flex-shrink mx-4 text-[9px] text-slate-300 font-bold uppercase tracking-widest">or continue with</span>
          <div class="flex-grow border-t border-slate-100"></div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <button type="button" class="flex items-center justify-center space-x-2 border border-slate-200 rounded-xl py-2 text-xs font-bold text-slate-600 hover:bg-slate-50/80 transition cursor-pointer">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" class="w-3.5 h-3.5" />
            <span>Google</span>
          </button>
          <button type="button" class="flex items-center justify-center space-x-2 border border-slate-200 rounded-xl py-2 text-xs font-bold text-slate-600 hover:bg-slate-50/80 transition cursor-pointer">
            <img src="https://www.svgrepo.com/show/447144/apple-logo.svg" alt="Apple" class="w-3.5 h-3.5 opacity-80" />
            <span>Apple</span>
          </button>
        </div>

        <div class="text-center mt-6">
          <p class="text-xs font-semibold text-slate-400">
            New to CeylonWheels? 
            <router-link to="/" class="text-[#4A0004] hover:underline font-bold ml-0.5">Sign Up</router-link>
          </p>
        </div>

        <hr class="border-slate-100 my-5" />

      </div>

    </div>
  </div>
</template>
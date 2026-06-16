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

    // Securely route user to the main dashboard application scene after a brief delay
    setTimeout(() => {
      router.push('/cusdashboard');
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
  <div class="min-h-screen bg-[#FDFBFB] flex items-center justify-center p-4 sm:p-6 md:p-8">
    
    <div class="bg-white rounded-2xl shadow-xl flex max-w-5xl w-full overflow-hidden min-h-[640px] border border-slate-100">
      
      <div class="hidden md:flex md:w-1/2 relative p-12 flex-col justify-end text-white overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-t from-[#4A0004]/95 via-[#4A0004]/75 to-[#4A0004]/40 z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800" 
          alt="Premium Classic Porsche Sports Car" 
          class="absolute inset-0 object-cover w-full h-full mix-blend-multiply opacity-80"
        />
        
        <div class="relative z-20 mb-30">
          <h1 class="text-4xl font-bold tracking-tight mb-3">CeylonWheels</h1>
          <p class="text-slate-200 text-sm leading-relaxed font-medium max-w-sm mb-10">
            Experience the pinnacle of automotive luxury with our curated collection of world-class vehicles.
          </p>
          <div class="relative z-20 flex items-center space-x-8 text-[11px] font-bold tracking-wider uppercase text-slate-300 border-t border-white/10 pt-4">
          <div>
            <span class="block text-white text-xs font-semibold mb-0.5">SERVICE</span>
            <span class="text-slate-400">24/7 Premium Support</span>
          </div>
          <div>
            <span class="block text-white text-xs font-semibold mb-0.5">Collection</span>
            <span class="text-slate-400">Curated Exotic Collection</span>
          </div>
        </div>
        </div>

        
      </div>

      <div class="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center bg-white">
        <div>
          <h2 class="text-3xl font-bold text-slate-900 tracking-tight">Welcome Back</h2>
          <p class="text-slate-500 text-sm mt-1 mb-8">Sign in to access your premium rental fleet.</p>
        </div>

        <div 
          v-if="statusMessage" 
          :class="statusType === 'success' ? 'bg-emerald-50 border-emerald-500 text-emerald-800' : 'bg-rose-50 border-rose-500 text-rose-800'"
          class="mb-6 p-3.5 border-l-4 rounded-r-xl text-xs font-semibold flex items-start space-x-2.5 shadow-sm"
        >
          <svg v-if="statusType === 'success'" class="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <svg v-else class="w-4 h-4 text-rose-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <span>{{ statusMessage }}</span>
        </div>

        <form @submit.prevent="handleLoginSubmit" class="space-y-5">
          
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email Address</label>
            <input 
              v-model="email"
              type="email" 
              placeholder="name@company.com" 
              required
              class="w-full border border-slate-200 bg-[#FDFBFB] rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-[#4A0004] focus:bg-white transition text-slate-800 placeholder:text-slate-300"
            />
          </div>

          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
              <a href="#" class="text-xs font-bold text-[#4A0004] hover:underline">Forgot Password?</a>
            </div>
            <div class="relative">
              <input 
                v-model="password"
                :type="showPassword ? 'text' : 'password'" 
                placeholder="••••••••" 
                required
                class="w-full border border-slate-200 bg-[#FDFBFB] rounded-xl py-2.5 pl-4 pr-10 text-sm focus:outline-none focus:border-[#4A0004] focus:bg-white transition text-slate-800 placeholder:text-slate-300"
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

          <div class="flex items-center space-x-2.5 pt-1">
            <input 
              id="remember" 
              v-model="rememberMe"
              type="checkbox" 
              class="w-4 h-4 text-[#4A0004] border-slate-300 rounded focus:ring-[#4A0004] cursor-pointer"
            />
            <label id="remember" class="text-xs font-semibold text-slate-500 cursor-pointer select-none">
              Remember me for 30 days
            </label>
          </div>

          <button 
            type="submit" 
            :disabled="isLoading"
            class="w-full bg-[#4A0004] hover:opacity-95 disabled:opacity-60 text-white font-bold py-3 px-4 rounded-xl transition flex items-center justify-center space-x-2 shadow-lg shadow-[#4A0004]/10 mt-6 cursor-pointer"
          >
            <svg v-if="isLoading" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            <span v-else>
              <router-link to="/cusdashboard" class="w-full text-center">
                Login
              </router-link>
            </span>
            <svg v-if="!isLoading" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </button>
        </form>

        <div class="relative flex py-5 items-center">
          <div class="flex-grow border-t border-slate-100"></div>
          <span class="flex-shrink mx-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest">or continue with</span>
          <div class="flex-grow border-t border-slate-100"></div>
        </div>

        <div class="grid grid-cols-2 gap-3.5">
          <button type="button" class="flex items-center justify-center space-x-2 border border-slate-200 rounded-xl py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" class="w-4 h-4" />
            <span>Google</span>
          </button>
          <button type="button" class="flex items-center justify-center space-x-2 border border-slate-200 rounded-xl py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer">
            <img src="https://brandfetch.com/apple.com" alt="Apple" class="w-4 h-4" />
            <span>Apple</span>
          </button>
        </div>

        <div class="text-center mt-6">
          <p class="text-sm text-slate-500 font-medium">
            New to CeylonWheels? 
            <router-link to="/" class="text-[#4A0004] hover:underline font-bold ml-1">Sign Up</router-link>
          </p>
        </div>

        <hr class="border-slate-100 my-6" />

        <div class="flex items-center justify-center space-x-4 text-xs font-semibold text-slate-400">
          <a href="#" class="hover:text-slate-600">Privacy Policy</a>
          <span class="text-slate-200">•</span>
          <a href="#" class="hover:text-slate-600">Terms of Service</a>
          <span class="text-slate-200">•</span>
          <a href="#" class="hover:text-slate-600">Help Center</a>
          </div>
      </div>

    </div>
  </div>
</template>
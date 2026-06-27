<script setup lang="ts">
import { ref, onMounted } from 'vue';

// Settings state management
const settings = ref({
  notifications: {
    emailAlerts: true,
    smsAlerts: false,
    marketingEmails: false
  },
  preferences: {
    language: 'en',
    currency: 'LKR',
    theme: 'light'
  }
});

const isUpdating = ref<boolean>(false);
const statusMessage = ref<{ type: 'success' | 'error', text: string } | null>(null);

// Load existing settings if available
onMounted(() => {
  const savedSettings = localStorage.getItem('ceylonwheels_settings');
  if (savedSettings) {
    try {
      settings.value = JSON.parse(savedSettings);
    } catch (e) {
      console.error("Error parsing settings data", e);
    }
  }
});

// Save settings configuration
const saveSettings = async () => {
  isUpdating.value = true;
  statusMessage.value = null;

  try {
    // Save locally for performance/guest preferences
    localStorage.setItem('ceylonwheels_settings', JSON.stringify(settings.value));

    // Optional API sync pipeline wrapper
    const token = localStorage.getItem('ceylonwheels_token') || localStorage.getItem('token');
    if (token) {
      await fetch('http://localhost:3000/api/v1/user/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings.value)
      });
    }

    statusMessage.value = { type: 'success', text: 'System settings successfully updated.' };
    setTimeout(() => { statusMessage.value = null; }, 3000);
  } catch (error) {
    statusMessage.value = { type: 'error', text: 'Failed to synchronize options with server.' };
  } finally {
    isUpdating.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6">
    <div class="max-w-3xl mx-auto">
    
      <div class="mb-8">
        <h1 class="text-xl font-black text-slate-800 uppercase tracking-tight">System Settings</h1>
        <p class="text-xs font-semibold text-slate-400 mt-1">Configure your app preferences, localized values, and alert criteria.</p>
      </div>

      <div v-if="statusMessage" 
           :class="statusMessage.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-rose-50 border-rose-100 text-rose-600'" 
           class="mb-6 border p-3.5 rounded-xl text-xs font-bold transition">
        {{ statusMessage.text }}
      </div>

      <form @submit.prevent="saveSettings" class="space-y-6">
        
        <!-- Localization & Regional Options -->
        <div class="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 sm:p-6">
          <div class="mb-5 pb-3 border-b border-slate-100">
            <h2 class="text-xs font-black text-slate-800 uppercase tracking-wider">Regional Settings</h2>
            <p class="text-[11px] text-slate-400 font-medium mt-0.5">Adjust default localization variables used during display processing.</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">System Language</label>
              <select v-model="settings.preferences.language" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#4A0004] focus:bg-white transition">
                <option value="en">English (US)</option>
                <option value="si">සිංහල (Sinhala)</option>
                <option value="ta">தமிழ் (Tamil)</option>
              </select>
            </div>

            <div>
              <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Preferred Currency</label>
              <select v-model="settings.preferences.currency" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#4A0004] focus:bg-white transition">
                <option value="LKR">LKR (₨)</option>
                <option value="USD">USD ($)</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Alert Matrix Switches -->
        <div class="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 sm:p-6">
          <div class="mb-5 pb-3 border-b border-slate-100">
            <h2 class="text-xs font-black text-slate-800 uppercase tracking-wider">Notification Metrics</h2>
            <p class="text-[11px] text-slate-400 font-medium mt-0.5">Control how and when you receive message streams regarding your operations.</p>
          </div>

          <div class="space-y-4">
            <!-- Switch 1 -->
            <div class="flex items-center justify-between py-1">
              <div>
                <label class="block text-xs font-bold text-slate-700">Email System Transactions</label>
                <span class="block text-[11px] font-medium text-slate-400">Receive booking invoices, confirmation statements, and verification logs.</span>
              </div>
              <input type="checkbox" v-model="settings.notifications.emailAlerts" class="accent-[#4A0004] w-4 h-4 cursor-pointer" />
            </div>

            <!-- Switch 2 -->
            <div class="flex items-center justify-between py-1 border-t border-slate-50 pt-3">
              <div>
                <label class="block text-xs font-bold text-slate-700">SMS Verification Flags</label>
                <span class="block text-[11px] font-medium text-slate-400">Receive fast mobile network status notifications regarding vehicle tracking states.</span>
              </div>
              <input type="checkbox" v-model="settings.notifications.smsAlerts" class="accent-[#4A0004] w-4 h-4 cursor-pointer" />
            </div>

            <!-- Switch 3 -->
            <div class="flex items-center justify-between py-1 border-t border-slate-50 pt-3">
              <div>
                <label class="block text-xs font-bold text-slate-700">Marketing & Promotional Bulletins</label>
                <span class="block text-[11px] font-medium text-slate-400">Stay informed about seasonal discount campaigns or fleet inventory expansions.</span>
              </div>
              <input type="checkbox" v-model="settings.notifications.marketingEmails" class="accent-[#4A0004] w-4 h-4 cursor-pointer" />
            </div>
          </div>
        </div>

        <!-- Interface Controls -->
        <div class="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 sm:p-6">
          <div class="mb-5 pb-3 border-b border-slate-100">
            <h2 class="text-xs font-black text-slate-800 uppercase tracking-wider">Display Theme</h2>
            <p class="text-[11px] text-slate-400 font-medium mt-0.5">Adjust UI canvas accents for comfortable visibility environments.</p>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div @click="settings.preferences.theme = 'light'" 
                 :class="settings.preferences.theme === 'light' ? 'border-[#4A0004] bg-slate-50/50' : 'border-slate-200'"
                 class="border rounded-xl p-4 flex items-center space-x-3 cursor-pointer transition hover:bg-slate-50/30">
              <div class="w-4 h-4 rounded-full border flex items-center justify-center" :class="settings.preferences.theme === 'light' ? 'border-[#4A0004]' : 'border-slate-300'">
                <div v-if="settings.preferences.theme === 'light'" class="w-2 h-2 rounded-full bg-[#4A0004]"></div>
              </div>
              <div>
                <span class="block text-xs font-bold text-slate-700">Light Canvas</span>
                <span class="block text-[10px] text-slate-400">Default high clarity view</span>
              </div>
            </div>

            <div @click="settings.preferences.theme = 'dark'" 
                 :class="settings.preferences.theme === 'dark' ? 'border-[#4A0004] bg-slate-50/50' : 'border-slate-200'"
                 class="border rounded-xl p-4 flex items-center space-x-3 cursor-pointer transition hover:bg-slate-50/30">
              <div class="w-4 h-4 rounded-full border flex items-center justify-center" :class="settings.preferences.theme === 'dark' ? 'border-[#4A0004]' : 'border-slate-300'">
                <div v-if="settings.preferences.theme === 'dark'" class="w-2 h-2 rounded-full bg-[#4A0004]"></div>
              </div>
              <div>
                <span class="block text-xs font-bold text-slate-700">Dark Canvas</span>
                <span class="block text-[10px] text-slate-400">Low light environment mode</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Processing Buttons -->
        <div class="flex justify-end space-x-3">
          <button type="button" @click="statusMessage = null" class="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl transition cursor-pointer">
            Cancel
          </button>
          <button type="submit" :disabled="isUpdating" class="bg-[#4A0004] hover:bg-[#340003] text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl transition disabled:opacity-50 cursor-pointer">
            {{ isUpdating ? 'Synchronizing...' : 'Save Options' }}
          </button>
        </div>

      </form>
    </div>
  </div>
</template>
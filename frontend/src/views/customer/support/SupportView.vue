<script setup lang="ts">
import { ref } from 'vue';
import AppNavbar from '../../../components/AppNavbar.vue';
import AppFooter from '../../../components/AppFooter.vue';

// Reactive state forms data bindings
const form = ref({
  subject: '',
  bookingId: '',
  priority: 'normal',
  message: ''
});

const isSubmitting = ref(false);
const showSuccessNotification = ref(false);

const handleSupportSubmission = async () => {
  try {
    isSubmitting.value = true;
    
    // Simulate API connection or replace with: await fetch('http://localhost:3000/api/v1/support/tickets'
    await new Promise((resolve) => setTimeout(resolve, 1200));
    
    showSuccessNotification.value = true;
    form.value = { subject: '', bookingId: '', priority: 'normal', message: '' };
    
    setTimeout(() => {
      showSuccessNotification.value = false;
    }, 4000);
  } catch (error) {
    console.error("Failed to transmit support parameters:", error);
  } finally {
    isSubmitting.value = false;
  }
};

const supportChannels = [
  { title: 'Roadside Breakdown Assistance', desc: 'Stuck with a mechanical issue or flat tire? Dispatch emergency towing teams instantly.', actionText: 'Call 24/7 Hotline', icon: '🚨', link: 'tel:+94112345678' },
  { title: 'Booking Alterations', desc: 'Modify scheduled collection times, extend current rental terms, or adjust driver assignment data.', actionText: 'Manage Rentals', icon: '📅', link: '/categories' },
  { title: 'Refunds & Payment Disputes', desc: 'Track pending security deposit releases or report incorrect transaction processing logs.', actionText: 'Billing Portal', icon: '💳', link: '#' }
];
</script>

<template>
  <div class="min-h-screen bg-[#FAFAFA] flex flex-col font-sans text-slate-800 antialiased">
    <AppNavbar />

    <main class="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 md:p-8 space-y-10">
      
      <div class="text-center max-w-2xl mx-auto space-y-2 pt-4">
        <span class="text-xs text-[#4A0004] font-bold uppercase tracking-widest block">CeylonWheels Help Desk</span>
        <h2 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">How Can We Help You Today?</h2>
        <p class="text-slate-400 text-xs sm:text-sm font-medium leading-relaxed">
          Access immediate roadside emergency resolution tracks or open a formal tracking ticket with our customer care operational desk team.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div 
          v-for="channel in supportChannels" 
          :key="channel.title"
          class="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
        >
          <div class="space-y-2">
            <div class="text-2xl h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">{{ channel.icon }}</div>
            <h4 class="text-xs font-black text-slate-900 uppercase tracking-wider pt-1">{{ channel.title }}</h4>
            <p class="text-slate-500 text-[11px] leading-relaxed font-medium">{{ channel.desc }}</p>
          </div>
          <a 
            :href="channel.link" 
            class="w-full text-center bg-slate-50 hover:bg-[#4A0004] text-slate-600 hover:text-white text-[11px] font-bold py-2 rounded-xl transition border border-slate-100 uppercase tracking-wider"
          >
            {{ channel.actionText }}
          </a>
        </div>
      </div>

      <div class="bg-white border border-slate-100 rounded-2xl p-6 sm:p-8 shadow-sm max-w-3xl mx-auto space-y-6">
        <div>
          <h3 class="text-sm font-black text-slate-900 uppercase tracking-wider">Open a Customer Care Ticket</h3>
          <p class="text-slate-400 text-[11px] font-medium mt-0.5">Fill out this configuration framework to document complex claims or verification bugs.</p>
        </div>

        <form @submit.prevent="handleSupportSubmission" class="space-y-4">
          <div v-if="showSuccessNotification" class="bg-emerald-50 border border-emerald-100 text-emerald-800 p-4 rounded-xl text-xs font-bold transition flex items-center space-x-2">
            <svg class="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <span>Ticket logged successfully! Our team will response back within 2 business hours.</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Inquiry Subject *</label>
              <input 
                v-model="form.subject"
                type="text" 
                required
                placeholder="e.g., Security Deposit Delay" 
                class="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 rounded-xl py-2 px-3 text-xs font-medium focus:outline-none focus:border-[#4A0004] focus:bg-white transition"
              />
            </div>
            <div class="space-y-1">
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Booking Reference ID (Optional)</label>
              <input 
                v-model="form.bookingId"
                type="text" 
                placeholder="e.g., CW-98314" 
                class="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 rounded-xl py-2 px-3 text-xs font-medium focus:outline-none focus:border-[#4A0004] focus:bg-white transition"
              />
            </div>
          </div>

          <div class="space-y-1">
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Urgency / Priority Level</label>
            <select 
              v-model="form.priority"
              class="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl py-2 px-3 text-xs font-medium focus:outline-none focus:border-[#4A0004] focus:bg-white transition"
            >
              <option value="low">Low (General Feedback)</option>
              <option value="normal">Normal Inquiry</option>
              <option value="high">High (Active Trip Interruption)</option>
            </select>
          </div>

          <div class="space-y-1">
            <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Detailed Explanation *</label>
            <textarea 
              v-model="form.message"
              rows="4"
              required
              placeholder="Describe your situation comprehensively so our field agents can coordinate solutions..." 
              class="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 rounded-xl py-2 px-3 text-xs font-medium focus:outline-none focus:border-[#4A0004] focus:bg-white transition resize-none"
            ></textarea>
          </div>

          <button 
            type="submit" 
            :disabled="isSubmitting"
            class="w-full bg-[#4A0004] hover:bg-[#340003] text-white text-xs font-bold py-2.5 rounded-xl transition duration-200 disabled:opacity-50 uppercase tracking-wider"
          >
            {{ isSubmitting ? 'Transmitting Ticket Records...' : 'Submit Support Ticket' }}
          </button>
        </form>
      </div>

    </main>
    <AppFooter />
  </div>
</template>
<script setup>
import { ref } from 'vue'

const systemName = ref('CeylonWheels')
const testBackendStatus = ref('Click below to check API')

async function checkApiConnection() {
  try {
    const response = await fetch('http://localhost:3000/api/v1')
    if(response.ok) {
      testBackendStatus.value = 'Connected to NestJS Backend!'
    } else {
      testBackendStatus.value = 'Server responded, but something is misconfigured.'
    }
  } catch (error) {
    testBackendStatus.value = 'Cannot reach backend. Make sure NestJS is running on port 3000.'
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-6">
    
    <header class="text-center mb-8">
      <h1 class="text-4xl font-extrabold text-brand tracking-tight mb-2">
        🚗 {{ systemName }} Dashboard
      </h1>
      <p class="text-slate-600 text-lg">
        AI-Powered Vehicle Rental & Fleet Management System
      </p>
    </header>

    <main class="w-full max-w-md">
      <div class="bg-white rounded-2xl p-6 shadow-xl border border-slate-200 text-center">
        <h3 class="text-xl font-bold text-slate-800 mb-1">Backend Integration</h3>
        <p class="text-xs text-slate-400 uppercase tracking-widest font-bold mb-4">Status Check</p>
        
        <div class="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-200">
          <p class="text-slate-700 font-semibold text-base">{{ testBackendStatus }}</p>
        </div>

        <button 
          @click="checkApiConnection"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition duration-200 shadow-lg shadow-blue-200 cursor-pointer"
        >
          Test Connection to Backend
        </button>
      </div>
    </main>

  </div>
</template>
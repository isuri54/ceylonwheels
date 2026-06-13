<script setup>
import { ref } from 'vue'

// Basic reactive state to test that Vue setup works
const systemName = ref('CeylonWheels')
const testBackendStatus = ref('Click below to check API')

// Simple test method to make sure it can talk to your NestJS server later
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
  <div class="app-container">
    <header>
      <h1>🚗 {{ systemName }} Development Dashboard</h1>
      <p>AI-Powered Vehicle Rental & Fleet Management System</p>
    </header>

    <main>
      <div class="card">
        <h3>Backend Integration Check</h3>
        <p class="status-text">{{ testBackendStatus }}</p>
        <button @click="checkApiConnection">Test Connection to Backend</button>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* Temporary basic styling to make it look presentable */
.app-container {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
  text-align: center;
  color: #333;
}

header h1 {
  color: #1e3a8a; /* Clean blue startup vibe */
}

.card {
  background: #f3f4f6;
  border-radius: 12px;
  padding: 30px;
  margin-top: 30px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
}

.status-text {
  font-weight: bold;
  font-size: 1.1rem;
  margin: 15px 0;
}

button {
  background-color: #2563eb;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}

button:hover {
  background-color: #1d4ed8;
}
</style>
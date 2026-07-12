<script setup lang="ts">
import { ref, onMounted } from 'vue';
import RenterNavbar from '../../../components/RenterNavbar.vue';
import RenterSidebar from '../../../components/RenterSidebar.vue';

// Form Data binding
const form = ref({
  // Vehicle Basics
  brandModel: '',
  licensePlate: '',
  manufactureYear: null,
  fuelType: 'Petrol',
  transmission: 'Auto',
  seatingCapacity: 5,
  
  // Rental Terms & Insurance
  dailyRate: null,
  allowedMileage: null,
  extraMileageCharge: null,
  insuranceProvider: '',
  insurancePolicyNumber: '',
  
  // Renter Information
  renterName: '',
  renterPhone: '',
  renterEmail: '',
});

const isSubmitting = ref(false);
const imageFiles = ref<File[]>([]);
const imagePreviews = ref<string[]>([]);

// Simulating loading profile information to auto-fill
onMounted(async () => {
  try {
    const response = await fetch('http://localhost:3000/renter/profile');
    if (response.ok) {
      const data = await response.json();
      form.value.renterName = data.name || '';
      form.value.renterPhone = data.phone || '';
      form.value.renterEmail = data.email || '';
    }
  } catch (error) {
    console.error('Could not fetch profile data for auto-fill:', error);
  }
});

// Handle image selections cleanly
const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (!target.files) return;

  const files = Array.from(target.files);
  imageFiles.value = [...imageFiles.value, ...files];

  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) imagePreviews.value.push(e.target.result as string);
    };
    reader.readAsDataURL(file);
  });
};

const submitForm = async () => {
  isSubmitting.value = true;
  
  // Append raw form and binary image assets to multipart package
  const formData = new FormData();
  formData.append('data', JSON.stringify(form.value));
  imageFiles.value.forEach((file) => {
    formData.append('images', file);
  });

  try {
    const response = await fetch('http://localhost:3000/vehicles', {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      alert('Vehicle registration sent for approval successfully.');
    } else {
      alert('Failed to register vehicle.');
    }
  } catch (error) {
    console.error(error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-[#FDFCFB] flex flex-col text-slate-800 antialiased">
    <RenterNavbar />

    <div class="flex flex-1 w-full max-w-[1600px] mx-auto">
      <RenterSidebar />

      <main class="flex-1 p-4 sm:p-8 md:p-10 min-w-0">
        <header class="mb-10 border-b border-slate-100 pb-6">
          <h1 class="text-3xl font-bold text-slate-900 tracking-tight">Register New Vehicle</h1>
        </header>

        <form @submit.prevent="submitForm" class="max-w-4xl space-y-10">
          <div class="bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm">
            <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">1. Vehicle Specifications</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-semibold">
              <div class="flex flex-col space-y-1.5">
                <label class="text-slate-500">Brand & Model</label>
                <input v-model="form.brandModel" type="text" placeholder="e.g. Toyota Prius" class="border border-slate-200 rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-[#4A0004] transition" required />
              </div>

              <div class="flex flex-col space-y-1.5">
                <label class="text-slate-500">License Plate Number</label>
                <input v-model="form.licensePlate" type="text" placeholder="e.g. WP CAD-1234" class="border border-slate-200 rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-[#4A0004] transition" required />
              </div>

              <div class="flex flex-col space-y-1.5">
                <label class="text-slate-500">Year of Manufacture</label>
                <input v-model="form.manufactureYear" type="number" placeholder="2018" class="border border-slate-200 rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-[#4A0004] transition" required />
              </div>

              <div class="flex flex-col space-y-1.5">
                <label class="text-slate-500">Fuel System</label>
                <select v-model="form.fuelType" class="border border-slate-200 rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-[#4A0004] bg-white transition">
                  <option>Petrol</option>
                  <option>Diesel</option>
                  <option>Hybrid</option>
                  <option>Electric</option>
                </select>
              </div>

              <div class="flex flex-col space-y-1.5">
                <label class="text-slate-500">Transmission</label>
                <select v-model="form.transmission" class="border border-slate-200 rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-[#4A0004] bg-white transition">
                  <option>Auto</option>
                  <option>Manual</option>
                </select>
              </div>

              <div class="flex flex-col space-y-1.5">
                <label class="text-slate-500">Seating Capacity</label>
                <input v-model="form.seatingCapacity" type="number" class="border border-slate-200 rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-[#4A0004] transition" required />
              </div>
            </div>
          </div>

          <div class="bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm">
            <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">2. Pricing & Operational Rules</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-semibold mb-6">
              <div class="flex flex-col space-y-1.5">
                <label class="text-slate-500">Daily Rate (Rs.)</label>
                <input v-model="form.dailyRate" type="number" placeholder="8500" class="border border-slate-200 rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-[#4A0004] transition" required />
              </div>

              <div class="flex flex-col space-y-1.5">
                <label class="text-slate-500">Daily Allowed Mileage (km)</label>
                <input v-model="form.allowedMileage" type="number" placeholder="100" class="border border-slate-200 rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-[#4A0004] transition" required />
              </div>

              <div class="flex flex-col space-y-1.5">
                <label class="text-slate-500">Extra Mileage Fee (Rs. / km)</label>
                <input v-model="form.extraMileageCharge" type="number" placeholder="80" class="border border-slate-200 rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-[#4A0004] transition" required />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-semibold">
              <div class="flex flex-col space-y-1.5">
                <label class="text-slate-500">Insurance Carrier Company</label>
                <input v-model="form.insuranceProvider" type="text" placeholder="Sri Lanka Insurance, Ceylinco, etc." class="border border-slate-200 rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-[#4A0004] transition" required />
              </div>

              <div class="flex flex-col space-y-1.5">
                <label class="text-slate-500">Insurance Policy Number</label>
                <input v-model="form.insurancePolicyNumber" type="text" placeholder="P-892348912-A" class="border border-slate-200 rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-[#4A0004] transition" required />
              </div>
            </div>
          </div>

          <div class="bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm">
            <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 pb-2 border-b border-slate-100">3. Media Assets</h3>
            <p class="text-xs text-slate-400 mb-4">Provide clear horizontal images showcasing the front, back, interior, and dashboard cluster configurations.</p>
            
            <div class="flex items-center justify-center w-full border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-[#4A0004] transition group bg-slate-50/50">
              <label class="cursor-pointer w-full h-full block">
                <span class="text-xs font-bold text-slate-600 block group-hover:text-[#4A0004] transition">+ Upload Images</span>
                <span class="text-[10px] text-slate-400 mt-1 block">PNG, JPG formats accepted</span>
                <input type="file" multiple class="hidden" accept="image/*" @change="handleImageUpload" />
              </label>
            </div>

            <div v-if="imagePreviews.length" class="grid grid-cols-4 gap-4 mt-6">
              <div v-for="(preview, i) in imagePreviews" :key="i" class="w-full h-24 border border-slate-200 rounded-lg overflow-hidden bg-slate-50 relative">
                <img :src="preview" class="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          <div class="bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm">
            <h3 class="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 pb-2 border-b border-slate-100">4. Partner Verification Contact</h3>
            <p class="text-xs text-slate-400 mb-4">Pulled down from your profile info. Changes will apply globally across all fleet assets.</p>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-semibold">
              <div class="flex flex-col space-y-1.5">
                <label class="text-slate-400">Full Name</label>
                <input v-model="form.renterName" type="text" class="border border-slate-100 bg-slate-50 text-slate-500 rounded-lg px-3 py-2 outline-none cursor-not-allowed" readonly />
              </div>
              <div class="flex flex-col space-y-1.5">
                <label class="text-slate-400">Phone Contact</label>
                <input v-model="form.renterPhone" type="text" class="border border-slate-100 bg-slate-50 text-slate-500 rounded-lg px-3 py-2 outline-none cursor-not-allowed" readonly />
              </div>
              <div class="flex flex-col space-y-1.5">
                <label class="text-slate-400">Email Address</label>
                <input v-model="form.renterEmail" type="email" class="border border-slate-100 bg-slate-50 text-slate-500 rounded-lg px-3 py-2 outline-none cursor-not-allowed" readonly />
              </div>
            </div>
          </div>

          <div class="flex justify-end pt-4 border-t border-slate-100">
            <button type="submit" :disabled="isSubmitting" class="bg-[#4A0004] hover:bg-[#320003] disabled:bg-slate-300 text-white text-xs font-bold px-8 py-3 rounded-xl transition shadow-sm cursor-pointer">
              {{ isSubmitting ? 'Processing Submission...' : 'Publish Vehicle Info' }}
            </button>
          </div>

        </form>
      </main>
    </div>
  </div>
</template>
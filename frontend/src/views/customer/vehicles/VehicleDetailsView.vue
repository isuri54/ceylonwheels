<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AppNavbar from '../../../components/AppNavbar.vue';

const route = useRoute();
const router = useRouter();
const vehicleId = route.params.id;

const vehicle = ref<any>(null);
const isLoading = ref(true);
const activeImageTab = ref('front');

// Dynamic layout reactive states for handling the saved vehicle wishlist
const isSaved = ref(false);
const isSaving = ref(false);

// Dynamic gallery extractor matching backend record fields
const galleryImages = computed(() => {
  if (!vehicle.value?.vehicleImages) return [];
  return Object.entries(vehicle.value.vehicleImages).map(([key, path]) => ({
    id: key,
    label: key.charAt(0).toUpperCase() + key.slice(1),
    url: `http://localhost:3000/${path}`
  }));
});

const fetchVehicleDetails = async () => {
  try {
    isLoading.value = true;
    const response = await fetch(`http://localhost:3000/api/v1/vehicles/${vehicleId}`);
    if (response.ok) {
      vehicle.value = await response.json();
    }
  } catch (error) {
    console.error('Error fetching vehicle details:', error);
  } finally {
    isLoading.value = false;
  }
};

// Check if current user has already pinned this listing
const checkSavedStatus = async () => {
  try {
    const token = localStorage.getItem('ceylonwheels_token') || localStorage.getItem('token');
    if (!token) return;

    // FIX: Updated endpoint path
    const response = await fetch(`http://localhost:3000/api/v1/vehicles/saved/${vehicleId}/status`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (response.ok) {
      const data = await response.json();
      isSaved.value = data.saved;
    }
  } catch (error) {
    console.error('Error checking saved status:', error);
  }
};

// Dispatch action to save or unsave listing
const toggleSaveListing = async () => {
  try {
    const token = localStorage.getItem('ceylonwheels_token') || localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    isSaving.value = true;
    
    // FIX: Updated endpoint path
    const response = await fetch(`http://localhost:3000/api/v1/vehicles/saved/${vehicleId}/toggle`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.ok) {
      const data = await response.json();
      isSaved.value = data.saved;
    }
  } catch (error) {
    console.error('Failed toggling listing save state:', error);
  } finally {
    isSaving.value = false;
  }
};

onMounted(() => {
  fetchVehicleDetails();
  checkSavedStatus();
});
</script>

<template>
  <div class="min-h-screen bg-[#FAFAFA] flex flex-col font-sans text-slate-900 antialiased selection:bg-[#4A0004]/10">
    <AppNavbar />

    <div v-if="isLoading" class="flex-1 max-w-7xl w-full mx-auto p-6 md:p-12 space-y-8 animate-pulse">
      <div class="h-4 bg-slate-200 w-1/4"></div>
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div class="lg:col-span-7 h-[500px] bg-slate-200 rounded-none"></div>
        <div class="lg:col-span-5 space-y-6">
          <div class="h-10 bg-slate-200 w-3/4"></div>
          <div class="h-32 bg-slate-200 w-full"></div>
        </div>
      </div>
    </div>

    <main v-else-if="vehicle" class="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-12 space-y-12">
      
      <div class="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-200/60 pb-8 gap-6">
        <div class="space-y-3">
          <div class="flex items-center space-x-2 text-[10px] font-bold tracking-widest uppercase text-slate-400">
            <span class="hover:text-[#4A0004] cursor-pointer transition" @click="router.push('/cusdashboard')">Vehicles</span>
            <span>/</span>
            <span class="hover:text-[#4A0004] cursor-pointer transition" @click="router.push('/categories')">{{ vehicle.category }}</span>
            <span>/</span>
            <span class="text-slate-600">{{ vehicle.brand }}</span>
          </div>
          
          <h1 class="text-4xl md:text-5xl font-black tracking-tighter uppercase text-slate-900">
            {{ vehicle.brand }} <span class="text-slate-400 font-light">{{ vehicle.model }}</span>
          </h1>
          
          <div class="flex items-center space-x-4 text-xs font-bold text-slate-500">
            <span class="bg-slate-900 text-white px-2.5 py-0.5 tracking-wider">{{ vehicle.modelYear }}</span>
            <span>•</span>
            <span class="uppercase tracking-widest">{{ vehicle.transmission }}</span>
            <span>•</span>
            <span class="uppercase tracking-widest text-[#4A0004]">{{ vehicle.fuelType }}</span>
          </div>
        </div>

        <div class="text-left md:text-right space-y-1">
          <span class="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Pickup Location</span>
          <div class="text-lg font-bold text-slate-800 flex items-center md:justify-end space-x-1.5">
            <span class="text-xs">📍</span>
            <span>{{ vehicle.addressCity }}, {{ vehicle.addressDistrict }} District</span>
          </div>
          <p class="text-[11px] font-medium text-slate-400">The exact address will be shared after the booking is confirmed.</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        <div class="lg:col-span-7 space-y-4">
          <div class="aspect-[16/10] w-full bg-slate-900 overflow-hidden relative group">
            <img 
              :src="`http://localhost:3000/${vehicle.vehicleImages[activeImageTab]}`" 
              :alt="vehicle.model"
              class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-102"
            />
            
            <div class="absolute bottom-4 left-4 bg-slate-900/90 text-white text-[9px] font-bold tracking-widest uppercase px-3 py-1 backdrop-blur-sm">
              View // {{ activeImageTab }}
            </div>
          </div>

          <div class="grid grid-cols-5 gap-2">
            <button 
              v-for="img in galleryImages" 
              :key="img.id"
              @click="activeImageTab = img.id"
              :class="[
                'py-2 text-[10px] font-black tracking-widest uppercase text-center transition border-b-2 font-mono',
                activeImageTab === img.id 
                  ? 'border-[#4A0004] text-slate-900 bg-slate-100' 
                  : 'border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-200'
              ]"
            >
              [{{ img.id.slice(0, 3) }}]
            </button>
          </div>

          <div class="pt-8 space-y-6">
            <h3 class="text-xs font-black uppercase tracking-widest text-slate-400 border-b border-slate-200/60 pb-2">Vehicle Information</h3>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-y-6 gap-x-4">
              <div v-for="(val, label) in {
                'Seating Capacity': `${vehicle.seatingCapacity} Seats`,
                'Number of Doors': `${vehicle.doorsCount} Doors`,
                'Air Conditioning': vehicle.airConditioning === 'Yes' ? 'Available' : 'Not Available',
                'Driver Available': vehicle.driverIncludedAvailable === 'Yes' ? 'Yes' : 'Self-Drive Only',
                'Current Mileage': `${vehicle.currentMileage?.toLocaleString()} KM`,
                'Chassis Number': vehicle.chassisNumber.toUpperCase(),
                'Color': vehicle.color
              }" :key="label" class="space-y-0.5">
                <span class="text-[10px] font-medium text-slate-400 block">{{ label }}</span>
                <span class="text-sm font-bold text-slate-800 tracking-tight">{{ val }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-5 space-y-8 lg:sticky lg:top-8">
          
          <div class="bg-white border-l-4 border-[#4A0004] p-6 space-y-6 shadow-sm">
            <div>
              <span class="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Rental Rates</span>
              <div class="flex items-baseline space-x-2">
                <span class="text-4xl font-black text-slate-900 tracking-tighter">LKR {{ vehicle.dailyPrice.toLocaleString() }}</span>
                <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">/ Day</span>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              <div>
                <span class="text-[10px] font-medium text-slate-400 block">Weekly Price</span>
                <span class="text-sm font-black text-slate-800">LKR {{ vehicle.weeklyPrice.toLocaleString() }}</span>
              </div>
              <div>
                <span class="text-[10px] font-medium text-slate-400 block">Monthly Price</span>
                <span class="text-sm font-black text-slate-800">LKR {{ vehicle.monthlyPrice.toLocaleString() }}</span>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4 pt-2">
              <div>
                <span class="text-[10px] font-medium text-slate-400 block">Security Deposit</span>
                <span class="text-xs font-bold text-slate-700">LKR {{ vehicle.securityDeposit.toLocaleString() }}</span>
              </div>
              <div>
                <span class="text-[10px] font-medium text-slate-400 block">Rental Period</span>
                <span class="text-xs font-bold text-slate-700">Min: {{ vehicle.minimumRentalPeriod }} Day(s)</span>
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <h3 class="text-xs font-black uppercase tracking-widest text-slate-400 border-b border-slate-200/60 pb-2">Rental Rules & Policies</h3>
            
            <div class="space-y-3 text-xs">
              <div class="flex justify-between py-1 border-b border-slate-100">
                <span class="text-slate-400">Fuel Policy</span>
                <span class="font-bold text-slate-800">{{ vehicle.fuelPolicy }}</span>
              </div>
              <div class="flex justify-between py-1 border-b border-slate-100">
                <span class="text-slate-400">Late Return Fee</span>
                <span class="font-bold text-slate-800">LKR {{ vehicle.lateReturnFee }}/Hour</span>
              </div>
              <div class="flex justify-between py-1 border-b border-slate-100">
                <span class="text-slate-400">Extra Kilometer Charge</span>
                <span class="font-bold text-slate-800">LKR {{ vehicle.extraKmCharge }}/KM</span>
              </div>
              <div class="flex justify-between py-1 border-b border-slate-100">
                <span class="text-slate-400">Delivery Options</span>
                <span class="font-bold text-slate-800">
                  {{ vehicle.deliveryAvailable === 'Yes' ? `Available (LKR ${vehicle.deliveryCharges})` : 'Pickup Only' }}
                </span>
              </div>
              <div class="flex justify-between py-1 border-b border-slate-100">
                <span class="text-slate-400">Rules</span>
                <span class="font-bold text-slate-800 flex space-x-2">
                  <span>🚭 {{ vehicle.smokingAllowed === 'Yes' ? 'Smoking Allowed' : 'No Smoking' }}</span>
                  <span>🐾 {{ vehicle.petsAllowed === 'Yes' ? 'Pets Allowed' : 'No Pets' }}</span>
                </span>
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <div class="flex items-center justify-between border-b border-slate-200/60 pb-2">
              <h3 class="text-xs font-black uppercase tracking-widest text-slate-400">Availability Dates</h3>
              <span class="inline-flex items-center px-2 py-0.5 text-[9px] font-bold bg-emerald-50 text-emerald-700 uppercase tracking-widest">
                Available Now
              </span>
            </div>

            <div class="text-xs space-y-2 text-slate-600 bg-slate-100/70 p-4 border border-slate-200/30">
              <div class="flex justify-between">
                <span>Start Date:</span>
                <span class="font-mono font-bold text-slate-800">{{ vehicle.availableStartDate }}</span>
              </div>
              <div class="flex justify-between">
                <span>End Date:</span>
                <span class="font-mono font-bold text-slate-800">{{ vehicle.availableEndDate }}</span>
              </div>
            </div>

            <button 
              @click="router.push(`/booking/${vehicle._id}`)" 
              class="w-full bg-[#4A0004] hover:bg-[#340003] text-white py-4 px-6 text-xs font-black uppercase tracking-widest transition duration-150 ease-in-out shadow-md hover:shadow-lg focus:outline-none"
            >
              Book This Vehicle
            </button>

            <button 
              @click="toggleSaveListing"
              :disabled="isSaving"
              class="w-full border border-slate-300 hover:border-slate-800 text-slate-800 py-3.5 px-6 text-xs font-bold uppercase tracking-widest transition duration-150 ease-in-out flex items-center justify-center space-x-2 focus:outline-none disabled:opacity-60"
            >
              <span>{{ isSaved ? '❤️' : '🤍' }}</span>
              <span>{{ isSaved ? 'Saved to Wishlist' : 'Save for Later' }}</span>
            </button>
          </div>

        </div>
      </div>
    </main>

    <div v-else class="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-4">
      <p class="text-slate-400 text-xs font-bold uppercase tracking-widest">Error</p>
      <h2 class="text-lg font-black text-slate-800 uppercase tracking-wide">Vehicle not found.</h2>
      <button @click="router.push('/categories')" class="text-xs font-bold text-[#4A0004] underline hover:text-slate-900 transition">
        Return to categories
      </button>
    </div>
  </div>
</template>
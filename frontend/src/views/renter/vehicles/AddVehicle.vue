<script setup lang="ts">
import { ref, onMounted } from 'vue';
import RenterNavbar from '../../../components/RenterNavbar.vue';
import RenterSidebar from '../../../components/RenterSidebar.vue';

const isSubmitting = ref(false);
const isFirstTimeOwner = ref(true);

// Form Data binding mapping all 5 strict sections
const form = ref({
  // Vehicle Information
  category: 'Car',
  brand: '',
  model: '',
  modelYear: null,
  registrationNumber: '',
  chassisNumber: '',
  engineNumber: '',
  color: '',
  fuelType: 'Petrol',
  transmission: 'Auto',
  seatingCapacity: 5,
  doorsCount: 4,
  currentMileage: null,
  airConditioning: 'Yes',
  driverIncludedAvailable: 'No',

  //  Rental Information
  dailyPrice: null,
  weeklyPrice: null,
  monthlyPrice: null,
  securityDeposit: null,
  minimumRentalPeriod: 1,
  maximumRentalPeriod: null,
  pickupLocation: '',
  deliveryAvailable: 'No',
  deliveryCharges: 0,
  allowedDistricts: '',
  fuelPolicy: 'Full to Full',
  lateReturnFee: null,
  extraKmCharge: null,
  smokingAllowed: 'No',
  petsAllowed: 'No',
  
  // Availability Calendar Parameters
  availableStartDate: '',
  availableEndDate: '',
  blockedDates: [] as string[],

  // Owner Verification Fields (Retrieved or filled first time)
  ownerName: '',
  ownerPhone: '',
  ownerEmail: '',
  nicNumber: '',
  bankAccountHolder: '',
  bankName: '',
  bankBranch: '',
  bankAccountNumber: '',
  addressHouseNumber: '',
  addressStreet: '',
  addressCity: '',
  addressDistrict: '',
  addressPostalCode: '',
  ownershipConfirmationType: 'Owner'
});

// Temporary raw picker value for adding items to the blocked dates block array
const tempBlockedDate = ref('');

const addBlockedDate = () => {
  if (tempBlockedDate.value && !form.value.blockedDates.includes(tempBlockedDate.value)) {
    form.value.blockedDates.push(tempBlockedDate.value);
    tempBlockedDate.value = '';
  }
};

const removeBlockedDate = (index: number) => {
  form.value.blockedDates.splice(index, 1);
};

// Explicit File Slots for Media and Legal Uploads
const vehicleImages = ref<{ [key: string]: File }>({});
const imagePreviews = ref<{ [key: string]: string }>({});
const documentFiles = ref<{ [key: string]: File }>({});

onMounted(async () => {
  try {
    const response = await fetch('http://localhost:3000/renter/profile-check');
    if (response.ok) {
      const data = await response.json();
      if (data.hasRegisteredBefore) {
        isFirstTimeOwner.value = false;
        form.value.ownerName = data.profile.name || '';
        form.value.ownerPhone = data.profile.phone || '';
        form.value.ownerEmail = data.profile.email || '';
        form.value.nicNumber = data.profile.nic || '';
        form.value.bankAccountHolder = data.profile.bankHolder || '';
        form.value.bankName = data.profile.bankName || '';
        form.value.bankBranch = data.profile.bankBranch || '';
        form.value.bankAccountNumber = data.profile.bankAccount || '';
        form.value.addressHouseNumber = data.profile.houseNum || '';
        form.value.addressStreet = data.profile.street || '';
        form.value.addressCity = data.profile.city || '';
        form.value.addressDistrict = data.profile.district || '';
        form.value.addressPostalCode = data.profile.postalCode || '';
      }
    }
  } catch (error) {
    console.error('Error fetching owner data:', error);
  }
});

const handleFileChange = (event: Event, slotName: string, isImage = false) => {
  const target = event.target as HTMLInputElement;
  if (!target.files || !target.files[0]) return;
  const file = target.files[0];

  if (isImage) {
    vehicleImages.value[slotName] = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) imagePreviews.value[slotName] = e.target.result as string;
    };
    reader.readAsDataURL(file);
  } else {
    documentFiles.value[slotName] = file;
  }
};

const submitForm = async () => {
  isSubmitting.value = true;
  const formData = new FormData();
  
  formData.append('data', JSON.stringify(form.value));
  
  Object.keys(vehicleImages.value).forEach((slot) => {
    formData.append(`image_${slot}`, vehicleImages.value[slot]);
  });

  Object.keys(documentFiles.value).forEach((docSlot) => {
    formData.append(`doc_${docSlot}`, documentFiles.value[docSlot]);
  });

  try {
    const response = await fetch('http://localhost:3000/vehicles', {
      method: 'POST',
      body: formData
    });

    if (response.status === 409) {
      alert('Validation Error: This vehicle registration number or chassis number already exists on the platform.');
      return;
    }

    if (response.ok) {
      alert('Vehicle registration package submitted successfully.');
    } else {
      alert('Failed to submit vehicle registration data.');
    }
  } catch (error) {
    console.error(error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-[#FAF9F6] flex flex-col text-slate-800 antialiased font-sans">
    <RenterNavbar />

    <div class="flex flex-1 w-full max-w-[1600px] mx-auto">
      <RenterSidebar />

      <main class="flex-1 p-6 sm:p-8 md:p-12 min-w-0">
        <header class="mb-12 border-b-2 border-slate-200 pb-6 flex items-baseline justify-between">
          <div>
            <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">Vehicle Onboarding System</h1>
          </div>
          <span class="text-xs text-slate-400 font-medium">All fields required unless marked optional</span>
        </header>

        <form @submit.prevent="submitForm" class="w-full space-y-12">
          
          <div class="bg-white border-2 border-[#4A0004]/90 rounded-xl p-8 shadow-sm">
            <div class="flex items-center space-x-3 mb-6 pb-3 border-b border-slate-100">
              <span class="bg-[#4A0004] text-white text-xs font-black px-2.5 py-1 rounded">1</span>
              <h3 class="text-base font-bold text-slate-900 tracking-wide uppercase">Vehicle Specification Profile</h3>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6 text-xs font-semibold">
              <div class="flex flex-col space-y-1.5">
                <label class="text-slate-500 tracking-wide">Vehicle Category</label>
                <select v-model="form.category" class="border-b-2 border-slate-200 rounded-none py-2 bg-white outline-none focus:border-[#4A0004] text-slate-800 font-medium transition">
                  <option>Car</option><option>Van</option><option>SUV</option><option>Bike</option><option>Bus</option>
                </select>
              </div>
              <div class="flex flex-col space-y-1.5">
                <label class="text-slate-500 tracking-wide">Brand / Manufacturer</label>
                <input v-model="form.brand" type="text" placeholder="e.g. Toyota" class="border-b-2 border-slate-200 rounded-none py-2 outline-none focus:border-[#4A0004] text-slate-800 font-medium transition" required />
              </div>
              <div class="flex flex-col space-y-1.5">
                <label class="text-slate-500 tracking-wide">Model Designation</label>
                <input v-model="form.model" type="text" placeholder="e.g. Prius" class="border-b-2 border-slate-200 rounded-none py-2 outline-none focus:border-[#4A0004] text-slate-800 font-medium transition" required />
              </div>
              <div class="flex flex-col space-y-1.5">
                <label class="text-slate-500 tracking-wide">Model Year</label>
                <input v-model="form.modelYear" type="number" placeholder="e.g. 2019" class="border-b-2 border-slate-200 rounded-none py-2 outline-none focus:border-[#4A0004] text-slate-800 font-medium transition" required />
              </div>
              <div class="flex flex-col space-y-1.5">
                <label class="text-slate-500 tracking-wide">Official Registration Number</label>
                <input v-model="form.registrationNumber" type="text" placeholder="e.g. WP CAD-1234" class="border-b-2 border-slate-200 rounded-none py-2 outline-none focus:border-[#4A0004] text-slate-800 font-medium transition" required />
              </div>
              <div class="flex flex-col space-y-1.5">
                <label class="text-slate-500 tracking-wide">Chassis ID </label>
                <input v-model="form.chassisNumber" type="text" placeholder="Enter full chassis sequence" class="border-b-2 border-slate-200 rounded-none py-2 outline-none focus:border-[#4A0004] text-slate-800 font-medium transition" required />
              </div>
              <div class="flex flex-col space-y-1.5">
                <label class="text-slate-500 tracking-wide">Engine Number </label>
                <input v-model="form.engineNumber" type="text" placeholder="Enter engine serial code" class="border-b-2 border-slate-200 rounded-none py-2 outline-none focus:border-[#4A0004] text-slate-800 font-medium transition" required />
              </div>
              <div class="flex flex-col space-y-1.5">
                <label class="text-slate-500 tracking-wide">Color</label>
                <input v-model="form.color" type="text" placeholder="e.g. Metallic Black" class="border-b-2 border-slate-200 rounded-none py-2 outline-none focus:border-[#4A0004] text-slate-800 font-medium transition" required />
              </div>
              <div class="flex flex-col space-y-1.5">
                <label class="text-slate-500 tracking-wide">Fuel Lifecycle Configuration</label>
                <select v-model="form.fuelType" class="border-b-2 border-slate-200 rounded-none py-2 bg-white outline-none focus:border-[#4A0004] text-slate-800 font-medium transition">
                  <option>Petrol</option><option>Diesel</option><option>Hybrid</option><option>Electric</option>
                </select>
              </div>
              <div class="flex flex-col space-y-1.5">
                <label class="text-slate-500 tracking-wide">Transmission Type</label>
                <select v-model="form.transmission" class="border-b-2 border-slate-200 rounded-none py-2 bg-white outline-none focus:border-[#4A0004] text-slate-800 font-medium transition">
                  <option>Auto</option><option>Manual</option>
                </select>
              </div>
              <div class="flex flex-col space-y-1.5">
                <label class="text-slate-500 tracking-wide">Total Seating Capacity</label>
                <input v-model="form.seatingCapacity" type="number" class="border-b-2 border-slate-200 rounded-none py-2 outline-none focus:border-[#4A0004] text-slate-800 font-medium transition" required />
              </div>
              <div class="flex flex-col space-y-1.5">
                <label class="text-slate-500 tracking-wide">Number of Doors</label>
                <input v-model="form.doorsCount" type="number" class="border-b-2 border-slate-200 rounded-none py-2 outline-none focus:border-[#4A0004] text-slate-800 font-medium transition" required />
              </div>
              <div class="flex flex-col space-y-1.5">
                <label class="text-slate-500 tracking-wide">Current Odometer Log (km)</label>
                <input v-model="form.currentMileage" type="number" placeholder="e.g. 68000" class="border-b-2 border-slate-200 rounded-none py-2 outline-none focus:border-[#4A0004] text-slate-800 font-medium transition" required />
              </div>
              <div class="flex flex-col space-y-1.5">
                <label class="text-slate-500 tracking-wide">Cabin Air Conditioning</label>
                <select v-model="form.airConditioning" class="border-b-2 border-slate-200 rounded-none py-2 bg-white outline-none focus:border-[#4A0004] text-slate-800 font-medium transition">
                  <option>Yes</option><option>No</option>
                </select>
              </div>
              <div class="flex flex-col space-y-1.5">
                <label class="text-slate-500 tracking-wide">Dedicated Driver Option</label>
                <select v-model="form.driverIncludedAvailable" class="border-b-2 border-slate-200 rounded-none py-2 bg-white outline-none focus:border-[#4A0004] text-slate-800 font-medium transition">
                  <option>Yes</option><option>No</option>
                </select>
              </div>
            </div>
          </div>

          <div class="bg-white border-2 border-[#4A0004]/90 rounded-xl p-8 shadow-sm">
            <div class="flex items-center space-x-3 mb-6 pb-3 border-b border-slate-100">
              <span class="bg-[#4A0004] text-white text-xs font-black px-2.5 py-1 rounded">2</span>
              <h3 class="text-base font-bold text-slate-900 tracking-wide uppercase">Rental Parameters & Operations</h3>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6 text-xs font-semibold mb-6">
              <div class="flex flex-col space-y-1.5">
                <label class="text-slate-500">Daily Rental Standard Rate (Rs.)</label>
                <input v-model="form.dailyPrice" type="number" class="border-b-2 border-slate-200 rounded-none py-2 outline-none focus:border-[#4A0004] transition" required />
              </div>
              <div class="flex flex-col space-y-1.5">
                <label class="text-slate-500">Weekly Tier Price <span class="text-slate-400 font-normal">(Optional)</span></label>
                <input v-model="form.weeklyPrice" type="number" class="border-b-2 border-slate-200 rounded-none py-2 outline-none focus:border-[#4A0004] transition" />
              </div>
              <div class="flex flex-col space-y-1.5">
                <label class="text-slate-500">Monthly Tier Price <span class="text-slate-400 font-normal">(Optional)</span></label>
                <input v-model="form.monthlyPrice" type="number" class="border-b-2 border-slate-200 rounded-none py-2 outline-none focus:border-[#4A0004] transition" />
              </div>
              <div class="flex flex-col space-y-1.5">
                <label class="text-slate-500">Upfront Security Deposit (Rs.)</label>
                <input v-model="form.securityDeposit" type="number" class="border-b-2 border-slate-200 rounded-none py-2 outline-none focus:border-[#4A0004] transition" required />
              </div>
              <div class="flex flex-col space-y-1.5">
                <label class="text-slate-500">Minimum Allowed Lease Period (Days)</label>
                <input v-model="form.minimumRentalPeriod" type="number" class="border-b-2 border-slate-200 rounded-none py-2 outline-none focus:border-[#4A0004] transition" required />
              </div>
              <div class="flex flex-col space-y-1.5">
                <label class="text-slate-500">Maximum Allowed Lease Period <span class="text-slate-400 font-normal">(Optional)</span></label>
                <input v-model="form.maximumRentalPeriod" type="number" class="border-b-2 border-slate-200 rounded-none py-2 outline-none focus:border-[#4A0004] transition" />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 text-xs font-semibold mb-6">
              <div class="flex flex-col space-y-1.5">
                <label class="text-slate-500">Primary Dispatch / Pickup Address</label>
                <input v-model="form.pickupLocation" type="text" placeholder="Provide complete garage or house location" class="border-b-2 border-slate-200 rounded-none py-2 outline-none focus:border-[#4A0004] transition" required />
              </div>
              <div class="flex flex-col space-y-1.5">
                <label class="text-slate-500">Permitted Driving Districts</label>
                <input v-model="form.allowedDistricts" type="text" placeholder="e.g. Colombo, Gampaha (Leave blank for island-wide)" class="border-b-2 border-slate-200 rounded-none py-2 outline-none focus:border-[#4A0004] transition" />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6 text-xs font-semibold mb-8">
              <div class="flex flex-col space-y-1.5">
                <label class="text-slate-500">Doorstep Delivery Options</label>
                <select v-model="form.deliveryAvailable" class="border-b-2 border-slate-200 rounded-none py-2 bg-white outline-none focus:border-[#4A0004] transition">
                  <option>No</option><option>Yes</option>
                </select>
              </div>
              <div class="flex flex-col space-y-1.5">
                <label class="text-slate-500">Flat Charge per Delivery km (Rs.)</label>
                <input v-model="form.deliveryCharges" type="number" :disabled="form.deliveryAvailable === 'No'" class="border-b-2 border-slate-200 disabled:bg-slate-50 rounded-none py-2 outline-none focus:border-[#4A0004] transition" />
              </div>
              <div class="flex flex-col space-y-1.5">
                <label class="text-slate-500">Fuel Allocation & Returns Terms</label>
                <input v-model="form.fuelPolicy" type="text" placeholder="e.g. Full to Full" class="border-b-2 border-slate-200 rounded-none py-2 outline-none focus:border-[#4A0004] transition" />
              </div>
              <div class="flex flex-col space-y-1.5">
                <label class="text-slate-500">Overtime / Late Return Fee (Rs. / Hour)</label>
                <input v-model="form.lateReturnFee" type="number" class="border-b-2 border-slate-200 rounded-none py-2 outline-none focus:border-[#4A0004] transition" required />
              </div>
              <div class="flex flex-col space-y-1.5">
                <label class="text-slate-500">Extra Mileage Overhead Fee (Rs. / km)</label>
                <input v-model="form.extraKmCharge" type="number" class="border-b-2 border-slate-200 rounded-none py-2 outline-none focus:border-[#4A0004] transition" required />
              </div>
              <div class="flex flex-col space-y-1.5">
                <label class="text-slate-500">Smoking Allowed Inside?</label>
                <select v-model="form.smokingAllowed" class="border-b-2 border-slate-200 rounded-none py-2 bg-white outline-none focus:border-[#4A0004] transition">
                  <option>No</option><option>Yes</option>
                </select>
              </div>
              <div class="flex flex-col space-y-1.5">
                <label class="text-slate-500">Domestic Pets Allowed Inside?</label>
                <select v-model="form.petsAllowed" class="border-b-2 border-slate-200 rounded-none py-2 bg-white outline-none focus:border-[#4A0004] transition">
                  <option>No</option><option>Yes</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50/60 p-5 border border-slate-200 rounded-lg text-xs font-semibold">
              <div class="flex flex-col space-y-2">
                <label class="text-slate-700 font-bold">Available Custom Fleet Range</label>
                <div class="flex items-center space-x-3 bg-white p-2 rounded border border-slate-200 shadow-inner">
                  <input v-model="form.availableStartDate" type="date" class="outline-none bg-transparent w-full text-slate-800" />
                  <span class="text-slate-400 font-normal font-serif">until</span>
                  <input v-model="form.availableEndDate" type="date" class="outline-none bg-transparent w-full text-slate-800" />
                </div>
              </div>
              
              <div class="flex flex-col space-y-2">
                <label class="text-slate-700 font-bold">Explicit Blocked Windows</label>
                <div class="flex items-center space-x-2 bg-white p-1.5 rounded border border-slate-200 shadow-inner">
                  <input v-model="tempBlockedDate" type="date" class="outline-none bg-transparent flex-1 px-1 text-slate-800" />
                  <button type="button" @click="addBlockedDate" class="bg-[#4A0004] text-white px-4 py-1.5 rounded text-[11px] font-bold tracking-wider uppercase hover:bg-[#320003] transition cursor-pointer">Block Date</button>
                </div>
                <div v-if="form.blockedDates.length" class="flex flex-wrap gap-1.5 mt-2">
                  <span v-for="(date, index) in form.blockedDates" :key="index" class="bg-red-50 text-red-900 border border-red-200 px-2 py-0.5 rounded flex items-center space-x-1 text-[11px] font-medium">
                    <span>{{ date }}</span>
                    <button type="button" @click="removeBlockedDate(index)" class="text-red-400 hover:text-red-900 font-bold ml-1">✕</button>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white border-2 border-[#4A0004]/90 rounded-xl p-8 shadow-sm">
            <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
              <span class="bg-[#4A0004] text-white text-xs font-black px-2.5 py-1 rounded">3</span>
              <h3 class="text-base font-bold text-slate-900 tracking-wide uppercase">Visual Photographic Assets</h3>
            </div>
            <p class="text-xs text-slate-400 mb-8 font-medium">Please provide accurate high-resolution horizontal views. Clear coverage decreases processing approval times. At least 5 perspectives are required to activate listings.</p>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 text-xs font-semibold">
              <div v-for="slot in ['front', 'rear', 'left', 'right', 'interior_front', 'interior_rear', 'dashboard', 'odometer', 'engine_bay', 'damage']" :key="slot" class="flex flex-col items-center justify-between border border-slate-200 p-4 rounded-xl bg-slate-50/40 relative min-h-[160px] shadow-sm">
                <span class="capitalize text-[11px] font-bold text-slate-800 tracking-wide mb-2 text-center">{{ slot.replace('_', ' ') }}</span>
                
                <label class="w-full text-center block">
                  <div class="bg-[#4A0004] text-white font-bold py-2 px-3 rounded text-[10px] uppercase tracking-wider shadow-sm hover:bg-[#320003] transition cursor-pointer">
                    Select File
                  </div>
                  <input type="file" accept="image/*" class="hidden" @change="handleFileChange($event, slot, true)" />
                </label>
                
                <div v-if="imagePreviews[slot]" class="absolute inset-0 bg-white rounded-xl overflow-hidden border border-[#4A0004] p-1 flex flex-col">
                  <img :src="imagePreviews[slot]" class="w-full h-full object-cover rounded" />
                  <button type="button" @click="delete imagePreviews[slot]; delete vehicleImages[slot]" class="absolute top-2 right-2 bg-[#4A0004] text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] shadow hover:bg-black transition">✕</button>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white border-2 border-[#4A0004]/90 rounded-xl p-8 shadow-sm">
            <div class="flex items-center space-x-3 mb-6 pb-3 border-b border-slate-100">
              <span class="bg-[#4A0004] text-white text-xs font-black px-2.5 py-1 rounded">4</span>
              <h3 class="text-base font-bold text-slate-900 tracking-wide uppercase">Legal Verification Assets</h3>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-semibold">
              <div class="border-2 border-[#4A0004]/10 p-5 rounded-xl bg-slate-50/30 flex justify-between items-center shadow-sm">
                <div>
                  <p class="text-slate-900 font-bold">CR Book - Front Page</p>
                  <span class="text-[10px] text-slate-400 font-normal">Primary metadata identification surface</span>
                </div>
                <input type="file" @change="handleFileChange($event, 'cr_front')" class="max-w-[190px] text-[10px] file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-[10px] file:font-bold file:bg-[#4A0004] file:text-white hover:file:bg-[#320003]" required />
              </div>

              <div class="border-2 border-[#4A0004]/10 p-5 rounded-xl bg-slate-50/30 flex justify-between items-center shadow-sm">
                <div>
                  <p class="text-slate-900 font-bold">CR Book - Back Page</p>
                  <span class="text-[10px] text-slate-400 font-normal">Secondary transfer authorization entries</span>
                </div>
                <input type="file" @change="handleFileChange($event, 'cr_back')" class="max-w-[190px] text-[10px] file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-[10px] file:font-bold file:bg-[#4A0004] file:text-white hover:file:bg-[#320003]" required />
              </div>

              <div class="border-2 border-[#4A0004]/10 p-5 rounded-xl bg-slate-50/30 flex justify-between items-center shadow-sm">
                <div>
                  <p class="text-slate-900 font-bold">Active Revenue License Copy</p>
                  <span class="text-[10px] text-slate-400 font-normal">Must show unambiguous validation cycles</span>
                </div>
                <input type="file" @change="handleFileChange($event, 'revenue_license')" class="max-w-[190px] text-[10px] file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-[10px] file:font-bold file:bg-[#4A0004] file:text-white hover:file:bg-[#320003]" required />
              </div>

              <div class="border-2 border-[#4A0004]/10 p-5 rounded-xl bg-slate-50/30 flex justify-between items-center shadow-sm">
                <div>
                  <p class="text-slate-900 font-bold">Commercial Insurance Certificate</p>
                  <span class="text-[10px] text-slate-400 font-normal">Registration plate mapping must align</span>
                </div>
                <input type="file" @change="handleFileChange($event, 'insurance_cert')" class="max-w-[190px] text-[10px] file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-[10px] file:font-bold file:bg-[#4A0004] file:text-white hover:file:bg-[#320003]" required />
              </div>

              <div class="border-2 border-[#4A0004]/10 p-5 rounded-xl bg-slate-50/30 flex justify-between items-center shadow-sm">
                <div>
                  <p class="text-slate-900 font-bold">Emission Test Diagnostic Run <span class="text-slate-400 font-normal italic">(Optional)</span></p>
                  <span class="text-[10px] text-slate-400 font-normal">Most recent state facility reading</span>
                </div>
                <input type="file" @change="handleFileChange($event, 'emission_report')" class="max-w-[190px] text-[10px] file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-[10px] file:font-bold file:bg-[#4A0004] file:text-white hover:file:bg-[#320003]" />
              </div>

              <div class="border-2 border-[#4A0004]/10 p-5 rounded-xl bg-slate-50/30 flex justify-between items-center shadow-sm">
                <div>
                  <p class="text-slate-900 font-bold">Business Registration Certificate <span class="text-slate-400 font-normal italic">(Corporate Entities)</span></p>
                  <span class="text-[10px] text-slate-400 font-normal">Mandatory entry for fleet vendors</span>
                </div>
                <input type="file" @change="handleFileChange($event, 'br_certificate')" class="max-w-[190px] text-[10px] file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-[10px] file:font-bold file:bg-[#4A0004] file:text-white hover:file:bg-[#320003]" />
              </div>
            </div>
          </div>

          <div class="bg-white border-2 border-[#4A0004]/90 rounded-xl p-8 shadow-sm">
            <div class="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
              <span class="bg-[#4A0004] text-white text-xs font-black px-2.5 py-1 rounded">5</span>
              <h3 class="text-base font-bold text-slate-900 tracking-wide uppercase">Fleet Renter Identity & Settlement Routing</h3>
            </div>
            <p class="text-xs text-slate-400 mb-8 font-medium">
              {{ isFirstTimeOwner ? 'Please configure primary profile configurations. This metadata structures your permanent account layer.' : 'Verified merchant profile details retrieved natively from system database. Fields locked.' }}
            </p>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6 text-xs font-semibold mb-8">
              <div class="flex flex-col space-y-1.5">
                <label class="text-slate-500">Legal Full Name</label>
                <input v-model="form.ownerName" type="text" :readonly="!isFirstTimeOwner" :class="{'bg-slate-50 text-slate-500 border-slate-100 px-2': !isFirstTimeOwner}" class="border-b-2 border-slate-200 rounded-none py-2 outline-none focus:border-[#4A0004] transition" required />
              </div>
              <div class="flex flex-col space-y-1.5">
                <label class="text-slate-500">Mobile Contact Number</label>
                <input v-model="form.ownerPhone" type="text" :readonly="!isFirstTimeOwner" :class="{'bg-slate-50 text-slate-500 border-slate-100 px-2': !isFirstTimeOwner}" class="border-b-2 border-slate-200 rounded-none py-2 outline-none focus:border-[#4A0004] transition" required />
              </div>
              
              <div class="flex flex-col space-y-1.5">
                <label class="text-slate-500">Email Address</label>
                <div class="relative flex items-center w-full">
                  <input v-model="form.ownerEmail" type="email" :readonly="!isFirstTimeOwner" :class="{'bg-slate-50 text-slate-500 border-slate-100 pr-2 px-2': !isFirstTimeOwner, 'pr-20': isFirstTimeOwner}" class="border-b-2 border-slate-200 rounded-none py-2 outline-none w-full focus:border-[#4A0004] transition" required />
                  <button v-if="isFirstTimeOwner" type="button" class="absolute right-0 top-1 bg-[#4A0004] text-white text-[9px] font-black tracking-widest uppercase px-3 py-1.5 rounded shadow hover:bg-[#320003] transition cursor-pointer">
                    Verify
                  </button>
                </div>
              </div>

              <div class="flex flex-col space-y-1.5">
                <label class="text-slate-500">NIC / Passport Number</label>
                <input v-model="form.nicNumber" type="text" :readonly="!isFirstTimeOwner" :class="{'bg-slate-50 text-slate-500 border-slate-100 px-2': !isFirstTimeOwner}" class="border-b-2 border-slate-200 rounded-none py-2 outline-none focus:border-[#4A0004] transition" required />
              </div>
              <div class="flex flex-col space-y-1.5">
                <label class="text-slate-500">Legal Ownership Confirmation Type</label>
                <select v-model="form.ownershipConfirmationType" :disabled="!isFirstTimeOwner" class="border-b-2 border-slate-200 rounded-none py-2 bg-white outline-none focus:border-[#4A0004] transition">
                  <option>Owner</option><option>Business</option><option>Authorized Agent</option>
                </select>
              </div>
            </div>

            <div v-if="isFirstTimeOwner" class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 border-y border-slate-200/60 py-5 my-6 text-xs font-semibold">
              <div class="flex justify-between items-center bg-slate-50/50 p-4 rounded-xl border border-slate-200">
                <label class="text-slate-700">National Identity Card - Front View</label>
                <input type="file" @change="handleFileChange($event, 'nic_front')" class="text-[10px] file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-[10px] file:font-bold file:bg-[#4A0004] file:text-white hover:file:bg-[#320003]" required />
              </div>
              <div class="flex justify-between items-center bg-slate-50/50 p-4 rounded-xl border border-slate-200">
                <label class="text-slate-700">National Identity Card - Back View</label>
                <input type="file" @change="handleFileChange($event, 'nic_back')" class="text-[10px] file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-[10px] file:font-bold file:bg-[#4A0004] file:text-white hover:file:bg-[#320003]" required />
              </div>
            </div>

            <h4 class="text-xs font-bold text-slate-900 uppercase mb-4 tracking-wider flex items-center"><span class="w-1.5 h-3 bg-[#4A0004] mr-2 inline-block"></span>Payout Routing Matrix</h4>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-6 text-xs font-semibold mb-8">
              <div class="flex flex-col space-y-1.5">
                <label class="text-slate-500">Account Holder Title Name</label>
                <input v-model="form.bankAccountHolder" type="text" :readonly="!isFirstTimeOwner" :class="{'bg-slate-50 text-slate-500 border-slate-100 px-2': !isFirstTimeOwner}" class="border-b-2 border-slate-200 rounded-none py-2 outline-none focus:border-[#4A0004] transition" required />
              </div>
              <div class="flex flex-col space-y-1.5">
                <label class="text-slate-500">Corporate Bank Name</label>
                <input v-model="form.bankName" type="text" placeholder="e.g. Commercial Bank" :readonly="!isFirstTimeOwner" :class="{'bg-slate-50 text-slate-500 border-slate-100 px-2': !isFirstTimeOwner}" class="border-b-2 border-slate-200 rounded-none py-2 outline-none focus:border-[#4A0004] transition" required />
              </div>
              <div class="flex flex-col space-y-1.5">
                <label class="text-slate-500">Branch Location</label>
                <input v-model="form.bankBranch" type="text" placeholder="e.g. Colombo 03" :readonly="!isFirstTimeOwner" :class="{'bg-slate-50 text-slate-500 border-slate-100 px-2': !isFirstTimeOwner}" class="border-b-2 border-slate-200 rounded-none py-2 outline-none focus:border-[#4A0004] transition" required />
              </div>
              <div class="flex flex-col space-y-1.5">
                <label class="text-slate-500">Account Number</label>
                <input v-model="form.bankAccountNumber" type="text" :readonly="!isFirstTimeOwner" :class="{'bg-slate-50 text-slate-500 border-slate-100 px-2': !isFirstTimeOwner}" class="border-b-2 border-slate-200 rounded-none py-2 outline-none focus:border-[#4A0004] transition" required />
              </div>
            </div>

            <h4 class="text-xs font-bold text-slate-900 uppercase mb-4 tracking-wider flex items-center"><span class="w-1.5 h-3 bg-[#4A0004] mr-2 inline-block"></span>Physical Address Registry</h4>
            <div class="grid grid-cols-2 md:grid-cols-5 gap-x-6 gap-y-6 text-xs font-semibold">
              <div class="flex flex-col space-y-1.5">
                <label class="text-slate-500">House / Room / Suite</label>
                <input v-model="form.addressHouseNumber" type="text" :readonly="!isFirstTimeOwner" :class="{'bg-slate-50 text-slate-500 border-slate-100 px-2': !isFirstTimeOwner}" class="border-b-2 border-slate-200 rounded-none py-2 outline-none focus:border-[#4A0004] transition" required />
              </div>
              <div class="flex flex-col space-y-1.5">
                <label class="text-slate-500">Street Name</label>
                <input v-model="form.addressStreet" type="text" :readonly="!isFirstTimeOwner" :class="{'bg-slate-50 text-slate-500 border-slate-100 px-2': !isFirstTimeOwner}" class="border-b-2 border-slate-200 rounded-none py-2 outline-none focus:border-[#4A0004] transition" required />
              </div>
              <div class="flex flex-col space-y-1.5">
                <label class="text-slate-500">City / Ward Area</label>
                <input v-model="form.addressCity" type="text" :readonly="!isFirstTimeOwner" :class="{'bg-slate-50 text-slate-500 border-slate-100 px-2': !isFirstTimeOwner}" class="border-b-2 border-slate-200 rounded-none py-2 outline-none focus:border-[#4A0004] transition" required />
              </div>
              <div class="flex flex-col space-y-1.5">
                <label class="text-slate-500">District</label>
                <input v-model="form.addressDistrict" type="text" :readonly="!isFirstTimeOwner" :class="{'bg-slate-50 text-slate-500 border-slate-100 px-2': !isFirstTimeOwner}" class="border-b-2 border-slate-200 rounded-none py-2 outline-none focus:border-[#4A0004] transition" required />
              </div>
              <div class="flex flex-col space-y-1.5 col-span-2 md:col-span-1">
                <label class="text-slate-500">Postal Zone Code</label>
                <input v-model="form.addressPostalCode" type="text" :readonly="!isFirstTimeOwner" :class="{'bg-slate-50 text-slate-500 border-slate-100 px-2': !isFirstTimeOwner}" class="border-b-2 border-slate-200 rounded-none py-2 outline-none focus:border-[#4A0004] transition" required />
              </div>
            </div>
          </div>

          <div class="flex justify-end pt-6">
            <button type="submit" :disabled="isSubmitting" class="bg-[#4A0004] hover:bg-[#2A0002] disabled:bg-slate-300 text-white text-xs font-black tracking-widest uppercase px-10 py-4 rounded-lg transition shadow hover:shadow-lg cursor-pointer">
              {{ isSubmitting ? 'Validating Application Details...' : 'Submit Fleet Application' }}
            </button>
          </div>

        </form>
      </main>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AppNavbar from '../../../components/AppNavbar.vue';
import AppFooter from '../../../components/AppFooter.vue';

const route = useRoute();
const router = useRouter();

const vehicleId = route.params.id as string;
const isLoading = ref(true);
const isSubmitting = ref(false);
const isFirstBooking = ref(true);

// File previews / base64 string storage
const filePreviews = ref<{ [key: string]: string }>({
  nicFront: '',
  nicBack: '',
  passportPhoto: '',
  selfie: '',
  licenseFront: '',
  licenseBack: '',
});

// Vehicle Data
const vehicle = ref<any>(null);

// Form Inputs - Booking Details
const bookingForm = ref({
  pickupDate: '',
  pickupTime: '09:00',
  returnDate: '',
  returnTime: '09:00',
  pickupMethod: 'Pickup', // 'Pickup' | 'Delivery'
  deliveryAddress: '',
  rentalPurpose: 'Personal',
  travelArea: 'Within Colombo',
  specialRequests: '',
  paymentMethod: 'Card', // 'Card' | 'Bank Transfer' | 'Cash on Handover'
  acceptedTerms: false,
});

// Form Inputs - User Profile & Identity Credentials
const profileForm = ref({
  fullName: '',
  dateOfBirth: '',
  gender: '',
  email: '',
  mobileNumber: '',
  citizenshipType: 'SriLankan', // 'SriLankan' | 'Foreigner'
  nicNumber: '',
  nicFrontUrl: '',
  nicBackUrl: '',
  passportNumber: '',
  passportPhotoUrl: '',
  country: '',
  selfieUrl: '',
  address: {
    houseNumber: '',
    street: '',
    city: '',
    district: '',
    postalCode: '',
  },
  drivingLicense: {
    licenseNumber: '',
    expiryDate: '',
    frontUrl: '',
    backUrl: '',
  },
  emergencyContact: {
    name: '',
    relationship: '',
    phone: '',
  },
});

// Convert uploaded files to base64 strings
const handleFileUpload = (event: Event, fieldKey: string, targetKey: string) => {
  const target = event.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) return;

  const file = target.files[0];
  const reader = new FileReader();

  reader.onload = (e) => {
    const result = e.target?.result as string;
    filePreviews.value[fieldKey] = result;

    // Assign directly to nested property path
    if (targetKey.startsWith('drivingLicense.')) {
      const key = targetKey.split('.')[1] as 'frontUrl' | 'backUrl';
      profileForm.value.drivingLicense[key] = result;
    } else {
      (profileForm.value as any)[targetKey] = result;
    }
  };

  reader.readAsDataURL(file);
};

// Calculate Rental Duration and Cost Summary
const totalDays = computed(() => {
  if (!bookingForm.value.pickupDate || !bookingForm.value.returnDate) return 1;
  const start = new Date(bookingForm.value.pickupDate);
  const end = new Date(bookingForm.value.returnDate);
  const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24));
  return diff > 0 ? diff : 1;
});

const calculatedSubtotal = computed(() => {
  return (vehicle.value?.dailyPrice || 0) * totalDays.value;
});

const securityDeposit = computed(() => {
  return vehicle.value?.securityDeposit || 10000;
});

const grandTotal = computed(() => {
  return calculatedSubtotal.value + securityDeposit.value;
});

// Fetch Initial Data
onMounted(async () => {
  try {
    const token = localStorage.getItem('ceylonwheels_token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Fetch Vehicle Details
    const vRes = await fetch(`http://localhost:3000/api/v1/vehicles/${vehicleId}`);
    if (vRes.ok) {
      vehicle.value = await vRes.json();
    }

    // Fetch User Profile & Verification Status
    const pRes = await fetch('http://localhost:3000/api/v1/bookings/user-profile', {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (pRes.ok) {
      const data = await pRes.json();
      isFirstBooking.value = data.isFirstBooking;
      
      if (data.profile) {
        profileForm.value = { ...data.profile };
        // Populate existing previews if available
        filePreviews.value.nicFront = data.profile.nicFrontUrl || '';
        filePreviews.value.nicBack = data.profile.nicBackUrl || '';
        filePreviews.value.passportPhoto = data.profile.passportPhotoUrl || '';
        filePreviews.value.selfie = data.profile.selfieUrl || '';
        filePreviews.value.licenseFront = data.profile.drivingLicense?.frontUrl || '';
        filePreviews.value.licenseBack = data.profile.drivingLicense?.backUrl || '';
      }
    }
  } catch (err) {
    console.error('Initialization error:', err);
  } finally {
    isLoading.value = false;
  }
});

// Process Booking Submission
const submitBooking = async () => {
  if (!bookingForm.value.acceptedTerms) {
    alert('Please accept the terms and policies before proceeding.');
    return;
  }

  // File Upload Validations for First Time Bookings
  if (isFirstBooking.value) {
    if (profileForm.value.citizenshipType === 'SriLankan') {
      if (!profileForm.value.nicFrontUrl || !profileForm.value.nicBackUrl) {
        alert('Please upload both the front and back of your NIC.');
        return;
      }
    } else {
      if (!profileForm.value.passportPhotoUrl) {
        alert('Please upload your passport photo page.');
        return;
      }
    }

    if (!profileForm.value.selfieUrl) {
      alert('Please upload a live selfie verification photo.');
      return;
    }

    if (!profileForm.value.drivingLicense.frontUrl || !profileForm.value.drivingLicense.backUrl) {
      alert('Please upload both the front and back images of your Driving License.');
      return;
    }
  }

  try {
    isSubmitting.value = true;
    const token = localStorage.getItem('ceylonwheels_token');

    const payload = {
      vehicleId,
      ...bookingForm.value,
      acceptedTermsTimestamp: new Date().toISOString(),
      profileData: isFirstBooking.value ? profileForm.value : undefined,
    };

    const res = await fetch('http://localhost:3000/api/v1/bookings/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert('Booking request submitted successfully!');
      router.push('/cusbookings');
    } else {
      const error = await res.json();
      alert(`Booking Failed: ${error.message || 'Check form fields.'}`);
    }
  } catch (err) {
    console.error('Booking submission failed:', err);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-[#FDFDFD] flex flex-col font-sans text-slate-900 antialiased selection:bg-[#4A0004] selection:text-white">
    <AppNavbar />

    <main class="flex-1 max-w-[1300px] w-full mx-auto px-4 sm:px-8 py-10">
      
      <div v-if="isLoading" class="py-20 text-center font-mono text-xs text-slate-400 uppercase tracking-widest">
        Configuring reservation parameters...
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        <div class="lg:col-span-7 space-y-12">
          
          <div>
            <span class="text-[10px] font-black uppercase tracking-[0.2em] text-[#4A0004]">Reservation Workflow</span>
            <h1 class="text-3xl font-black uppercase tracking-tight text-slate-900 mt-1">
              Complete Your Booking
            </h1>
          </div>

          <section class="space-y-6">
            <div class="border-b border-slate-200 pb-3 flex justify-between items-end">
              <div>
                <span class="text-[9px] font-black uppercase tracking-widest text-slate-400">Step 01</span>
                <h2 class="text-lg font-black uppercase tracking-tight text-slate-900">Identity & Credentials</h2>
              </div>
              <span v-if="!isFirstBooking" class="text-[10px] font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2.5 py-1 border border-emerald-200">
                ✓ Verified Profile Linked
              </span>
            </div>

            <div v-if="!isFirstBooking" class="bg-slate-50 border border-slate-200 p-4 text-xs text-slate-600 flex justify-between items-center">
              <div>
                <p class="font-bold text-slate-900">{{ profileForm.fullName }}</p>
                <p class="text-[10px] font-mono text-slate-500">
                  NIC/Passport: {{ profileForm.nicNumber || profileForm.passportNumber }} | License: {{ profileForm.drivingLicense.licenseNumber }}
                </p>
              </div>
              <button @click="isFirstBooking = true" type="button" class="text-[10px] font-black uppercase tracking-widest text-[#4A0004] hover:underline">
                Update Info
              </button>
            </div>

            <div v-if="isFirstBooking" class="space-y-6 pt-2">
              
              <div class="space-y-4">
                <h3 class="text-xs font-black uppercase tracking-wider text-slate-800 border-l-2 border-[#4A0004] pl-2">1. Personal Details</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="sm:col-span-2">
                    <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Full Name (as per NIC/Passport)</label>
                    <input v-model="profileForm.fullName" type="text" required class="w-full bg-white border border-slate-200 p-3 text-xs focus:border-slate-900 outline-none" placeholder="A.B.C. Perera" />
                  </div>
                  <div>
                    <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Date of Birth</label>
                    <input v-model="profileForm.dateOfBirth" type="date" required class="w-full bg-white border border-slate-200 p-3 text-xs focus:border-slate-900 outline-none" />
                  </div>
                  <div>
                    <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Gender (Optional)</label>
                    <select v-model="profileForm.gender" class="w-full bg-white border border-slate-200 p-3 text-xs focus:border-slate-900 outline-none">
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Email Address</label>
                    <input v-model="profileForm.email" type="email" required class="w-full bg-white border border-slate-200 p-3 text-xs focus:border-slate-900 outline-none" placeholder="user@example.com" />
                  </div>
                  <div>
                    <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Mobile Number</label>
                    <input v-model="profileForm.mobileNumber" type="tel" required class="w-full bg-white border border-slate-200 p-3 text-xs focus:border-slate-900 outline-none" placeholder="+94 7X XXX XXXX" />
                  </div>
                </div>
              </div>

              <div class="space-y-4 pt-2">
                <h3 class="text-xs font-black uppercase tracking-wider text-slate-800 border-l-2 border-[#4A0004] pl-2">2. Identity Verification</h3>
                <div class="flex space-x-6 text-xs font-bold uppercase tracking-wider">
                  <label class="flex items-center space-x-2 cursor-pointer">
                    <input type="radio" value="SriLankan" v-model="profileForm.citizenshipType" class="accent-[#4A0004]" />
                    <span>Sri Lankan Citizen</span>
                  </label>
                  <label class="flex items-center space-x-2 cursor-pointer">
                    <input type="radio" value="Foreigner" v-model="profileForm.citizenshipType" class="accent-[#4A0004]" />
                    <span>Foreign Tourist</span>
                  </label>
                </div>

                <div v-if="profileForm.citizenshipType === 'SriLankan'" class="space-y-4">
                  <div>
                    <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">NIC Number</label>
                    <input v-model="profileForm.nicNumber" type="text" class="w-full bg-white border border-slate-200 p-3 text-xs focus:border-slate-900 outline-none" placeholder="e.g., 199512345678 or 951234567V" />
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Upload NIC Front</label>
                      <input type="file" accept="image/*" @change="(e) => handleFileUpload(e, 'nicFront', 'nicFrontUrl')" class="w-full bg-white border border-slate-200 p-2 text-xs focus:border-slate-900 outline-none file:mr-2 file:py-1 file:px-2 file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-slate-900 file:text-white" />
                      <div v-if="filePreviews.nicFront" class="mt-2 h-24 border border-slate-200 overflow-hidden bg-slate-50 flex items-center justify-center">
                        <img :src="filePreviews.nicFront" alt="NIC Front Preview" class="h-full object-contain" />
                      </div>
                    </div>
                    <div>
                      <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Upload NIC Back</label>
                      <input type="file" accept="image/*" @change="(e) => handleFileUpload(e, 'nicBack', 'nicBackUrl')" class="w-full bg-white border border-slate-200 p-2 text-xs focus:border-slate-900 outline-none file:mr-2 file:py-1 file:px-2 file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-slate-900 file:text-white" />
                      <div v-if="filePreviews.nicBack" class="mt-2 h-24 border border-slate-200 overflow-hidden bg-slate-50 flex items-center justify-center">
                        <img :src="filePreviews.nicBack" alt="NIC Back Preview" class="h-full object-contain" />
                      </div>
                    </div>
                  </div>
                </div>

                <div v-else class="space-y-4">
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Passport Number</label>
                      <input v-model="profileForm.passportNumber" type="text" class="w-full bg-white border border-slate-200 p-3 text-xs focus:border-slate-900 outline-none" placeholder="N1234567" />
                    </div>
                    <div>
                      <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Country</label>
                      <input v-model="profileForm.country" type="text" class="w-full bg-white border border-slate-200 p-3 text-xs focus:border-slate-900 outline-none" placeholder="e.g., United Kingdom" />
                    </div>
                  </div>

                  <div>
                    <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Upload Passport Photo Page</label>
                    <input type="file" accept="image/*" @change="(e) => handleFileUpload(e, 'passportPhoto', 'passportPhotoUrl')" class="w-full bg-white border border-slate-200 p-2 text-xs focus:border-slate-900 outline-none file:mr-2 file:py-1 file:px-2 file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-slate-900 file:text-white" />
                    <div v-if="filePreviews.passportPhoto" class="mt-2 h-24 border border-slate-200 overflow-hidden bg-slate-50 flex items-center justify-center">
                      <img :src="filePreviews.passportPhoto" alt="Passport Photo Page Preview" class="h-full object-contain" />
                    </div>
                  </div>
                </div>
              </div>

              <div class="space-y-4 pt-2">
                <h3 class="text-xs font-black uppercase tracking-wider text-slate-800 border-l-2 border-[#4A0004] pl-2">3. Selfie Verification</h3>
                <p class="text-[11px] text-slate-500">Please provide a clear live selfie to match against your identity document and prevent fraud.</p>
                <div>
                  <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Upload / Capture Live Selfie</label>
                  <input type="file" accept="image/*" capture="user" @change="(e) => handleFileUpload(e, 'selfie', 'selfieUrl')" class="w-full bg-white border border-slate-200 p-2 text-xs focus:border-slate-900 outline-none file:mr-2 file:py-1 file:px-2 file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-slate-900 file:text-white" />
                  <div v-if="filePreviews.selfie" class="mt-2 h-32 w-32 border border-slate-200 overflow-hidden bg-slate-50 flex items-center justify-center">
                    <img :src="filePreviews.selfie" alt="Selfie Verification Preview" class="h-full w-full object-cover" />
                  </div>
                </div>
              </div>

              <div class="space-y-4 pt-2">
                <h3 class="text-xs font-black uppercase tracking-wider text-slate-800 border-l-2 border-[#4A0004] pl-2">4. Address Details</h3>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">House Number</label>
                    <input v-model="profileForm.address.houseNumber" type="text" class="w-full bg-white border border-slate-200 p-3 text-xs focus:border-slate-900 outline-none" placeholder="No. 45/A" />
                  </div>
                  <div class="sm:col-span-2">
                    <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Street</label>
                    <input v-model="profileForm.address.street" type="text" class="w-full bg-white border border-slate-200 p-3 text-xs focus:border-slate-900 outline-none" placeholder="High Level Road" />
                  </div>
                  <div>
                    <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">City</label>
                    <input v-model="profileForm.address.city" type="text" class="w-full bg-white border border-slate-200 p-3 text-xs focus:border-slate-900 outline-none" placeholder="Nugegoda" />
                  </div>
                  <div>
                    <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">District</label>
                    <input v-model="profileForm.address.district" type="text" class="w-full bg-white border border-slate-200 p-3 text-xs focus:border-slate-900 outline-none" placeholder="Colombo" />
                  </div>
                  <div>
                    <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Postal Code</label>
                    <input v-model="profileForm.address.postalCode" type="text" class="w-full bg-white border border-slate-200 p-3 text-xs focus:border-slate-900 outline-none" placeholder="10250" />
                  </div>
                </div>
              </div>

              <div class="space-y-4 pt-2">
                <h3 class="text-xs font-black uppercase tracking-wider text-slate-800 border-l-2 border-[#4A0004] pl-2">5. Driving Licence Credentials</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Driving Licence Number</label>
                    <input v-model="profileForm.drivingLicense.licenseNumber" type="text" class="w-full bg-white border border-slate-200 p-3 text-xs focus:border-slate-900 outline-none" placeholder="B1234567" />
                  </div>
                  <div>
                    <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Expiry Date</label>
                    <input v-model="profileForm.drivingLicense.expiryDate" type="date" class="w-full bg-white border border-slate-200 p-3 text-xs focus:border-slate-900 outline-none" />
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Upload Licence Front</label>
                    <input type="file" accept="image/*" @change="(e) => handleFileUpload(e, 'licenseFront', 'drivingLicense.frontUrl')" class="w-full bg-white border border-slate-200 p-2 text-xs focus:border-slate-900 outline-none file:mr-2 file:py-1 file:px-2 file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-slate-900 file:text-white" />
                    <div v-if="filePreviews.licenseFront" class="mt-2 h-24 border border-slate-200 overflow-hidden bg-slate-50 flex items-center justify-center">
                      <img :src="filePreviews.licenseFront" alt="Licence Front Preview" class="h-full object-contain" />
                    </div>
                  </div>
                  <div>
                    <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Upload Licence Back</label>
                    <input type="file" accept="image/*" @change="(e) => handleFileUpload(e, 'licenseBack', 'drivingLicense.backUrl')" class="w-full bg-white border border-slate-200 p-2 text-xs focus:border-slate-900 outline-none file:mr-2 file:py-1 file:px-2 file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-slate-900 file:text-white" />
                    <div v-if="filePreviews.licenseBack" class="mt-2 h-24 border border-slate-200 overflow-hidden bg-slate-50 flex items-center justify-center">
                      <img :src="filePreviews.licenseBack" alt="Licence Back Preview" class="h-full object-contain" />
                    </div>
                  </div>
                </div>
              </div>

              <div class="space-y-4 pt-2">
                <h3 class="text-xs font-black uppercase tracking-wider text-slate-800 border-l-2 border-[#4A0004] pl-2">6. Emergency Contact</h3>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Contact Name</label>
                    <input v-model="profileForm.emergencyContact.name" type="text" class="w-full bg-white border border-slate-200 p-3 text-xs focus:border-slate-900 outline-none" />
                  </div>
                  <div>
                    <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Relationship</label>
                    <input v-model="profileForm.emergencyContact.relationship" type="text" class="w-full bg-white border border-slate-200 p-3 text-xs focus:border-slate-900 outline-none" placeholder="Parent / Spouse" />
                  </div>
                  <div>
                    <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Phone Number</label>
                    <input v-model="profileForm.emergencyContact.phone" type="tel" class="w-full bg-white border border-slate-200 p-3 text-xs focus:border-slate-900 outline-none" />
                  </div>
                </div>
              </div>

            </div>
          </section>

          <section class="space-y-6">
            <div class="border-b border-slate-200 pb-3">
              <span class="text-[9px] font-black uppercase tracking-widest text-slate-400">Step 02</span>
              <h2 class="text-lg font-black uppercase tracking-tight text-slate-900">Booking Information</h2>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Pickup Date</label>
                <input v-model="bookingForm.pickupDate" type="date" required class="w-full bg-white border border-slate-200 p-3 text-xs focus:border-slate-900 outline-none" />
              </div>
              <div>
                <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Pickup Time</label>
                <input v-model="bookingForm.pickupTime" type="time" required class="w-full bg-white border border-slate-200 p-3 text-xs focus:border-slate-900 outline-none" />
              </div>
              <div>
                <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Return Date</label>
                <input v-model="bookingForm.returnDate" type="date" required class="w-full bg-white border border-slate-200 p-3 text-xs focus:border-slate-900 outline-none" />
              </div>
              <div>
                <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Return Time</label>
                <input v-model="bookingForm.returnTime" type="time" required class="w-full bg-white border border-slate-200 p-3 text-xs focus:border-slate-900 outline-none" />
              </div>
            </div>

            <div class="space-y-3 pt-2">
              <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Pickup Method</label>
              
              <div class="grid grid-cols-2 gap-4">
                <button 
                  type="button"
                  @click="bookingForm.pickupMethod = 'Pickup'"
                  :class="bookingForm.pickupMethod === 'Pickup' ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-800'"
                  class="p-4 border text-left transition"
                >
                  <p class="text-xs font-black uppercase tracking-wider">Pickup at Owner Location</p>
                  <p class="text-[10px] opacity-70 mt-1">Collect directly at owner's registered location</p>
                </button>

                <button 
                  type="button"
                  @click="vehicle?.offersDelivery ? bookingForm.pickupMethod = 'Delivery' : null"
                  :disabled="!vehicle?.offersDelivery"
                  :class="[
                    bookingForm.pickupMethod === 'Delivery' ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-800',
                    !vehicle?.offersDelivery ? 'opacity-40 cursor-not-allowed bg-slate-100' : 'cursor-pointer'
                  ]"
                  class="p-4 border text-left transition relative"
                >
                  <p class="text-xs font-black uppercase tracking-wider">Delivery to Customer</p>
                  <p class="text-[10px] opacity-70 mt-1">
                    {{ vehicle?.offersDelivery ? 'Vehicle delivered to your address' : 'Not offered by owner' }}
                  </p>
                </button>
              </div>

              <div v-if="bookingForm.pickupMethod === 'Delivery'" class="pt-2">
                <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Delivery Address</label>
                <textarea v-model="bookingForm.deliveryAddress" rows="2" class="w-full bg-white border border-slate-200 p-3 text-xs focus:border-slate-900 outline-none" placeholder="Provide precise doorstep delivery location..."></textarea>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Purpose of Rental (Optional)</label>
                <select v-model="bookingForm.rentalPurpose" class="w-full bg-white border border-slate-200 p-3 text-xs focus:border-slate-900 outline-none">
                  <option value="Personal">Personal Travel</option>
                  <option value="Business">Business</option>
                  <option value="Wedding">Wedding</option>
                  <option value="Tourism">Tourism</option>
                  <option value="Airport Transfer">Airport Transfer</option>
                </select>
              </div>
              <div>
                <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Estimated Travel Area (Optional)</label>
                <select v-model="bookingForm.travelArea" class="w-full bg-white border border-slate-200 p-3 text-xs focus:border-slate-900 outline-none">
                  <option value="Within Colombo">Within Colombo</option>
                  <option value="Southern Province">Southern Province</option>
                  <option value="Islandwide">Islandwide</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Special Requests</label>
              <textarea v-model="bookingForm.specialRequests" rows="2" class="w-full bg-white border border-slate-200 p-3 text-xs focus:border-slate-900 outline-none" placeholder="Need a child seat, Airport pickup required, etc..."></textarea>
            </div>
          </section>

          <section class="space-y-6 pt-2">
            <div class="border-b border-slate-200 pb-3">
              <span class="text-[9px] font-black uppercase tracking-widest text-slate-400">Step 03</span>
              <h2 class="text-lg font-black uppercase tracking-tight text-slate-900">Payment & Customer Agreement</h2>
            </div>

            <div class="space-y-3">
              <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Payment Method</label>
              <div class="grid grid-cols-3 gap-3">
                <button 
                  type="button" 
                  @click="bookingForm.paymentMethod = 'Card'"
                  :class="bookingForm.paymentMethod === 'Card' ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-800'"
                  class="p-3 border text-center text-xs font-bold uppercase tracking-wider"
                >
                  Credit / Debit Card
                </button>
                <button 
                  type="button" 
                  @click="bookingForm.paymentMethod = 'Bank Transfer'"
                  :class="bookingForm.paymentMethod === 'Bank Transfer' ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-800'"
                  class="p-3 border text-center text-xs font-bold uppercase tracking-wider"
                >
                  Bank Transfer
                </button>
                <button 
                  type="button" 
                  @click="bookingForm.paymentMethod = 'Cash on Handover'"
                  :class="bookingForm.paymentMethod === 'Cash on Handover' ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-800'"
                  class="p-3 border text-center text-xs font-bold uppercase tracking-wider"
                >
                  Cash on Handover
                </button>
              </div>
            </div>

            <div class="bg-slate-50 p-4 border border-slate-200 text-xs text-slate-600 space-y-2">
              <p>• <strong>Rental Terms:</strong> Driver must present valid original physical Driving Licence and NIC/Passport at pickup.</p>
              <p>• <strong>Damage Policy:</strong> Customer assumes full responsibility for any minor or structural damages during the rental period.</p>
              <p>• <strong>Late Return Policy:</strong> LKR 1,500 per additional hour beyond agreed return time.</p>
              <p>• <strong>Fuel Policy:</strong> Vehicle must be returned with equal fuel level provided at pickup.</p>
              <p>• <strong>Cancellation Policy:</strong> Free cancellations up to 24 hours before pickup time.</p>
              <p>• <strong>Privacy Policy:</strong> Identity credentials and selfies are strictly used for verification and fraud mitigation.</p>
            </div>

            <label class="flex items-start space-x-3 cursor-pointer pt-2">
              <input type="checkbox" v-model="bookingForm.acceptedTerms" class="mt-0.5 accent-[#4A0004]" />
              <span class="text-xs text-slate-700">
                I hereby accept all 
                <span class="font-bold underline text-slate-900">Rental Terms</span>, 
                <span class="font-bold underline text-slate-900">Damage Policy</span>, 
                <span class="font-bold underline text-slate-900">Late Return Policy</span>, 
                <span class="font-bold underline text-slate-900">Fuel Policy</span>, 
                <span class="font-bold underline text-slate-900">Cancellation Policy</span>, and 
                <span class="font-bold underline text-slate-900">Privacy Policy</span>.
              </span>
            </label>
          </section>

        </div>

        <div class="lg:col-span-5 lg:sticky lg:top-8 space-y-6">
          
          <div class="bg-white border border-slate-900 p-6 space-y-6">
            <div class="border-b border-slate-100 pb-4">
              <span class="text-[9px] font-black uppercase tracking-widest text-[#4A0004]">Vehicle Summary</span>
              <h3 class="text-lg font-black uppercase tracking-tight text-slate-900 mt-1">
                {{ vehicle?.brand }} {{ vehicle?.model }}
              </h3>
              <p class="text-xs text-slate-400 font-medium">Category: {{ vehicle?.category }}</p>
            </div>

            <div class="space-y-3 text-xs font-medium text-slate-600">
              <div class="flex justify-between">
                <span>Daily Rate</span>
                <span class="font-bold text-slate-900">LKR {{ vehicle?.dailyPrice?.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between">
                <span>Duration</span>
                <span class="font-bold text-slate-900">{{ totalDays }} {{ totalDays === 1 ? 'Day' : 'Days' }}</span>
              </div>
              <div class="flex justify-between">
                <span>Subtotal (Booking Fee)</span>
                <span class="font-bold text-slate-900">LKR {{ calculatedSubtotal.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between pt-2 border-t border-slate-100 text-slate-500">
                <span>Refundable Security Deposit</span>
                <span class="font-bold text-slate-900">LKR {{ securityDeposit.toLocaleString() }}</span>
              </div>
            </div>

            <div class="bg-slate-950 text-white p-5 space-y-1">
              <span class="text-[9px] font-black uppercase tracking-widest text-slate-400">Total Payable</span>
              <div class="text-2xl font-black tracking-tight text-white">
                LKR {{ grandTotal.toLocaleString() }}
              </div>
            </div>

            <button 
              @click="submitBooking"
              :disabled="isSubmitting"
              class="w-full bg-[#4A0004] hover:bg-[#340003] text-white py-4 text-xs font-black uppercase tracking-widest transition disabled:opacity-50 cursor-pointer"
            >
              {{ isSubmitting ? 'Processing Request...' : 'Confirm Reservation Request' }}
            </button>
          </div>

        </div>

      </div>

    </main>

    <AppFooter />
  </div>
</template>
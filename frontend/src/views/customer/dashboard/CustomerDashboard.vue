<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AppNavbar from '../../../components/AppNavbar.vue';
import AppFooter from '../../../components/AppFooter.vue';

const router = useRouter();

// State management for active FAQ dropdown panels
const openFaqIndex = ref<number | null>(0);

// Horizontal scrolling vehicle classes collection matching Ceylon context
const categories = ref([
  { name: 'Cars', count: '14 Cars', img: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=400' },
  { name: 'Premium SUVs', count: '22 Vehicles', img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=400' },
  { name: 'Jeeps', count: '6 Models', img: 'https://dealerinspire-image-library-prod.s3.us-east-1.amazonaws.com/images/0OsBoMCXZnHQ97dLNxiz1bXNTHbK2swADHpsAco5.jpg' },
  { name: 'Vans', count: '11 Vans', img: 'https://www.everycar.jp/blog/wp-content/uploads/img241030_19f974.jpg' },
  { name: 'Cabs / Pickups', count: '8 Vehicles', img: 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Isuzu/S-CAB/9432/1768897007449/front-left-side-47.jpg?tr=w-360' },
]);

// Premium Curated Featured Fleet Vehicles Selection Array
const featuredVehicles = ref([
  {
    id: 1,
    name: 'Mercedes-Benz E-Class',
    location: 'Colombo 07',
    rating: 4.9,
    reviewsCount: 42,
    price: 32000,
    img: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=500'
  },
  {
    id: 2,
    name: 'BMW X5 Premium M-Sport',
    location: 'Nugegoda',
    rating: 4.8,
    reviewsCount: 29,
    price: 45000,
    img: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=500'
  },
  {
    id: 3,
    name: 'Audi A7 Sportback Coupe',
    location: 'Battaramulla',
    rating: 5.0,
    reviewsCount: 16,
    price: 55000,
    img: 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&q=80&w=500'
  },
  {
    id: 4,
    name: 'Tesla Model S Plaid',
    location: 'Colombo 03',
    rating: 4.7,
    reviewsCount: 21,
    price: 38000,
    img: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=500'
  }
]);

// High Value Selling Props Matrix Data
const valueProps = ref([
  { title: 'Five-Star Premium Service', desc: 'Complimentary premium airport drop coordination and 24/7 dedicated on-road mechanical assistance structures.', icon: '💎' },
  { title: 'Transparent Luxury Contracts', desc: 'Zero hidden security deposit parameters or surprising insurance clauses. What you book is exactly what you pay.', icon: '🛡️' },
  { title: 'Pristine Mechanical Upkeep', desc: 'Every model undergoes intensive preventative multi-point safety validation logs before keys change hands.', icon: '🔧' }
]);

// Customer Testimonials Array Data Map
const reviews = ref([
  { name: 'Dr. Alwis Perera', role: 'Corporate Partner', text: 'The ease of securing an executive sedan for my corporate delegation via CeylonWheels was flawless. Pristine car condition and impeccable punctuality.', score: 5 },
  { name: 'Sanduni Jayasekara', role: 'Premium Client', text: 'Booked a luxury SUV for a long weekend trip. The vehicle felt brand new, and the customer experience team made delivery incredibly easy.', score: 5 }
]);

// FAQ Content Structure Map
const faqs = ref([
  { q: 'What documentation forms are mandated to secure a rental vehicle?', a: 'To process a collection key transfer, clients must submit a valid National Identity Card (NIC) or Passport, an active driving license, and a billing utility proof profile verification.' },
  { q: 'Are self-drive options accessible across all exotic luxury collections?', a: 'Yes, most vehicles are open to self-drive options for individuals over 23 holding valid credentials. High-tier exotics are also available with professional chauffeur styling options.' },
  { q: 'How do mileage tracking computations and overflow limits work?', a: 'Each booking comes with an industry-standard daily mileage allotment. Excess kilometers driven beyond your base tier are compiled and invoiced symmetrically at checkout.' }
]);
</script>

<template>
  <div class="min-h-screen bg-[#FAFAFA] flex flex-col font-sans text-slate-800 antialiased">
    
    <AppNavbar />

    <main class="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8 space-y-12">
      
      <div class="relative bg-black rounded-2xl overflow-hidden h-72 flex flex-col justify-center px-6 sm:px-12 text-white shadow-md">
        <div class="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent z-10"></div>
        <img 
          src="https://cdn.rmsothebys.com/c/b/9/7/7/5/cb9775b02d7239a881aaf4c19fd58da0dd5fdc4d.webp" 
          alt="Premium Performance Car Showcase" 
          class="absolute inset-0 w-full h-full object-cover object-center opacity-65"
        />
        <div class="relative z-20 max-w-xl space-y-3">
          <span class="text-xs text-amber-400 font-bold uppercase tracking-widest block">Premium Mobility Experience</span>
          <h2 class="text-2xl sm:text-4xl font-extrabold tracking-tight leading-none">Find & Secure Your Next Selection, Instantly</h2>
          <p class="text-slate-300 text-xs sm:text-sm leading-relaxed font-medium">
            Experience the pinnacle of corporate mobility with our curated selection of premium vehicles, engineered for reliability and prestige.
          </p>
        </div>
      </div>

      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-bold text-slate-900 tracking-tight">Browse by Category</h3>
            <p class="text-slate-400 text-xs font-medium">Explore matching luxury setups based on your travel demands</p>
          </div>
          <button 
            @click="router.push('/categories')"
            class="text-xs font-bold text-[#4A0004] hover:bg-[#4A0004]/5 px-3 py-1.5 rounded-lg transition flex items-center space-x-1 cursor-pointer"
          >
            <span>Show All Categories</span>
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>

        <div class="flex items-center space-x-4 overflow-x-auto pb-3 pt-1 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          <div 
            v-for="cat in categories" 
            :key="cat.name"
            class="min-w-[220px] max-w-[220px] bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition duration-200 cursor-pointer group flex-shrink-0"
          >
            <div class="h-24 relative bg-slate-100 overflow-hidden">
              <img :src="cat.img" :alt="cat.name" class="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
              <div class="absolute inset-0 bg-black/10"></div>
            </div>
            <div class="p-3.5 space-y-0.5">
              <h4 class="text-xs font-bold text-slate-800 group-hover:text-[#4A0004] transition truncate">{{ cat.name }}</h4>
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{{ cat.count }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <div>
          <h3 class="text-lg font-bold text-slate-900 tracking-tight">Featured Executive Collections</h3>
          <p class="text-slate-400 text-xs font-medium">Handpicked premium options maintained in top-tier performance configurations</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div 
            v-for="car in featuredVehicles" 
            :key="car.id"
            class="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm flex flex-col group hover:shadow-md transition"
          >
            <div class="h-40 bg-slate-100 relative overflow-hidden">
              <img :src="car.img" :alt="car.name" class="w-full h-full object-cover transition duration-300 group-hover:scale-105" />
              <div class="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-md text-[9px] font-bold text-slate-700 flex items-center space-x-1 shadow-sm">
                <svg class="w-3 h-3 text-[#4A0004]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>
                <span>{{ car.location }}</span>
              </div>
            </div>

            <div class="p-4 flex-1 flex flex-col justify-between space-y-4">
              <div class="space-y-1">
                <h4 class="text-sm font-bold text-slate-900 truncate">{{ car.name }}</h4>
                <div class="flex items-center space-x-1">
                  <span class="text-amber-500 text-xs">★</span>
                  <span class="text-xs font-bold text-slate-700">{{ car.rating }}</span>
                  <span class="text-slate-400 text-[10px] font-medium">({{ car.reviewsCount }} reviews)</span>
                </div>
              </div>

              <div class="flex items-center justify-between pt-2 border-t border-slate-50">
                <div>
                  <span class="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Daily Rate</span>
                  <div class="text-slate-900 font-black text-xs">
                    <span class="text-sm text-[#4A0004]">LKR {{ car.price.toLocaleString() }}</span>
                    <span class="text-slate-400 font-medium text-[10px]">/day</span>
                  </div>
                </div>
                <button class="bg-[#4A0004]/5 hover:bg-[#4A0004] text-[#4A0004] hover:text-white text-xs font-bold px-3 py-2 rounded-xl transition cursor-pointer">
                  View Detail
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white border border-slate-100 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div class="text-center max-w-xl mx-auto space-y-1">
          <h3 class="text-xl font-bold text-slate-900 tracking-tight">Engineered for Seamless Premium Rentals</h3>
          <p class="text-slate-400 text-xs font-medium">We treat customer convenience as a primary standard, not an upscale premium upsell add-on.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div v-for="prop in valueProps" :key="prop.title" class="space-y-2 p-4 rounded-xl hover:bg-slate-50 transition">
            <div class="text-2xl h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm border border-slate-50">{{ prop.icon }}</div>
            <h4 class="text-xs font-bold text-slate-900 uppercase tracking-wider pt-1">{{ prop.title }}</h4>
            <p class="text-slate-500 text-xs leading-relaxed font-medium">{{ prop.desc }}</p>
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <div>
          <h3 class="text-lg font-bold text-slate-900 tracking-tight">Verified Client Experiences</h3>
          <p class="text-slate-400 text-xs font-medium">Read genuine accounts from corporate travelers and seasonal users</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div v-for="rev in reviews" :key="rev.name" class="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex flex-col justify-between space-y-4">
            <p class="text-slate-600 text-xs italic font-medium leading-relaxed">"{{ rev.text }}"</p>
            <div class="flex items-center justify-between pt-2 border-t border-slate-50">
              <div>
                <span class="text-xs font-bold text-slate-800 block">{{ rev.name }}</span>
                <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">{{ rev.role }}</span>
              </div>
              <div class="flex text-amber-500 text-xs">
                <span v-for="i in rev.score" :key="i">★</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-4 max-w-3xl mx-auto">
        <div class="text-center space-y-1">
          <h3 class="text-lg font-bold text-slate-900 tracking-tight">Frequently Asked Questions</h3>
          <p class="text-slate-400 text-xs font-medium">Everything you need to know about navigating luxury vehicle collection handling frameworks</p>
        </div>

        <div class="space-y-2.5 pt-2">
          <div 
            v-for="(faq, idx) in faqs" 
            :key="idx" 
            class="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm transition"
          >
            <button 
              @click="openFaqIndex = openFaqIndex === idx ? null : idx"
              class="w-full px-5 py-4 flex items-center justify-between text-left font-bold text-xs text-slate-800 uppercase tracking-wider hover:bg-slate-50 transition focus:outline-none cursor-pointer"
            >
              <span>{{ faq.q }}</span>
              <span class="text-[#4A0004] text-sm">{{ openFaqIndex === idx ? '−' : '+' }}</span>
            </button>
            <div 
              v-show="openFaqIndex === idx" 
              class="px-5 pb-4 text-xs text-slate-500 font-medium leading-relaxed border-t border-slate-50/50 pt-2 bg-slate-50/50"
            >
              {{ faq.a }}
            </div>
          </div>
        </div>
      </div>

    </main>
    <AppFooter />
  </div>
</template>

<style scoped>
/* Utility helper class to cleanly mask physical layout scrollbars on secondary navigation tracks */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
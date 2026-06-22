<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AppNavbar from '../../../components/AppNavbar.vue';

const router = useRouter();

const allCategories = ref([
  { 
    name: 'Cars', 
    desc: 'All standard passenger cars including hatchbacks, sedans, and 7-seaters (e.g., Alto, Wagon R, Axio, Premio, Rush).', 
    img: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=400' 
  },
  { 
    name: 'SUVs', 
    desc: 'Comfortable, elevated family crossovers and sport utility vehicles (e.g., Honda Vezel, Toyota Raize, Hyundai Tucson).', 
    img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=400' 
  },
  { 
    name: 'Jeeps', 
    desc: 'Powerful, rugged 4x4 vehicles built for tough terrains and off-road trips (e.g., Land Cruiser Prado, Montero Sport).', 
    img: 'https://dealerinspire-image-library-prod.s3.us-east-1.amazonaws.com/images/0OsBoMCXZnHQ97dLNxiz1bXNTHbK2swADHpsAco5.jpg' 
  },
  { 
    name: 'Cabs / Pickups', 
    desc: 'Double cabs and utility pickup trucks built for loading or heavy towing (e.g., Toyota Hilux, Mitsubishi L200).', 
    img: 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Isuzu/S-CAB/9432/1768897007449/front-left-side-47.jpg?tr=w-360' 
  },
  { 
    name: 'Three-Wheelers', 
    desc: 'Standard local tuks perfect for quick, affordable short-distance travel (e.g., Bajaj RE, TVS King).', 
    img: 'https://www.davidpierisemobility.lk/api/files/vehicles/submodels/1768896802170-Main-Slider.jpg' 
  },
  { 
    name: 'Vans', 
    desc: 'Passenger vans ideal for group travel, family trips, or crew transport (e.g., Toyota KDH Super GL, Nissan Caravan).', 
    img: 'https://www.everycar.jp/blog/wp-content/uploads/img241030_19f974.jpg' 
  },
  { 
    name: 'Lorries & Commercial Trucks',
    desc: 'Light and heavy commercial supply trucks for moving goods and cargo (e.g., Isuzu Elf, Tata, Mahindra).', 
    img: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=400' 
  },
  { 
    name: 'Heavy Machinery & Construction', 
    desc: 'Industrial work vehicles for site development, excavation, and building (e.g., JCB, Excavators, Loaders).', 
    img: 'https://images.tractorjunction.com/Infrajunction-prod/jcb_3dx_backhoe_loader1686911730_2b5e36e8a3.jpg?format=webp&quality=40' 
  },
  { 
    name: 'Electric Cars', 
    desc: 'Fully electric, highly modern eco-friendly passenger cars (e.g., BYD Atto 3, Tesla).', 
    img: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&q=80&w=400' 
  },
  { 
    name: 'Wedding & Classic Luxury',
    desc: 'High-end luxury vehicles and decorated vintage classics for special occasions and events.', 
    img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=400' 
  },
  { 
    name: 'Supercars & Sports Cars',
    desc: 'High-performance sports cars designed to make an impression (e.g., Nissan GT-R, Mustang).', 
    img: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=400' 
  },
  { 
    name: 'Buses & Coaches', 
    desc: 'Large passenger coaches for big tour groups or events (e.g., Toyota Coaster).', 
    img: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&q=80&w=400' 
  },
  { 
    name: 'Motorbikes & Scooters',
    desc: 'Two-wheelers perfect for quick solo trips or bypassing traffic.', 
    img: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=400' 
  }
]);

// Click Event routing logic
const viewCategoryModels = (categoryName: string) => {
  router.push({
    name: 'category-models',
    params: { category: categoryName }
  });
};

</script>

<template>
  <div class="min-h-screen bg-[#FAFAFA] flex flex-col font-sans text-slate-800 antialiased">
    <AppNavbar />

    <main class="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8 space-y-6">
      
      <div class="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-400">
        <span class="hover:text-[#4A0004] cursor-pointer transition" @click="router.push('/cusdashboard')">Home</span>
        <span>/</span>
        <span class="text-slate-600">All Categories</span>
      </div>

      <div class="space-y-1">
        <h2 class="text-2xl font-black text-slate-900 tracking-tight">Vehicle Categories Showcase</h2>
        <p class="text-slate-400 text-xs font-medium">Select a specified vehicle class parameters to view our deep inventory structures.</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="cat in allCategories" 
          :key="cat.name"
          @click="viewCategoryModels(cat.name)"
          class="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition duration-200 group cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div class="h-44 bg-slate-100 relative overflow-hidden">
              <img :src="cat.img" :alt="cat.name" class="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
            </div>
            <div class="p-5 space-y-1.5">
              <h3 class="text-sm font-bold text-slate-900 group-hover:text-[#4A0004] transition uppercase tracking-wide">{{ cat.name }}</h3>
              <p class="text-slate-500 text-xs font-medium leading-relaxed">{{ cat.desc }}</p>
            </div>
          </div>
          
          <div class="p-5 pt-0 flex items-center justify-between text-xs font-bold border-t border-slate-50/60 mt-2">
            <span class="text-[#4A0004] group-hover:underline flex items-center space-x-1">
              <span>View Selection</span>
              <span>→</span>
            </span>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
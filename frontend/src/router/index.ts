import { createRouter, createWebHistory } from 'vue-router';
import App from '../App.vue'; 
import SignupView from '../views/common/Signup/SignupView.vue';
import LoginView from '../views/common/Login/LoginView.vue';
import CustomerDashboard from '../views/customer/dashboard/CustomerDashboard.vue';
import CategoriesView from '../views/customer/categories/CategoriesView.vue';
import VehicleModelsView from '../views/customer/vehicle_models/VehicleModelsView.vue';

const routes = [
  {
    path: '/',
    name: 'signup',
    component: SignupView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/cusdashboard',
    name: 'customer-dashboard',
    component: CustomerDashboard
  },
  {
    path: '/categories',
    name: 'categories',
    component: CategoriesView
  },
  {
      // The :category path matches parameters passed directly via code parameters triggers
      path: '/categories/:category',
      name: 'category-models',
      component: VehicleModelsView
    },
  // Future roles routes (e.g., /renter, /customer) 
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

// This line makes this file an ES module so main.ts can import it
export default router;
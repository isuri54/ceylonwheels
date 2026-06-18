import { createRouter, createWebHistory } from 'vue-router';
import App from '../App.vue'; 
import SignupView from '../views/common/Signup/SignupView.vue';
import LoginView from '../views/common/Login/LoginView.vue';
import CustomerDashboard from '../views/customer/dashboard/CustomerDashboard.vue';
import CategoriesView from '../views/customer/categories/CategoriesView.vue';

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
  }
  // Future roles routes (e.g., /renter, /customer) 
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

// This line makes this file an ES module so main.ts can import it
export default router;
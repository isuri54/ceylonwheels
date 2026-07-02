import { createRouter, createWebHistory } from 'vue-router';
import App from '../App.vue'; 
import SignupView from '../views/common/Signup/SignupView.vue';
import LoginView from '../views/common/Login/LoginView.vue';
import CustomerDashboard from '../views/customer/dashboard/CustomerDashboard.vue';
import CategoriesView from '../views/customer/categories/CategoriesView.vue';
import SupportView from '../views/customer/support/SupportView.vue';
import CustomerProfile from '../views/customer/profile/CustomerProfile.vue';
import SettingsView from '../views/customer/settings/SettingsView.vue';
import RenterDashboard from '../views/renter/dashboard/RentersDashboard.vue';

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
    path: '/support',
    name: 'support',
    component: SupportView
  },
  {
    path: '/cusprofile',
    name: 'customer-profile',
    component: CustomerProfile
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsView
  },
  {
    path: '/renterdashboard',
    name: 'renter-dashboard',
    component: RenterDashboard
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

// This line makes this file an ES module so main.ts can import it
export default router;
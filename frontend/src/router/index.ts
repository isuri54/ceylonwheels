import { createRouter, createWebHistory } from 'vue-router';
import App from '../App.vue'; 
import SignupView from '../views/common/Signup/SignupView.vue';

const routes = [
  {
    path: '/',
    name: 'signup',
    component: SignupView
  }
  // Future roles routes (e.g., /renter, /customer) 
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

// This line makes this file an ES module so main.ts can import it
export default router;
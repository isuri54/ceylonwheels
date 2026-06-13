import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';

// Import CSS framework file here later (e.g., Tailwind CSS)

const app = createApp(App);

app.use(createPinia()); // Attaches Pinia globally
if (router) app.use(router); // Attaches Vue Router globally

app.mount('#app'); // Mounts the app into the public/index.html file
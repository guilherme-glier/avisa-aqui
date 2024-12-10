import "./assets/css/nucleo-icons.css";
import "./assets/css/nucleo-svg.css";
import './assets/main.css';

import { createApp } from 'vue';
import App from './App.vue';
import store from "./store";
import router from './router';
import SoftUIDashboard from "./soft-ui-dashboard";

const app = createApp(App)

app.use(store);
app.use(router);
app.use(SoftUIDashboard);

app.mount('#app');

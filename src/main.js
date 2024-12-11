import "./assets/css/nucleo-icons.css";
import "./assets/css/nucleo-svg.css";
import './assets/main.css';
import 'vue-final-modal/style.css';
import 'vue-select/dist/vue-select.css';

import { createApp } from 'vue';
import App from './App.vue';
import store from "./store";
import router from './router';
import SoftUIDashboard from "./soft-ui-dashboard";
import { createVfm } from 'vue-final-modal';
import VueSelect from "vue-select";

const app = createApp(App);
const vfm = createVfm();

app.use(store);
app.use(router);
app.use(SoftUIDashboard);
app.use(vfm);

app.component("v-select", VueSelect);

app.mount('#app');

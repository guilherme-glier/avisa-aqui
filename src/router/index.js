import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Cadastro from '../views/Cadastro.vue'
import Login from '../views/Login.vue'
import Perfil from '../views/Perfil.vue'
import Cadastro_Incidente from '@/views/Cadastro_Incidente.vue'
import Incidentes_view from '@/views/Incidentes_view.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/cadastro',
      name: 'cadastro',
      component: Cadastro,
      meta: { requiresAuth: false }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { requiresAuth: false }
    },
    {
      path: '/perfil',
      name: 'perfil',
      component: Perfil,
      meta: { requiresAuth: true } // Example protected route
    },
    {
      path: '/cadastro_incidente',
      name: 'cadastro_incidente',
      component: Cadastro_Incidente,
      meta: { requiresAuth: true } // Example protected route
    },
    {
      path: '/incidentes_view',
      name: 'incidentes_view',
      component: Incidentes_view,
      meta: { requiresAuth: true } // Example protected route
    },
  ]
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = checkAuthenticationStatus();

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next({ name: 'login' });
    } else {
      next();
    }
  } else {
    if (to.name === 'login' || to.name === 'cadastro') {
      if (isAuthenticated) {
        next({ name: 'perfil' });
      } else {
        next();
      }
    } else {
      next();
    }
  }
})

export function checkAuthenticationStatus() {
  return !!localStorage.getItem('userData');
}

export default router

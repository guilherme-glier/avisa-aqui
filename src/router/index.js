import { createRouter, createWebHistory } from 'vue-router'
import IncidentList from '@/views/IncidentList.vue'
import Overview from '@/views/Overview.vue'
import SignIn from '@/views/SignIn.vue'
import SignUp from '@/views/SignUp.vue'

const routes = [
  {
    path: "/",
    name: "/",
    redirect: "/home",
  },
  {
    path: '/home',
    name: 'Visão Geral',
    component: Overview
  },
  {
    path: '/sign-in',
    name: 'SignIn',
    component: SignIn,
    meta: { requiresAuth: false }
  },
  {
    path: '/sign-up',
    name: 'SignUp',
    component: SignUp,
    meta: { requiresAuth: false }
  },
  {
    path: '/incidentes',
    name: 'Meus Incidentes',
    component: IncidentList,
    meta: { requiresAuth: true }
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  linkActiveClass: "active",
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
        next({ name: 'overview' });
      } else {
        next();
      }
    } else {
      next();
    }
  }
})

export function checkAuthenticationStatus() {
  return !!localStorage.getItem('isLoggedIn');
}

export default router

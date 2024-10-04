<template>
  <main>
    <header>
      <nav>
        <ul>
          <template v-if="!isAuthenticated">
            <li><RouterLink to="cadastro">Cadastro</RouterLink></li>
            <li><RouterLink to="login">Login</RouterLink></li>
          </template>
          <li v-if="isAuthenticated">
            <RouterLink to="perfil">Perfil</RouterLink>
          </li>
          <li v-if="isAuthenticated">
            <button @click="logout">Logout</button>
          </li>
        </ul>
      </nav>
    </header>
    <section class="map">
      <Map />
    </section>
  </main>
</template>

<script setup>
import { RouterLink, useRouter } from 'vue-router';
import { checkAuthenticationStatus } from '../router';
import Map from '../components/Map.vue'

const router = useRouter();
const isAuthenticated = checkAuthenticationStatus();

function logout() {
  localStorage.removeItem('userData');
}
</script>

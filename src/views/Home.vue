<template>
  <main>
    <header>
      <nav>
        <img src="../assets/logo.png" alt="Logo" class="logo" />
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
import Map from '../components/Map.vue';

const router = useRouter();
const isAuthenticated = checkAuthenticationStatus();

function logout() {
  localStorage.removeItem('userData');
}
</script>

<style>
main {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
}

header {
  background-color: #ffffff;
  color: #565173;
  padding: 10px 20px;
  display: flex;
  align-items: center;
}

.logo {
  height: 50px;
  margin-right: 20px;
}

nav ul {
  list-style-type: none;
  display: flex;
  gap: 15px;
  margin: 0;
  padding: 0;
}

nav a {
  color: #565173;
  text-decoration: none;
  font-weight: bold;
}

nav a:hover {
  text-decoration: underline;
}

nav button {
  background-color: transparent;
  border: none;
  color: white;
  font-weight: bold;
  cursor: pointer;
}

nav button:hover {
  text-decoration: underline;
}

</style>

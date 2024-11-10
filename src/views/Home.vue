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
            <RouterLink to="cadastro_incidente">Cadastro de Incidente</RouterLink>
          </li>
          <li v-if="isAuthenticated">
            <RouterLink to="incidentes_view">Meus Incidentes</RouterLink>
          </li>
          <li v-if="isAuthenticated">
            <button @click="logout">Logout</button>
          </li>
        </ul>
      </nav>
      <!-- Combo box de categorias -->
      <div class="select-container">
        <select v-model="selectedCategory" @change="filterIncidentsByCategory">
          <option value="">Todas as Categorias</option>
          <!-- Opções carregadas dinamicamente -->
          <option v-for="categoria in categorias" :key="categoria.id" :value="categoria.id">
            {{ categoria.description }}
          </option>
        </select>
      </div>
    </header>
    <section class="map">
      <Map :selectedCategory="selectedCategory" />
    </section>
  </main>
</template>

<script setup>
import { RouterLink, useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { checkAuthenticationStatus } from '../router';
import Map from '../components/Map.vue';

const router = useRouter();
const isAuthenticated = checkAuthenticationStatus();

// Categoria selecionada
const selectedCategory = ref('');
const categorias = ref([]); // Armazena as categorias da API

// Função local para buscar as categorias da API
async function getCategorias() {
  const config = {
    method: 'get',
    url: `${import.meta.env.VITE_API_API_URL}categories`,
    headers: { 
      'Authorization': `Bearer ${import.meta.env.VITE_API_API_TOKEN}`
    }
  };
  
  try {
    const response = await axios.request(config);
    if (response.data && response.data.data) {
      categorias.value = response.data.data.map(item => ({
        id: item.id,
        description: item.description,
      }));
    } else {
      console.error('Estrutura de dados inesperada:', response.data);
    }
  } catch (error) {
    console.error('Erro ao carregar categorias:', error);
  }
}

// Carrega as categorias ao montar o componente
onMounted(async () => {
  await getCategorias();
});

function logout() {
  localStorage.removeItem('userData');
  router.push('/login'); // Redireciona para a tela de login após logout
}

function filterIncidentsByCategory() {
  // Aqui você pode implementar a lógica de filtragem dos incidentes no mapa
  console.log("Categoria selecionada:", selectedCategory.value);
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
  justify-content: space-between;
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
  color: #565173;
  font-weight: bold;
  cursor: pointer;
}

nav button:hover {
  text-decoration: underline;
}

/* Estilo do combo box */
.select-container {
  margin-left: auto;
}

select {
  padding: 5px 10px;
  font-size: 14px;
  font-weight: bold;
  color: #565173;
  background-color: #f2f2f2;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;
}

select:focus {
  outline: none;
  border-color: #565173;
}

</style>

<template>
  <div class="incident-list">
    <div class="logo-container">
      <img src="../assets/logo.png" alt="Logo" class="logo" />
    </div>
    <h1>Incidentes Registrados</h1>
    <div v-if="userIncidents.length">
      <div class="incident" v-for="(incident, index) in userIncidents" :key="index">
        <div><b>Categoria:</b> {{ incident.ref_category }}</div>
        <div><b>Descrição:</b> {{ incident.value }}</div>
        <div><b>Latitude:</b> {{ incident.latitude }}</div>
        <div><b>Longitude:</b> {{ incident.longitude }}</div>
        <button @click="markAsResolved(incident.id)" class="resolve-button">Resolvido</button>
      </div>
    </div>
    <div v-else>
      <p>Nenhum incidente registrado.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const user = JSON.parse(localStorage.getItem('userData'));
const userIncidents = ref([]);

// Configuração para obter incidentes da API
let configGetIncidents = {
  method: 'get',
  url: `${import.meta.env.VITE_API_API_URL}incidents`,
  headers: { 
    'Authorization': `Bearer ${import.meta.env.VITE_API_API_TOKEN}`
  }
};

// Carrega os incidentes ao montar o componente
async function loadIncidents() {
  try {
    const response = await axios.request(configGetIncidents);

    // Acessa a lista de incidentes dentro do objeto retornado
    const incidents = response.data.data || response.data;

    // Filtra os incidentes ativos do usuário logado
    const userId = localStorage.getItem('id');

    userIncidents.value = incidents.filter(
      incident => incident.ref_user == userId && incident.active === true
    );


  } catch (error) {
    console.error('Erro ao carregar incidentes:', error);
    alert('Erro ao carregar incidentes. Verifique o console para mais detalhes.');
  }
}


// Função para marcar o incidente como resolvido
async function markAsResolved(incidentId) {
  try {
    // Configuração para a requisição de atualização de incidente
    let isResolved = await axios.get(`${configGetIncidents.url}/${incidentId}/resolve`,{
      headers: configGetIncidents.headers
    });

    console.log(isResolved);

    // Atualiza a lista de incidentes visíveis, removendo o resolvido
    alert('Incidente marcado como resolvido com sucesso!');
    window.location.reload();
    
  } catch (error) {
    console.error('Erro ao marcar incidente como resolvido:', error);
    alert('Erro ao marcar incidente como resolvido. Verifique o console para mais detalhes.');
  }
}

// Monta o componente e carrega os incidentes
onMounted(() => {
  loadIncidents();
});
</script>

<style>
.incident-list {
  font-family: Arial, sans-serif;
  text-align: center;
  margin-top: 50px;
}

.logo-container {
  margin-bottom: 20px;
}

.logo {
  height: 100px;
}

h1 {
  color: #333;
}

.incident {
  background-color: #f9f9f9;
  padding: 15px;
  margin: 10px auto;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  width: 80%;
  max-width: 500px;
  text-align: left;
}

.resolve-button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

.resolve-button:hover {
  background-color: #45a049;
}
</style>

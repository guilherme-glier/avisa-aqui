<template>
  <div class="incident-list">
    <div class="logo-container">
      <img src="../assets/logo.png" alt="Logo" class="logo" />
    </div>
    <h1>Incidentes Registrados</h1>
    <div v-if="userIncidents.length">
      <div class="incident" v-for="(incident, index) in userIncidents" :key="index">
        <div><b>Categoria:</b> {{ incident.categoria }}</div>
        <div><b>Descrição:</b> {{ incident.descricao }}</div>
        <div><b>Latitude:</b> {{ incident.latitude }}</div>
        <div><b>Longitude:</b> {{ incident.longitude }}</div>
        <button v-if="incident.status === 'ativo'" @click="markAsResolved(index)" class="resolve-button">Resolvido</button>
      </div>
    </div>
    <div v-else>
      <p>Nenhum incidente registrado.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const user = JSON.parse(localStorage.getItem('userData'));
const userIncidents = ref([]);

// Carrega os incidentes ao montar o componente
onMounted(() => {
  const allIncidents = JSON.parse(localStorage.getItem('incidents')) || [];
  // Filtra os incidentes ativos para o usuário logado
  userIncidents.value = allIncidents.filter(incident => incident.userId === user.id && incident.status === 'ativo');
});

// Função para marcar o incidente como resolvido
function markAsResolved(index) {
  const incident = userIncidents.value[index];
  incident.status = 'resolvido';

  const allIncidents = JSON.parse(localStorage.getItem('incidents')) || [];

  // Atualiza o status de todos os incidentes no localStorage
  const updatedIncidents = allIncidents.map(i => 
    i.userId === incident.userId && i.descricao === incident.descricao ? { ...i, status: 'resolvido' } : i
  );

  // Atualiza o localStorage com os incidentes atualizados
  localStorage.setItem('incidents', JSON.stringify(updatedIncidents));

  // Atualiza a lista de incidentes visíveis
  userIncidents.value = updatedIncidents.filter(i => i.userId === user.id && i.status === 'ativo');
}
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

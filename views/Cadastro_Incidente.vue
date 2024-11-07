<template>
  <div class="cadastro-incidente">
    <div class="logo-container">
      <img src="../assets/logo.png" alt="Logo" class="logo" />
    </div>
    <div class="form-container">
      <div class="form-group">
        <span>Categoria</span>
        <select v-model="formData.categoria" @change="validateCategoria">
          <option value="" disabled selected>Selecione uma categoria</option>
          <option>Falta de água</option>
          <option>Falta de luz</option>
          <option>Animal na pista</option>
        </select>
        <p v-if="errors.categoria" class="error">{{ errors.categoria }}</p>
      </div>
      <div class="form-group">
        <span>Descrição</span>
        <textarea v-model="formData.descricao" @blur="validateDescricao" rows="3"></textarea>
        <p v-if="errors.descricao" class="error">{{ errors.descricao }}</p>
      </div>
      <button @click="cadastrarIncidente" class="submit-button">Cadastrar Incidente</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const formData = ref({
  categoria: '',
  descricao: '',
  latitude: null,
  longitude: null,
  dataHora: null,
  usuario: null,  // Campo para armazenar o usuário logado
  status: 'ativo' // Novo campo para indicar se o incidente está ativo
});

const errors = ref({});

function validateCategoria() {
  if (!formData.value.categoria) {
    errors.value.categoria = 'Categoria é obrigatória.';
  } else {
    errors.value.categoria = '';
  }
}

function validateDescricao() {
  if (!formData.value.descricao) {
    errors.value.descricao = 'Descrição é obrigatória.';
  } else {
    errors.value.descricao = '';
  }
}

async function coletarLocalizacao() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          alert('Erro ao obter localização: ' + error.message);
          reject(error);
        }
      );
    } else {
      alert('Geolocalização não é suportada pelo navegador.');
      reject(new Error('Geolocalização não suportada.'));
    }
  });
}

async function cadastrarIncidente() {
  validateCategoria();
  validateDescricao();

  if (Object.values(errors.value).some(error => error)) {
    alert('Por favor, corrija os erros antes de cadastrar o incidente.');
    return;
  }

  try {
    const { latitude, longitude } = await coletarLocalizacao();
    formData.value.latitude = latitude;
    formData.value.longitude = longitude;
    formData.value.dataHora = new Date().toISOString();

    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      formData.value.usuario = userData.email;  // Armazena o email do usuário logado
    } else {
      alert('Nenhum usuário logado encontrado.');
      return;
    }

    // Adiciona o incidente com status 'ativo' ao localStorage
    const incidents = JSON.parse(localStorage.getItem('incidents')) || [];
    incidents.push({ ...formData.value });
    localStorage.setItem('incidents', JSON.stringify(incidents));

    // Limpa os campos do formulário
    formData.value = {
      categoria: '',
      descricao: '',
      latitude: null,
      longitude: null,
      dataHora: null,
      usuario: null,
      status: 'ativo' // Redefine o status ao valor inicial
    };

    alert('Incidente cadastrado com sucesso!');
  } catch (error) {
    console.error('Erro ao cadastrar incidente:', error);
  }
}
</script>

<style>
.cadastro-incidente {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
  font-family: Arial, sans-serif;
}

.logo-container {
  margin-bottom: 20px;
}

.logo {
  height: 100px;
}

.form-container {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 300px;
}

.form-group {
  margin-bottom: 15px;
}

span {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

select, textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

textarea:focus, select:focus {
  border-color: #565173;
  outline: none;
}

.submit-button {
  width: 100%;
  padding: 10px;
  background-color: #565173;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.submit-button:hover {
  background-color: #5D568C;
}

.error {
  color: red;
  font-size: 12px;
  margin-top: 5px;
}
</style>

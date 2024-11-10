<template>
  <div class="cadastro-incidente">
    <div class="logo-container">
      <img src="../assets/logo.png" alt="Logo" class="logo" />
    </div>
    <div class="form-container">
      <div class="form-group">
        <span>Categoria</span>
        <select v-model="formData.categoria">
          <option value="" disabled selected>Selecione uma categoria</option>
          <!-- Preenchendo a combo box com categorias -->
          <option v-for="categoria in categorias" :key="categoria.id" :value="categoria.id">
            {{ categoria.description }}
          </option>
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
import { ref, onMounted } from 'vue';
import axios from 'axios';

// Configuração para URL da API e headers
let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: `${import.meta.env.VITE_API_API_URL}categories`,
  headers: { 
    'Authorization': `Bearer ${import.meta.env.VITE_API_API_TOKEN}`
  }
};

const formData = ref({
  categoria: '',
  descricao: '',
  latitude: null,
  longitude: null,
  dataHora: null,
  usuario: null
});

let categorias = ref([]); // Para armazenar as categorias
const errors = ref({});

// Função para buscar as categorias da API
async function getCategorias() {
  try {
    console.log('Configuração de API:', config);
    let response = await axios.request(config);

    // Verifique a estrutura dos dados
    console.log('Dados da API:', response.data);

    // Se response.data for um objeto com a chave "data" que contém um array:
    if (response.data && response.data.data) {
      // Converte response.data.data para um array e mapeia para extrair o id e a description
      categorias.value = response.data.data.map(item => ({
        id: item.id,          // O ID será o valor da opção
        description: item.description, // A descrição será o texto visível
        validation: item.type
      }));
    } else {
      console.error('Estrutura inesperada de dados:', response.data);
    }

    console.log('Categorias carregadas:', categorias.value);
  } catch (error) {
    console.error('Erro ao carregar categorias:', error);
  }
}

// Validação e cadastro de incidentes
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
      formData.value.usuario = userData.email;
    } else {
      alert('Nenhum usuário logado encontrado.');
      return;
    }

    const incidents = JSON.parse(localStorage.getItem('incidents')) || [];
    incidents.push({ ...formData.value, status: 'ativo' });
    localStorage.setItem('incidents', JSON.stringify(incidents));

    formData.value = {
      categoria: '',
      descricao: '',
      latitude: null,
      longitude: null,
      dataHora: null,
      usuario: null
    };

    alert('Incidente cadastrado com sucesso!');
  } catch (error) {
    console.error('Erro ao cadastrar incidente:', error);
  }
}

// Coleta localização e carrega categorias ao montar o componente
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

onMounted(() => {
  getCategorias();
});
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

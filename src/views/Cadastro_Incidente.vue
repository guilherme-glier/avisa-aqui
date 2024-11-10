<template>
  <div class="cadastro-incidente">
    <div class="logo-container">
      <img src="../assets/logo.png" alt="Logo" class="logo" />
    </div>
    <div class="form-container">
      <div class="form-group">
        <span>Categoria</span>
        <select v-model="formData.ref_category" @change="changeCategoria">
          <option value="" disabled selected>Selecione uma categoria</option>
          <!-- Preenchendo a combo box com categorias -->
          <option v-for="categoria in categorias" :key="categoria.id" :value="categoria.id">
            {{ categoria.description }}
          </option>
        </select>
        <p v-if="errors.categoria" class="error">{{ errors.categoria }}</p>
      </div>
      
      <div class="form-group">
        <span>Informações</span>
        <div v-if="campoDescricao">
          <input
            v-if="campoDescricao.type === 'TEXT'"
            v-model="formData.value"
            type="text"
            @blur="validateDescricao"
          />
          <input
            v-if="campoDescricao.type === 'INT'"
            v-model="formData.value"
            type="number"
            @blur="validateDescricao"
          />
          <input
            v-if="campoDescricao.type === 'FLOAT'"
            v-model="formData.value"
            type="number"
            step="0.01"
            @blur="validateDescricao"
          />
          <select
            v-if="campoDescricao.type === 'LOGIC'"
            v-model="formData.value"
            @blur="validateDescricao"
          >
            <option value="0">Não</option>
            <option value="1">Sim</option>
          </select>
        </div>
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
  ref_category: '',
  value: '',
  latitude: null,
  longitude: null,
  ref_user: null
});

let categorias = ref([]); // Para armazenar as categorias
const errors = ref({});
const campoDescricao = ref(null); // Para armazenar as configurações do campo descrição

// Função para buscar as categorias da API
async function getCategorias() {
  try {
    console.log('Configuração de API:', config);
    let response = await axios.request(config);

    // Verifique a estrutura dos dados
    console.log('Dados da API:', response.data);

    // Se response.data for um objeto com a chave "data" que contém um array:
    if (response.data && response.data.data) {
      // Converte response.data.data para um array e mapeia para extrair o id, description, validation, type
      categorias.value = response.data.data.map(item => ({
        id: item.id, // O ID será o valor da opção
        description: item.description, // A descrição será o texto visível
        validation: item.regex_validation,
        type: item.type.toUpperCase() // Garantir que o tipo seja maiúsculo
      }));
    } else {
      console.error('Estrutura inesperada de dados:', response.data);
    }

    console.log('Categorias carregadas:', categorias.value);
  } catch (error) {
    console.error('Erro ao carregar categorias:', error);
  }
}

// Função para mudar o campo "Descrição" com base no tipo da categoria selecionada
function changeCategoria() {
  const categoriaSelecionada = categorias.value.find(categoria => categoria.id === formData.value.ref_category);
  
  // Limpar campo descrição ao mudar de categoria
  formData.value.value = '';
  
  if (categoriaSelecionada) {
    campoDescricao.value = {
      type: categoriaSelecionada.type,
      validation: categoriaSelecionada.validation
    };
    validateDescricao(); // Validar logo após a seleção da categoria
  }
}

// Validação do campo Descrição com base na regex
function validateDescricao() {
  const descricao = formData.value.value;
  if (!descricao) {
    errors.value.value = 'Descrição é obrigatória.';
    return;
  }

  // Caso haja uma regex para validação, utilizamos ela
  if (campoDescricao.value && campoDescricao.value.validation) {
    const regex = new RegExp(campoDescricao.value.validation);
    if (!regex.test(descricao)) {
      errors.value.value = 'Descrição inválida.';
      return;
    }
  }

  // Se passou na validação
  errors.value.value = '';
}

// Validação e cadastro de incidentes
function validateCategoria() {
  if (!formData.value.ref_category) {
    errors.value.ref_category = 'Categoria é obrigatória.';
  } else {
    errors.value.ref_category = '';
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

    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      formData.value.ref_user = userData.email;
    } else {
      alert('Nenhum usuário logado encontrado.');
      return;
    }

    const incidents = JSON.parse(localStorage.getItem('incidents')) || [];
    incidents.push({ ...formData.value, status: 'ativo' });
    localStorage.setItem('incidents', JSON.stringify(incidents));

    formData.value = {
      ref_category: '',
      value: '',
      latitude: null,
      longitude: null,
      ref_user: null
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
  width: 400px;
}

.form-group {
  margin-bottom: 15px;
}

span {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

select, textarea, input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

textarea:focus, select:focus, input:focus {
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

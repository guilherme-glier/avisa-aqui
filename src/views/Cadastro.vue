<template>
  <div class="cadastro">
    <div class="logo-container">
      <img src="../assets/logo.png" alt="Logo" class="logo" />
    </div>
    <div class="form-container">
      <div class="form-group">
        <span>Email</span>
        <input type="text" v-model="formData.email" @blur="validateEmail">
        <p v-if="errors.email" class="error">{{ errors.email }}</p>
      </div>
      <div class="form-group">
        <span>Nome</span>
        <input type="text" v-model="formData.nome" @blur="validateNome">
        <p v-if="errors.nome" class="error">{{ errors.nome }}</p>
      </div>
      <div class="form-group">
        <span>Endereço</span>
        <input type="text" v-model="formData.endereco">
      </div>
      <div class="form-group">
        <span>Celular</span>
        <input type="text" v-model="formData.celular" @blur="validateCelular">
        <p v-if="errors.celular" class="error">{{ errors.celular }}</p>
      </div>
      <div class="form-group">
        <span>Senha</span>
        <input type="password" v-model="formData.senha" @blur="validateSenha">
        <p v-if="errors.senha" class="error">{{ errors.senha }}</p>
      </div>
      <button @click="cadastrar" class="submit-button">Cadastrar</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const formData = ref({
  email: '',
  nome: '',
  endereco: '',
  celular: '',
  senha: ''
});

const errors = ref({});

function validateEmail() {
  const email = formData.value.email;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    errors.value.email = 'Email é obrigatório.';
  } else if (!emailPattern.test(email)) {
    errors.value.email = 'Email inválido.';
  } else {
    errors.value.email = '';
  }
}

function validateNome() {
  const nome = formData.value.nome;
  if (!nome) {
    errors.value.nome = 'Nome é obrigatório.';
  } else {
    errors.value.nome = '';
  }
}

function validateCelular() {
  const celular = formData.value.celular;
  const celularPattern = /^\(\d{2}\) \d{5}-\d{4}$/; // Exemplo: (12) 34567-8901
  if (!celular) {
    errors.value.celular = 'Celular é obrigatório.';
  } else if (!celularPattern.test(celular)) {
    errors.value.celular = 'Formato inválido. Use (XX) XXXXX-XXXX';
  } else {
    errors.value.celular = '';
  }
}

function validateSenha() {
  const senha = formData.value.senha;
  if (!senha) {
    errors.value.senha = 'Senha é obrigatória.';
  } else if (senha.length < 6) {
    errors.value.senha = 'A senha deve ter pelo menos 6 caracteres.';
  } else {
    errors.value.senha = '';
  }
}

function cadastrar() {
  validateEmail();
  validateNome();
  validateCelular();
  validateSenha();

  if (Object.values(errors.value).some(error => error)) {
    alert('Por favor, corrija os erros antes de cadastrar.');
    return;
  }

  const { email, nome, endereco, celular, senha } = formData.value;
  const users = JSON.parse(localStorage.getItem('users')) || {};

  if (users[email]) {
    alert('Email já cadastrado.');
    return;
  }

  const newUser = {
    email,
    nome,
    endereco,
    celular,
    senha
  };
  
  users[email] = newUser;
  localStorage.setItem('users', JSON.stringify(users));

  formData.value = {
    email: '',
    nome: '',
    endereco: '',
    celular: '',
    senha: ''
  };

  alert('Usuário cadastrado com sucesso!');
}
</script>

<style>
.cadastro {
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

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

input:focus {
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

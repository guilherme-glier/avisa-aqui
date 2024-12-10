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
        <span>CPF</span>
        <input type="text" v-model="formData.cpf" @input="applyCpfMask" @blur="validateCPF">
        <p v-if="errors.cpf" class="error">{{ errors.cpf }}</p>
      </div>
      <div class="form-group">
        <span>Senha</span>
        <input type="password" v-model="formData.senha" @blur="validateSenha">
        <p v-if="errors.senha" class="error">{{ errors.senha }}</p>
      </div>
      <div class="form-group">
        <span>Confirmar Senha</span>
        <input type="password" v-model="formData.confirmSenha" @blur="validateConfirmSenha">
        <p v-if="errors.confirmSenha" class="error">{{ errors.confirmSenha }}</p>
      </div>
      <button @click="cadastrar" class="submit-button">Cadastrar</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

let configCadastro = {
  method: 'post',
  url: `${import.meta.env.VITE_API_API_URL}/incidents`,
  headers: { 
    'Authorization': `Bearer ${import.meta.env.VITE_API_API_TOKEN}`,
    'Content-Type': 'application/json'
  }
};

const formData = ref({
  email: '',
  nome: '',
  cpf: '',
  senha: '',
  confirmSenha: ''
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

function validateCPF() {
  const cpf = formData.value.cpf;
  const cpfPattern = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
  if (!cpf) {
    errors.value.cpf = 'CPF é obrigatório.';
  } else if (!cpfPattern.test(cpf)) {
    errors.value.cpf = 'Formato inválido. Use XXX.XXX.XXX-XX';
  } else {
    errors.value.cpf = '';
  }
}

function applyCpfMask() {
  let cpf = formData.value.cpf.replace(/\D/g, ''); // Remove caracteres não numéricos
  if (cpf.length > 3) cpf = cpf.replace(/^(\d{3})(\d)/, '$1.$2');
  if (cpf.length > 6) cpf = cpf.replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
  if (cpf.length > 9) cpf = cpf.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
  formData.value.cpf = cpf;
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

function validateConfirmSenha() {
  const confirmSenha = formData.value.confirmSenha;
  const senha = formData.value.senha;
  if (!confirmSenha) {
    errors.value.confirmSenha = 'Confirmação de senha é obrigatória.';
  } else if (confirmSenha !== senha) {
    errors.value.confirmSenha = 'As senhas não coincidem.';
  } else {
    errors.value.confirmSenha = '';
  }
}

function removeCpfMask(cpf) {
  return cpf.replace(/\D/g, '');
}

async function cadastrar() {
  validateEmail();
  validateNome();
  validateCPF();
  validateSenha();
  validateConfirmSenha();

  if (Object.values(errors.value).some(error => error)) {
    alert('Por favor, corrija os erros antes de cadastrar.');
    return;
  }

  const cpfWithoutMask = removeCpfMask(formData.value.cpf);

  try {
    console.log(formData.value);
    console.log(cpfWithoutMask);

    const response = await axios.post(
      `${import.meta.env.VITE_API_API_URL}/users`,
      {
        name: formData.value.nome,
        email: formData.value.email,
        document: cpfWithoutMask,
        password: formData.value.senha
      },
      { headers: configCadastro.headers });

    console.log(response.data);
    alert('Usuário cadastrado com sucesso!');

    formData.value = {
      email: '',
      nome: '',
      cpf: '',
      senha: '',
      confirmSenha: ''
    };
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    alert('Erro ao cadastrar usuário. Verifique o console para mais detalhes.');
  }
}
</script>

<style scoped>
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

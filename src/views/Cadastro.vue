<template>
  <div class="cadastro">
    <h1>Cadastro</h1>
    <div>
      <div>
        <span>Email</span>
        <input type="text" v-model="formData.email">
      </div>
      <div>
        <span>Nome</span>
        <input type="text" v-model="formData.nome">
      </div>
      <div>
        <span>Endereço</span>
        <input type="text" v-model="formData.endereco">
      </div>
      <div>
        <span>Celular</span>
        <input type="text" v-model="formData.celular">
      </div>
      <div>
        <span>Senha</span>
        <input type="password" v-model="formData.senha">
      </div>
      <button @click="cadastrar">Cadastrar</button>
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

function cadastrar() {

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
  
  // Adiciona o novo usuário ao array
  users[email] = newUser;
  console.log(newUser)

  localStorage.setItem('users', JSON.stringify(users));

  // Limpa os campos
  formData.value = {
    email: '',
    nome: '',
    endereco: '',
    celular: '',
    senha: ''
  }

  alert('Usuário cadastrado com sucesso!');
}
</script>

<style>

</style>

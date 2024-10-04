<template>
  <div class="login">
    <h1>Login</h1>
    <div>
      <div>
        <span>Email</span>
        <input type="text" v-model="email">
      </div>
      <div>
        <span>Senha</span>
        <input type="password" v-model="senha">
      </div>
      <button @click="login">Entrar</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const email = ref('');
const senha = ref('');

function login() {
  const users = JSON.parse(localStorage.getItem('users')) || {};
  const foundUser = users[email.value];

  if (foundUser && foundUser.senha === senha.value) {
    localStorage.setItem('isLoggedIn', 'true'); // Marca o usuário como logado
    localStorage.setItem('userData', foundUser);
    alert('Login realizado com sucesso!');
    window.location.reload()
  } else {
    alert('Email ou senha incorretos.');
  }
}
</script>

<style>

</style>

<template>
  <div class="perfil">
    <div class="logo-container">
      <img src="../assets/logo.png" alt="Logo" class="logo" />
    </div>
    <div class="perfil-info">
      <div class="info-item">
        <b>Nome:</b> <span>{{ user.nome }}</span>
      </div>
      <div class="info-item">
        <b>Email:</b> <span>{{ user.email }}</span>
      </div>
      <div class="info-item">
        <b>CPF:</b> <span>{{ user.cpf }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const user = ref({
  nome: '',
  email: '',
  cpf: ''
});

onMounted(() => {
  const userData = JSON.parse(localStorage.getItem('userData'));
  if (userData) {
    user.value = {
      nome: userData.nome,
      email: userData.email,
      cpf: userData.cpf
    };
  }
});
</script>

<style>
.perfil {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
  font-family: Arial, sans-serif;
}

.logo-container {
  margin-bottom: 20px;
}

.perfil-info {
  background-color: #f2f2f2;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 300px;
  text-align: left;
}

.info-item {
  margin-bottom: 15px;
  font-size: 18px;
}

.info-item b {
  color: #565173;
}
</style>

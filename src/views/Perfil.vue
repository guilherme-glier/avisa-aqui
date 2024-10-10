<template>
  <div class="perfil">
    <div class="logo-container">
      <img src="../assets/logo.png" alt="Logo" class="logo" />
    </div>
      <div class="perfil-info">
          <div class="info-item">
              <b>Nome:</b> <span>{{ nome }}</span>
          </div>
          <div class="info-item">
              <b>Endereço:</b> <span>{{ endereco }}</span>
          </div>
      </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const nome = ref('O nome vai aqui');
const endereco = ref('Endereço vai aqui');
</script>

<style>
.perfil {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
  font-family: Arial, sans-serif;
}

h1 {
  margin-bottom: 20px;
  color: #333;
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

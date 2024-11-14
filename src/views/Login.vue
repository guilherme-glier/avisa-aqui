<template>
  <div class="login">
    <div class="logo-container">
      <img src="../assets/logo.png" alt="Logo" class="logo" />
    </div>
    <div class="login-form">
      <div class="form-group">
        <span>document:</span>
        <input type="text" v-model="document" class="input-field">
      </div>
      <div class="form-group">
        <span>password:</span>
        <input type="password" v-model="password" class="input-field">
      </div>
      <button @click="login" class="login-button">Entrar</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const document = ref('');
const password = ref('');

let configLogin = {
  url: `${import.meta.env.VITE_API_API_URL}login`,
  headers: { 
    'Authorization': `Bearer ${import.meta.env.VITE_API_API_TOKEN}`,
    'Content-Type': 'application/json'
  }
};

async function login() {

  const requestData = {
      document: document.value,
      password: password.value
    };

    let response = null;
    try
    {
      response = await axios.post(configLogin.url, { document: document.value, password: password.value } , { headers: configLogin.headers });
    }
    catch( e )
    {
      console.log( e);
    }
    // Realiza a requisição POST para a API
    

    console.log(response);

  /*if (foundUser && foundUser.password === password.value) {
    localStorage.setItem('isLoggedIn', 'true'); // Marca o usuário como logado
    alert('Login realizado com sucesso!');
    window.location.reload();
  } else {
    alert('document ou password incorretos.');
  }*/

}
</script>

<style>
.login {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
  font-family: Arial, sans-serif;
}

.logo-container {
  margin-left:20px;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
}

.logo {
  height: 100px;
}

.login-form {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 350px; 
}

.form-group {
  margin-bottom: 15px;
}

span {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.input-field {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.input-field:focus {
  border-color: #565173;
  outline: none;
}

.login-button {
  width: 100%;
  padding: 10px;
  background-color: #565173;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.login-button:hover {
  background-color: #5D568C;
}
</style>

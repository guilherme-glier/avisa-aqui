<template>
  <main class="mt-0 main-content main-content-bg">
    <section>
      <div class="page-header min-vh-75">
        <div class="container">
          <div class="row">
            <div class="mx-auto col-xl-4 col-lg-5 col-md-6 d-flex flex-column">
              <div class="mt-6 card card-plain">
                <div class="pb-0 card-header text-start">
                  <a class="custom-brand d-flex mb-1" href="/">
                    <div class="d-flex">
                      <img :src="logo" class="navbar-brand-img" alt="main_logo" />
                    </div>
                  </a>
                  <hr class="custom-divider" />
                  <h3 class="font-weight-bolder text-primary">
                    Bem-vindo de volta
                  </h3>
                  <p class="mb-0">Digite seu CPF e senha para entrar</p>
                </div>
                <div class="card-body">
                  <form novalidate role="form" class="text-start" @submit.prevent="login">
                    <label>CPF</label>
                    <soft-input
                      id="cpf"
                      type="text"
                      placeholder="CPF"
                      name="cpf"
                      :value="formData.cpf"
                      @input="updateField('cpf', $event.target.value)"
                    />
                    <p v-if="errors.cpf" class="error text-danger">{{ errors.cpf }}</p>
                    <label>Senha</label>
                    <soft-input
                      id="senha"
                      type="password"
                      placeholder="Senha"
                      name="senha"
                      :value="formData.senha"
                      @input="updateField('senha', $event.target.value)"
                    />
                    <p v-if="errors.senha" class="error text-danger">{{ errors.senha }}</p>
                    <!-- <soft-switch id="rememberMe" name="rememberMe" checked>
                      Remember me
                    </soft-switch> -->
                    <soft-alert v-if="loginError" color="danger">
                      Houve um erro ao entrar. Tenta novamente ou entre em contato conosco.
                    </soft-alert> 
                    <div class="text-center">
                      <soft-button
                        class="my-4 mb-2"
                        color="primary"
                        full-width
                        type="submit"
                        :disabled="isLoading"
                        >{{ isLoading ? 'Entrando...' : 'Entrar' }}
                      </soft-button>
                    </div>
                  </form>
                </div>
                <div class="px-1 pt-0 text-center card-footer px-lg-2">
                  <p class="mx-auto mb-4 text-sm">
                    Não tem uma conta?
                    <router-link
                      :to="{ name: 'SignUp' }"
                      class="text-primary font-weight-bold"
                      >Cadastre-se</router-link
                    >
                  </p>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div
                class="top-0 oblique position-absolute h-100 d-md-block d-none me-n8"
              >
                <div
                  class="bg-cover oblique-image position-absolute fixed-top ms-auto h-100 z-index-0 ms-n6"
                  :style="{
                    backgroundImage: `url(${backgroundImage})`
                  }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
  <app-footer />
</template>

<script>
import Navbar from "@/examples/PageLayout/Navbar.vue";
import AppFooter from "@/examples/PageLayout/Footer.vue";
import SoftInput from "@/components/SoftInput.vue";
import SoftButton from "@/components/SoftButton.vue";
import SoftAlert from "@/components/SoftAlert.vue";
import { mapMutations } from "vuex";
import api from "@/services/api";

import backgroundImage from '@/assets/img/curved-images/curved8.jpg';
// import backgroundImage from '@/assets/img/bg-login.webp';
import logo from "@/assets/img/logo.png";

const body = document.getElementsByTagName("body")[0];

export default {
  name: "SignIn",
  components: {
    Navbar,
    AppFooter,
    SoftInput,
    SoftButton,
    SoftAlert,
  },
  data() {
    return {
      backgroundImage,
      logo,
      formData: {
        cpf: '',
        senha: '',
      },
      errors: {},
      submitAttempt: false,
      loginError: false,
      isLoading: false,
    };
  },
  created() {
    this.toggleEveryDisplay();
    this.toggleHideConfig();
    // body.classList.remove("bg-gray-100");
  },
  beforeUnmount() {
    this.toggleEveryDisplay();
    this.toggleHideConfig();
    // body.classList.add("bg-gray-100");
  },
  methods: {
    ...mapMutations(["toggleEveryDisplay", "toggleHideConfig"]),
    updateField(field, value) {
      switch (field) {
        case 'cpf':
          let valueAux = value.replace(/\D/g, ''); // Remove tudo que não for número
          valueAux = valueAux.replace(/(\d{3})(\d)/, '$1.$2'); // Adiciona o primeiro ponto
          valueAux = valueAux.replace(/(\d{3})(\d)/, '$1.$2'); // Adiciona o segundo ponto
          valueAux = valueAux.replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // Adiciona o traço
          this.formData[field] = valueAux;
          break;
        default:
          this.formData[field] = value;
          break;
      }

      if (this.submitAttempt) {
        switch (field) {
          case 'cpf':
            this.validateCPF();
            break;
          case 'senha':
            this.validateSenha();
            break;
          default:
            break;
        }
      }
    },
    validateCPF() {
      const cpf = this.formData.cpf;
      const cpfPattern = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
      if (!cpf) {
        this.errors.cpf = 'CPF é obrigatório.';
      } else if (!cpfPattern.test(cpf)) {
        this.errors.cpf = 'CPF inválido.';
      } else {
        this.errors.cpf = '';
      }
    },
    validateSenha() {
      const senha = this.formData.senha;
      if (!senha) {
        this.errors.senha = 'Senha é obrigatória.';
      } else {
        this.errors.senha = '';
      }
    },
    removeCpfMask(cpf) {
      return cpf.replace(/\D/g, '');
    },
    async login() {
      this.submitAttempt = true;

      this.validateCPF();
      this.validateSenha()

      console.log(this.formData);

      if (Object.values(this.errors).some(error => error)) {
        // alert('Por favor, corrija os erros antes de cadastrar.');
        return;
      }

      const cpfWithoutMask = this.removeCpfMask(this.formData.cpf);

      try {
        this.isLoading = true;

        const response = await api.post(
          '/login',
          {
            document: cpfWithoutMask,
            password: this.formData.senha
          }
        );

        console.log(response.data);

        localStorage.setItem('isLoggedIn', 'true'); 
        localStorage.setItem('id', response.data.id);
        localStorage.setItem('userData', JSON.stringify(response.data));

        this.isLoading = false;
        this.formData = {
          cpf: '',
          senha: '',
        };

        this.$router.push({ name: 'Visão Geral' });
      } catch (error) {
        this.isLoading = false;
        this.loginError = true;
      }
    },
  },
};
</script>

<style scoped>
.custom-brand img {
  width: 4rem;
}
.custom-divider {
  background-color: transparent;
  background-image: linear-gradient(to right, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0));
  margin: 2rem 0;
}
.container {
  min-height: 84vh;
}
.card-header {
 background-color: transparent;
}
.error {
  font-size: 12px;
  margin-top: -10px;
}
.alert {
  font-size: 14px;
  font-weight: normal !important;
  line-height: 1.4;
}
</style>
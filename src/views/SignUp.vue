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
                  <div v-if="!registerSuccess">
                    <h3 class="font-weight-bolder text-primary">
                      Bem-vindo!
                    </h3>
                    <p class="mb-0">Preencha os campos abaixo e crie sua conta gratuitamente</p>
                  </div>
                  <div v-if="registerSuccess">
                    <h3 class="font-weight-bolder text-success">
                      Cadastro realizado com sucesso!
                    </h3>
                    <p class="mb-0">Redirecionando para login...</p>
                  </div>
                </div>
                <div v-if="!registerSuccess" class="card-body">
                  <form novalidate role="form" class="text-start" @submit.prevent="cadastrar">
                    <!-- <label>Nome</label> -->
                    <soft-input
                      id="nome"
                      type="text"
                      placeholder="Seu nome"
                      name="nome"
                      :value="formData.nome"
                      @input="updateField('nome', $event.target.value)"
                    />
                    <p v-if="errors.nome" class="error text-danger">{{ errors.nome }}</p>
                    <!-- <label>E-mail</label> -->
                    <soft-input
                      id="email"
                      type="email"
                      placeholder="Seu e-mail"
                      name="email"
                      :value="formData.email"
                      @input="updateField('email', $event.target.value)"
                    />
                    <p v-if="errors.email" class="error text-danger">{{ errors.email }}</p>
                    <!-- <label>CPF</label> -->
                    <soft-input
                      id="cpf"
                      type="text"
                      placeholder="Seu CPF"
                      name="cpf"
                      :value="formData.cpf"
                      @input="updateField('cpf', $event.target.value)"
                    />
                    <p v-if="errors.cpf" class="error text-danger">{{ errors.cpf }}</p>
                    <!-- <label>Senha</label> -->
                    <soft-input
                      id="senha"
                      type="password"
                      placeholder="Crie uma senha"
                      name="senha"
                      :value="formData.senha"
                      @input="updateField('senha', $event.target.value)"
                    />
                    <p v-if="errors.senha" class="error text-danger">{{ errors.senha }}</p>
                    <!-- <label>Confirmar senha</label> -->
                    <soft-input
                      id="confirmSenha"
                      type="password"
                      placeholder="Repita a senha"
                      name="confirmSenha"
                      :value="formData.confirmSenha"
                      @input="updateField('confirmSenha', $event.target.value)"
                    />
                    <p v-if="errors.confirmSenha" class="error text-danger">{{ errors.confirmSenha }}</p>
                    <soft-alert v-if="registerError" color="danger">
                      Houve um erro ao cadastrar-se. Tenta novamente ou entre em contato conosco.
                    </soft-alert> 
                    <div class="text-center">
                      <soft-button
                        class="my-4 mb-2"
                        color="primary"
                        full-width
                        type="submit"
                        :disabled="isLoading"
                        >{{ isLoading ? 'Cadastrando...' : 'Cadastrar' }}
                      </soft-button>
                    </div>
                  </form>
                </div>
                <div v-if="!registerSuccess" class="px-1 pt-0 text-center card-footer px-lg-2">
                  <p class="mx-auto mb-4 text-sm">
                    Já tem uma conta?
                    <router-link
                      :to="{ name: 'SignIn' }"
                      class="text-primary font-weight-bold"
                      >Entre</router-link
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
                  class="bg-cover oblique-image position-absolute fixed-top ms-auto h-100 z-index-0 ms-n7"
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
import AppFooter from "@/examples/PageLayout/Footer.vue";
import SoftInput from "@/components/SoftInput.vue";
import SoftCheckbox from "@/components/SoftCheckbox.vue";
import SoftButton from "@/components/SoftButton.vue";
import SoftAlert from "@/components/SoftAlert.vue";
import { mapMutations } from "vuex";
import api from "@/services/api";

import backgroundImage from '@/assets/img/curved-images/curved9.jpg';
// import backgroundImage from '@/assets/img/bg-login.webp';
import logo from "@/assets/img/logo.png";

export default {
  name: "SignUp",
  components: {
    AppFooter,
    SoftInput,
    SoftCheckbox,
    SoftButton,
    SoftAlert,
  },
  data() {
    return {
      backgroundImage,
      logo,
      formData: {
        email: '',
        nome: '',
        cpf: '',
        senha: '',
        confirmSenha: ''
      },
      errors: {},
      submitAttempt: false,
      registerError: false,
      registerSuccess: false,
      isLoading: false,
    };
  },
  created() {
    this.toggleEveryDisplay();
    this.toggleHideConfig();
  },
  beforeUnmount() {
    this.toggleEveryDisplay();
    this.toggleHideConfig();
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
          case 'nome':
            this.validateNome();
            break;
          case 'email':
            this.validateEmail();
            break;
          case 'cpf':
            this.validateCPF();
            break;
          case 'senha':
            this.validateSenha();
            break;
          case 'confirmSenha':
            this.validateConfirmSenha();
            break;
          default:
            break;
        }
      }
    },
    validateEmail() {
      const email = this.formData.email;
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email) {
        this.errors.email = 'E-mail é obrigatório.';
      } else if (!emailPattern.test(email)) {
        this.errors.email = 'E-mail inválido.';
      } else {
        this.errors.email = '';
      }
    },
    validateNome() {
      const nome = this.formData.nome;
      if (!nome) {
        this.errors.nome = 'Nome é obrigatório.';
      } else {
        this.errors.nome = '';
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
    applyCpfMask() {
      let cpf = this.formData.cpf.replace(/\D/g, ''); // Remove caracteres não numéricos
      if (cpf.length > 3) cpf = cpf.replace(/^(\d{3})(\d)/, '$1.$2');
      if (cpf.length > 6) cpf = cpf.replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
      if (cpf.length > 9) cpf = cpf.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
      this.formData.cpf = cpf;
    },
    validateSenha() {
      const senha = this.formData.senha;
      const senhaPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
      if (!senha) {
        this.errors.senha = 'Senha é obrigatória.';
      } else if (!senhaPattern.test(senha)) {
        this.errors.senha = 'A senha deve ter pelo menos uma letra maiúscula, uma letra minúscula e um número.';
      } else if (senha.length < 8) {
        this.errors.senha = 'A senha deve ter pelo menos 8 caracteres.';
      } else {
        this.errors.senha = '';
      }
    },
    validateConfirmSenha() {
      const confirmSenha = this.formData.confirmSenha;
      const senha = this.formData.senha;
      if (!confirmSenha) {
        this.errors.confirmSenha = 'Confirmação de senha é obrigatória.';
      } else if (confirmSenha !== senha) {
        this.errors.confirmSenha = 'As senhas não são iguais.';
      } else {
        this.errors.confirmSenha = '';
      }
    },
    removeCpfMask(cpf) {
      return cpf.replace(/\D/g, '');
    },
    async cadastrar() {
      this.submitAttempt = true;
      this.registerError = false;

      this.validateEmail();
      this.validateNome();
      this.validateCPF();
      this.validateSenha();
      this.validateConfirmSenha();

      console.log(this.formData);

      if (Object.values(this.errors).some(error => error)) {
        // alert('Por favor, corrija os erros antes de cadastrar.');
        return;
      }

      const cpfWithoutMask = this.removeCpfMask(this.formData.cpf);

      try {
        this.isLoading = true;

        const response = await api.post(
          '/users',
          {
            name: this.formData.nome,
            email: this.formData.email,
            document: cpfWithoutMask,
            password: this.formData.senha
          }
        );

        console.log(response.data);
        // alert('Cadastro realizado com sucesso!');

        this.isLoading = false;
        this.registerSuccess = true;
        this.formData = {
          email: '',
          nome: '',
          cpf: '',
          senha: '',
          confirmSenha: ''
        };

        setTimeout(() => {
          this.$router.push({ name: 'SignIn' });
        }, 4000);
      } catch (error) {
        this.isLoading = false;
        this.registerError = true;
        // alert('Houve um erro ao cadastrar-se. Por favor, entre em contato.');
      }
    }
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
<template>
  <nav class="shadow-none navbar navbar-main navbar-expand-lg border-radius-xl" v-bind="$attrs" id="navbarBlur"
    data-scroll="true">
    <div class="px-3 py-1 container-fluid">
      <div class="d-flex justify-content-center" v-if="!isLoggedIn">
        <img :src="logo" class="navbar-brand-img" alt="main_logo" />
      </div>
      <breadcrumbs :currentPage="currentRouteName" :textWhite="textWhite" />
      <div class="mt-2 collapse navbar-collapse mt-sm-0 me-md-0 me-sm-4 me-sm-4" id="navbar">
        <!-- <div
          class="pe-md-3 d-flex align-items-center ms-md-auto"
        >
          <div class="input-group">
            <span class="input-group-text text-body"
              ><i class="fas fa-search" aria-hidden="true"></i
            ></span>
            <input
              type="text"
              class="form-control"
              placeholder="Type here..."
            />
          </div>
        </div> -->
        <div class="pe-md-3 d-flex align-items-center ms-md-auto" v-if="isLoggedIn">
          <soft-button variant="gradient" color="dark" @click="newIncident">
            <i class="fas fa-plus me-2"></i>
            Registre seu incidente
          </soft-button>
        </div>
        <div class="d-flex align-items-center ms-md-auto" v-if="!isLoggedIn">
          <soft-button color="success" @click="goToLogin">
            <i class="fa fa-sign-in me-2"></i>
            Entrar
          </soft-button>
        </div>
        <ul class="navbar-nav justify-content-end" v-if="isLoggedIn">
          <!-- <li class="nav-item d-flex align-items-center" v-if="!isLoggedIn">
            <router-link
              :to="{ name: 'SignIn' }"
              class="px-0 nav-link font-weight-bold"
              :class="textWhite ? textWhite : 'text-body'"
            >
              <i class="fa fa-user me-sm-1"></i>
              <span class="d-sm-inline d-none">Entrar</span>
            </router-link>
          </li> -->
          <li class="nav-item d-xl-none ps-3 d-flex align-items-center">
            <a href="#" @click="toggleSidebar" class="p-0 nav-link text-body" id="iconNavbarSidenav">
              <div class="sidenav-toggler-inner">
                <i class="sidenav-toggler-line"></i>
                <i class="sidenav-toggler-line"></i>
                <i class="sidenav-toggler-line"></i>
              </div>
            </a>
          </li>
          <!-- <li class="px-3 nav-item d-flex align-items-center">
            <a
              class="p-0 nav-link"
              @click="toggleConfigurator"
              :class="textWhite ? textWhite : 'text-body'"
            >
              <i class="cursor-pointer fa fa-cog fixed-plugin-button-nav"></i>
            </a>
          </li> -->
          <li class="ps-3 nav-item dropdown d-flex align-items-center pe-2">
            <a href="#" class="p-0 nav-link" :class="[
              textWhite ? textWhite : 'text-body',
              showMenu ? 'show' : '',
            ]" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false" @click="showMenu = !showMenu">
              <!-- <i class="cursor-pointer fa fa-bell"></i> -->
              <i class="fa fa-user me-sm-1"></i>
              <span class="d-sm-inline d-none font-weight-bold">{{ user?.name || 'Minha conta' }}</span>
            </a>
            <ul class="px-2 py-3 dropdown-menu dropdown-menu-end me-sm-n4 dropdown-user" :class="showMenu ? 'show' : ''"
              aria-labelledby="dropdownMenuButton">
              <li class="user-infos">
                <div>
                  <span class="d-sm-inline d-none font-weight-bold text-dark text-lg">Olá, {{ user?.name || 'desconhecido' }}!</span>
                  <span class="d-sm-inline d-none">{{ user?.email }}</span>
                </div>
                <hr class="m-2" />
              </li>
              <li>
                <a class="dropdown-item border-radius-md" @click="logout">
                  <div class="py-1 d-flex">
                    <div class="my-auto avatar avatar-sm bg-gradient-danger me-3">
                      <i class="fa fa-sign-out"></i>
                    </div>
                    <div class="d-flex flex-column justify-content-center">
                      <h6 class="mb-0 text-sm font-weight-normal">
                        Sair
                      </h6>
                    </div>
                  </div>
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
<script>
import Breadcrumbs from "../Breadcrumbs.vue";
import SoftButton from "@/components/SoftButton.vue";
import { mapMutations, mapActions } from "vuex";
import { useModal } from 'vue-final-modal';
import NewIncidentModal from '@/views/NewIncidentModal.vue';

import logo from "@/assets/img/logo.png";

export default {
  name: "navbar",
  data() {
    return {
      showMenu: false,
      logo,
    };
  },
  props: ["minNav", "textWhite"],
  created() {
    this.minNav;
  },
  methods: {
    ...mapMutations(["navbarMinimize", "toggleConfigurator"]),
    ...mapActions(["toggleSidebarColor"]),
    toggleSidebar() {
      this.toggleSidebarColor("bg-white");
      this.navbarMinimize();
    },
    newIncident() {
      // this.$router.push({ name: 'Novo Incidente' })
      const { open, close } = useModal({
        component: NewIncidentModal,
        attrs: {
          onClose() {
            close();
          },
        },
      });
      open();
    },
    goToLogin() {
      this.$router.push({ name: 'SignIn' });
    },
    logout() {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('id');
      localStorage.removeItem('userData');
      this.$router.push({ name: 'SignIn' }); // Redireciona para a tela de login após logout
    },
  },
  components: {
    Breadcrumbs,
    SoftButton,
  },
  computed: {
    currentRouteName() {
      return this.$route.name;
    },
    isLoggedIn() {
      return localStorage.getItem('isLoggedIn');
    },
    user() {
      const userData = localStorage.getItem('userData');
      if (userData) {
        const user = JSON.parse(userData);
        return user;
      }
      return {};
    }
  },
  updated() {
    const navbar = document.getElementById("navbarBlur");
    window.addEventListener("scroll", () => {
      if (navbar) {
        if (window.scrollY > 10 && this.$store.state.isNavFixed) {
          navbar.classList.add("blur");
          navbar.classList.add("position-sticky");
          navbar.classList.add("shadow-blur");
        } else {
          navbar.classList.remove("blur");
          navbar.classList.remove("position-sticky");
          navbar.classList.remove("shadow-blur");
        }
      }
    });
  },
};
</script>

<style scoped>
.navbar-brand-img {
  height: 4rem;
  margin-right: 1.5rem;
}

.dropdown-user {
  pointer-events: none !important;
  text-decoration: none !important;
  cursor: default !important;
}

ul .dropdown-item {
  cursor: pointer;
  pointer-events: auto;
}

.user-infos>div {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 1rem 0.5rem;
  min-width: 250px;
}
</style>
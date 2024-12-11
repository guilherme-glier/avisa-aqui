<template>
  <div class="py-4 container-fluid">
    <div class="row align-items-center mb-3">
      <div class="col-lg-4 col-sm-8">
        <incident-list-nav-pill :onChange="changeListFilter" />
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12">
        <div class="card mb-4">
          <div v-if="!isLoading" class="card-body px-0 pb-2 pt-3">
            <div v-if="filteredIncidents.length" class="table-responsive p-0">
              <table class="table align-items-center mb-0">
                <thead>
                  <tr>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                      Categoria
                    </th>
                    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">
                      Informação
                    </th>
                    <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                      Status
                    </th>
                    <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                      Data e Hora
                    </th>
                    <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                      Localização
                    </th>
                    <th class="text-secondary opacity-7"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(incident, index) in filteredIncidents" :key="index">
                    <td style="padding-left:1rem!important;">
                      <div class="d-flex px-2 py-1">
                        <div class="d-flex flex-column justify-content-center">
                          <!-- <h6 class="mb-0 text-sm">John Michael</h6> -->
                          <p class="text-xs text-dark mb-0 font-weight-bold">
                            {{ categories[incident.ref_category].description }}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <p class="text-xs text-dark mb-0">{{ categories[incident.ref_category].type === 'LOGIC' ?
                        transformLogicType(incident.value) : incident.value }}</p>
                    </td>
                    <td class="align-middle text-center text-sm">
                      <a>
                        <soft-badge :color="incident.active ? 'secondary' : 'success'" variant="gradient" size="sm">{{
                          incident.active ? 'EM ABERTO' : 'RESOLVIDO' }}</soft-badge>
                      </a>
                    </td>
                    <td class="align-middle text-center">
                      <span class="text-dark text-xs">{{ incident.dt_register }}</span>
                    </td>
                    <td class="align-middle text-center">
                      <p class="text-xs text-dark mb-0">{{ incident.latitude }}, {{ incident.longitude }}</p>
                    </td>
                    <td class="align-middle">
                      <a v-if="incident.active" class="btn btn-outline-light text-success m-0"
                        @click="markAsResolved(incident.id)">
                        <i class="fa fa-check me-1" aria-hidden="true"></i>
                        Resolver</a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else class="empty-message">
              Nenhum incidente registrado.
            </div>
          </div>
          <div v-if="isLoading" class="card-body px-0 pb-2 pt-3">
            <div class="empty-message">
              Carregando...
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SoftBadge from "@/components/SoftBadge.vue";
import IncidentListNavPill from "./components/IncidentListNavPill.vue";
import api from "@/services/api";

export default {
  name: "IncidentList",
  data() {
    return {
      isLoading: false,
      userIncidents: [],
      filteredIncidents: [],
      categories: {},
      currentFilter: 'ALL',
    };
  },
  components: {
    SoftBadge,
    IncidentListNavPill,
  },
  created() {
    this.loadData();
  },
  methods: {
    async loadData() {
      try {
        this.isLoading = true;
        await Promise.all([this.loadCategories(), this.loadIncidents()]);
        this.changeListFilter(this.currentFilter);
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
      }
    },
    // Carrega os incidentes ao montar o componente
    async loadIncidents() {
      try {
        const response = await api.get('/incidents');

        // Filtra os incidentes ativos do usuário logado
        const userId = localStorage.getItem('id');

        const userIncidents = response.data.filter(
          incident => incident.ref_user == userId
        );

        userIncidents.sort((a, b) => new Date(b.dt_register) - new Date(a.dt_register));
        this.userIncidents = userIncidents;
      } catch (error) {
        console.error('Erro ao carregar incidentes:', error);
        alert('Houve um erro ao carregar os incidentes. Tente novamente ou entre em contato conosco.');
      }
    },
    // Função para marcar o incidente como resolvido
    async markAsResolved(incidentId) {
      try {
        // Configuração para a requisição de atualização de incidente
        await api.get(`/incidents/${incidentId}/resolve`);

        await this.loadIncidents();
        this.changeListFilter(this.currentFilter);
      } catch (error) {
        console.error('Erro ao marcar incidente como resolvido:', error);
        alert('Houve um erro ao atualizar o incidente. Tente novamente ou entre em contato conosco.');
      }
    },
    async loadCategories() {
      try {
        let response = await api.get('/categories');

        if (response.data) {
          this.categories = response.data.reduce((acc, item) => {
            acc[item.id] = { description: item.description, type: item.type };
            return acc;
          }, {});
        }
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
        alert('Houve um erro ao carregar os incidentes. Tente novamente ou entre em contato conosco.');
      }
    },
    changeListFilter(filter) {
      this.currentFilter = filter;
      switch (filter) {
        case 'ALL':
          this.filteredIncidents = [...this.userIncidents];
          break;
        case 'ACTIVE':
          this.filteredIncidents = this.userIncidents.filter((x) => x.active);
          break;
        case 'NOT_ACTIVE':
          this.filteredIncidents = this.userIncidents.filter((x) => !x.active);
          break;
        default:
          break;
      }
    },
    transformLogicType(value) {
      return String(value) === '1' ? 'Sim' : 'Não';
    }
  }
};
</script>


<style scoped>
.btn-outline-light {
  padding: 0.3rem 0.8rem !important;
  color: #17ad37 !important;
}

td {
  padding: 0.7rem 0.5rem !important;
}

.empty-message {
  padding: 4rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-lg-12">
        <div class="card z-index-2 card-map">
          <main id="main-home">
            <header id="header">
              <div class="select-container">
                <v-select :options="categorias" :reduce="item => item.id" v-model="selectedCategory"
                  placeholder="Filtre por uma categoria" class="form-control custom-select" />
              </div>
            </header>
            <section class="map">
              <Map :selectedCategory="selectedCategory" />
            </section>
          </main>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Map from '@/components/Map.vue';
import api from "@/services/api";

export default {
  name: "Overview",
  data() {
    return {
      categorias: [],
      selectedCategory: null,
    };
  },
  components: {
    Map,
  },
  created() {
    this.getCategorias();
  },
  methods: {
    // Função local para buscar as categorias da API
    async getCategorias() {
      try {
        const response = await api.get('/categories');
        if (response.data) {
          this.categorias = response.data.map(item => ({
            id: item.id,
            label: item.description,
          }));
        } else {
          console.error('Estrutura de dados inesperada:', response.data);
        }
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
      }
    }
  },
};
</script>

<style scoped>
#main-home {
  height: 80vh;
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
}

#header {
  position: relative;
  background: white;
  height: 100px;
  padding: 20px;
}

#map {
  min-height: calc(80vh - 100px);
  height: 100%;
  width: 100%;
}

header {
  background-color: #ffffff;
  color: #565173;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Estilo do combo box */
.select-container {
  display: flex;
  align-items: center;
  justify-content: end;
  flex: 1;
}
.select-container > div {
  width: 40%;
  min-width: 400px;
}

.card-map {
  overflow: hidden;
}
</style>

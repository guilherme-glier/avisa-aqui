<template>
  <div id="map"></div>
</template>

<script setup>
import { onMounted, watch, ref } from 'vue';
import LeafLet from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import axios from 'axios';

const props = defineProps({
  selectedCategory: String,
});

let map, heatLayer;
let incidentsAPI = ref([]);
let userLocation = ref({ lat: 10.0217445, lng: 104.009865 }); // Coordenadas padrão, caso a localização do usuário não seja obtida

let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: `${import.meta.env.VITE_API_API_URL}/incidents`,
  headers: { 
    'Authorization': `Bearer ${import.meta.env.VITE_API_API_TOKEN}`
  }
};

// Função para coletar a localização do usuário
async function coletarLocalizacao() {
  if (navigator.geolocation) {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          resolve(coords);
        },
        (error) => {
          console.error('Erro ao obter localização:', error);
          reject(error);
        }
      );
    });
  } else {
    console.error('Geolocalização não é suportada pelo navegador');
    return null;
  }
}

// Função para inicializar o mapa centrado nas coordenadas fornecidas
function initializeMap(lat, lng) {
  const mapOptions = {
    center: [lat, lng],
    zoom: 11,
    scrollWheelZoom: false,
  };
  map = new LeafLet.map('map', mapOptions);

  // Adiciona o layer de tiles do OpenStreetMap
  LeafLet.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  // Inicializa o layer de heatmap vazio
  heatLayer = LeafLet.heatLayer([], {
    radius: 25,
    blur: 15,
    maxZoom: 17,
  }).addTo(map);

  // Carrega os dados do mapa de calor inicialmente
  updateHeatmap();
}

// Observa mudanças na categoria selecionada
watch(() => props.selectedCategory, () => {
  updateHeatmap();
});

function updateHeatmap() {
  // Filtra por categoria, mas sem verificar o status ativo
  const filteredIncidents = incidentsAPI.value.filter(
    (incident) =>
      !props.selectedCategory || incident.ref_category === props.selectedCategory // Filtra por categoria se selecionada
  );

  // Mapeia os incidentes para o formato necessário para o heatmap (latitude, longitude, intensidade)
  const heatmapData = filteredIncidents.map((incident) => [
    incident.latitude,
    incident.longitude,
    10, // Ajuste a intensidade conforme necessário
  ]);

  // Limpa o layer de heatmap atual e adiciona os dados filtrados
  heatLayer.setLatLngs(heatmapData);
}

async function getIncidents() {
  try {
    console.log('Configuração de API:', config);
    let response = await axios.request(config);

    console.log('Dados da API:', response.data);

    if (response.data && response.data.data) {
      incidentsAPI.value = response.data.data.map(item => ({
        id: item.id,
        ref_user: item.ref_user,
        ref_category: item.ref_category,
        latitude: item.latitude,
        longitude: item.longitude,
        value: item.value,
        active: item.active
      }));
    } else {
      console.error('Estrutura inesperada de dados:', response.data);
    }

    console.log('Incidents carregados:', incidentsAPI.value);
    
    // Atualiza o heatmap após os incidentes serem carregados
    updateHeatmap();
  } catch (error) {
    console.error('Erro ao carregar incidents:', error);
  }
}

// Inicializa o mapa ao montar o componente
onMounted(async () => {
  try {
    // Tenta coletar a localização do usuário
    const coords = await coletarLocalizacao();
    if (coords) {
      userLocation.value = coords;
    }
  } catch (error) {
    console.warn('Usando coordenadas padrão');
  }

  // Inicializa o mapa usando a localização do usuário ou a padrão
  initializeMap(userLocation.value.lat, userLocation.value.lng);
  getIncidents();
});
</script>

<style>
</style>

<template>
    <div id="map"></div>
  </template>
  
  <script setup>
  import { onMounted, watch,ref } from 'vue';
  import LeafLet from 'leaflet';
  import 'leaflet/dist/leaflet.css';
  import 'leaflet.heat';
  import axios from 'axios';

  const props = defineProps({
    selectedCategory: String,
  });
  
  let map, heatLayer;
  let incidentsAPI = ref([]);

  let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: `${import.meta.env.VITE_API_API_URL}incidents`,
  headers: { 
    'Authorization': `Bearer ${import.meta.env.VITE_API_API_TOKEN}`
  }
  };

  function initializeMap() {
    const mapOptions = {
      center: [-29.606, -52.1944],
      zoom: 10,
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
    const incidents = JSON.parse(localStorage.getItem('incidents')) || [];
  
    // Filtra os incidentes abertos e, se houver uma categoria selecionada, filtra por categoria também
    const filteredIncidents = incidents.filter(
      (incident) =>
        incident.status === 'ativo' && // Apenas incidentes ativos
        (!props.selectedCategory || incident.categoria === props.selectedCategory) // Filtra por categoria se selecionada
    );
  
    // Mapeia os incidentes para o formato necessário para o heatmap (latitude, longitude, intensidade)
    const heatmapData = filteredIncidents.map((incident) => [
      incident.latitude,
      incident.longitude,
      1, // Ajuste a intensidade conforme necessário
    ]);
  
    // Limpa o layer de heatmap atual e adiciona os dados filtrados
    heatLayer.setLatLngs(heatmapData);
  }
  
  async function getIncidents() {
  try {
    console.log('Configuração de API:', config);
    let response = await axios.request(config);

    // Verifique a estrutura dos dados
    console.log('Dados da API:',typeof response.data);

    // Se response.data for um objeto com a chave "data" que contém um array:
    if (response.data && response.data.data) {
      // Converte response.data.data para um array e mapeia para extrair o id, description, validation, type
      incidentsAPI.value = response.data.data.map(item => ({
        id: item.id, // O ID será o valor da opção
        ref_user: item.ref_user, // A descrição será o texto visível
        ref_category: item.ref_category,
        latitude: item.latitude,
        longitude: item.longitude,
        value: item.value,
        active: item.active
      }));
    } else {
      console.error('Estrutura inesperada de dados:', response.data);
    }

    console.log('Incidents carregadas:', incidentsAPI.value);
  } catch (error) {
    console.error('Erro ao carregar incidents:', error);
  }
  }

  // Inicializa o mapa ao montar o componente
  onMounted(() => {
    initializeMap();
    getIncidents();
  });
  </script>
  
  <style>
  </style>
  
<template>
    <div id="map"></div>
  </template>
  
  <script setup>
  import { onMounted, watch } from 'vue';
  import LeafLet from 'leaflet';
  import 'leaflet/dist/leaflet.css';
  import 'leaflet.heat';
  
  const props = defineProps({
    selectedCategory: String,
  });
  
  let map, heatLayer;
  
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
  
  // Inicializa o mapa ao montar o componente
  onMounted(() => {
    initializeMap();
  });
  </script>
  
  <style>
  </style>
  
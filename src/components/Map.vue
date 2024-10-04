<template>
    <div id="map"></div>
  </template>
  
  <script setup>
    import { ref, onMounted } from 'vue'
    import LeafLet from 'leaflet'
    import 'leaflet/dist/leaflet.css';

    onMounted(() => {
        const mapOptions = {
            center:[-29.606, -52.1944],
            zoom:10
        }
        const map = new LeafLet.map('map' , mapOptions);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
    })


    // let marker = new L.Marker([51.958, 9.141]);
    // marker.addTo(map);
  </script>
  
  <style>
  
  </style>
  
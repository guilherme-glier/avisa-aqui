<template>
  <div class="nav-wrapper position-relative end-0">
    <ul class="nav nav-pills nav-fill p-1" role="tablist">
      <li class="nav-item">
        <a class="nav-link mb-0 px-0 py-1 active active" data-bs-toggle="tab" @click="onChange('ALL')" role="tab"
          aria-selected="true">Todos</a>
      </li>
      <li class="nav-item">
        <a class="nav-link mb-0 px-0 py-1" data-bs-toggle="tab" @click="onChange('ACTIVE')" role="tab"
          aria-selected="false">Em aberto</a>
      </li>
      <li class="nav-item">
        <a class="nav-link mb-0 px-0 py-1" data-bs-toggle="tab" @click="onChange('NOT_ACTIVE')" role="tab"
          aria-selected="false">Resolvidos</a>
      </li>
    </ul>
  </div>
</template>

<script>
import setNavPills from "@/assets/js/nav-pills.js";

export default {
  name: "incident-list-nav-pill",
  mounted() {
    setNavPills();
  },
  props: {
    onChange: {
      type: Function,
      required: false,
    },
  },
};
</script>

<style scoped>
a {
  cursor: pointer;
}
.nav-item {
  transform: scale(0.9);
}
</style>

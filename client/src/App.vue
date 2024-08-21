<template>
  <div class="layout">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
</script>

<style>
body {
  margin: 0;
  padding: 0;
  font-family: "Segoe UI", Arial, sans-serif;
}
.layout {
  display: flex;
  min-height: 100vh;
}
</style>

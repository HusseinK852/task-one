<template>
  <v-container fluid>
    <v-row>
      <v-col cols="3">
        <SideBar />
      </v-col>
      <v-col cols="9">
        <router-view />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
  import SideBar from '../components/SideBar.vue'
  import { defineComponent } from 'vue'

  export default defineComponent({
    components: {
      SideBar,
    },
  })
</script>

<style scoped>
</style>

<template>
  <div class="container">
    <Sidebar @role-selected="handleRoleSelected" />
    <Role v-if="selectedRole" :role="selectedRole" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import Sidebar from "../components/SideBar.vue";
import Role from "../components/Role.vue";
import type { RoleT } from "../types/roles";

export default defineComponent({
  components: {
    Sidebar,
    Role,
  },
  setup() {
    const selectedRole = ref<RoleT | null>(null);

    const handleRoleSelected = (role: RoleT) => {
      selectedRole.value = role;
    };

    return {
      selectedRole,
      handleRoleSelected,
    };
  },
});
</script>

<style scoped>
.container {
  display: flex;
}
</style>

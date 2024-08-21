<template>
  <aside>
    <ul>
      <li v-for="role in AllRoles" :key="role.id" @click="selectRole(role)">
        {{ role.name }}
      </li>
    </ul>
  </aside>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed } from "vue";
import { useRolesStore } from "../stores/roles";
import type { RoleT } from "../types/roles";

export default defineComponent({
  setup(_, { emit }) {
    const rolesStore = useRolesStore();

    onMounted(() => {
      rolesStore.fetchRoles();
    });

    const AllRoles = computed(() => {
      return rolesStore.roles;
    });

    const selectRole = (role: RoleT) => {
      emit("role-selected", role);
    };

    return {
      AllRoles,
      selectRole,
    };
  },
});
</script>

<style scoped>
aside {
  width: 15rem;
  background-color: #ae16ab;
  padding: 20px;
  margin-right: 5rem;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin-bottom: 10px;
  font-weight: bold;
  cursor: pointer;
  padding: 1rem;
  border-radius: 15px;
  background: #ffffff;
  transition: background-color 0.3s;
}

li:hover {
  background-color: #f0e6f5;
}
</style>

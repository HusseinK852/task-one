<template>
  <main v-if="role">
    <EditableField
      label="ID"
      :value="editableRole.id"
      v-model="editableRole.id"
      @save="saveField()"
    />
    <EditableField
      label="Name"
      :value="editableRole.name"
      v-model="editableRole.name"
      @save="saveField()"
    />
    <EditableField
      label="Description"
      :value="editableRole.description"
      v-model="editableRole.description"
      @save="saveField()"
    />
    <EditableField
      label="Priority"
      :value="editableRole.priority"
      v-model="editableRole.priority"
      type="number"
      @save="saveField()"
    />
    <EditableField
      label="Enabled"
      :value="editableRole.enabled"
      v-model="editableRole.enabled"
      type="checkbox"
      @save="saveField()"
    />
    <ConditionsList
      :conditions="editableRole.conditions"
      v-model="editableRole.conditions"
      @save="saveField()"
    />
    <ActionsList
      :actions="editableRole.actions"
      v-model="editableRole.actions"
      @save="saveField()"
    />
  </main>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { useRolesStore } from "../stores/roles";
import EditableField from "./EditableField.vue";
import ConditionsList from "./ConditionsList.vue";
import ActionsList from "./ActionsList.vue";
import type { PropType } from "vue";
import type { RoleT } from "../types/roles";

export default defineComponent({
  components: {
    EditableField,
    ConditionsList,
    ActionsList,
  },
  props: {
    role: {
      type: Object as PropType<RoleT>,
      required: true,
    },
  },
  setup(props) {
    const rolesStore = useRolesStore();

    const editableRole = ref({ ...props.role });

    watch(
      () => props.role,
      (newRole) => {
        editableRole.value = { ...newRole };
      }
    );

    function saveField() {
      rolesStore.editRole(editableRole.value).then((updatedRole) => {
        editableRole.value = updatedRole;
      });
    }

    return {
      editableRole,
      saveField,
    };
  },
});
</script>

<template>
  <div v-if="conditions.length">
    <label>Conditions:</label>
    <ul>
      <li v-for="(condition, index) in conditions" :key="condition._id">
        <div v-if="!isEditing[index]">
          <span
            >{{ condition.field }} {{ condition.operator }}
            {{ condition.value }}</span
          >
          <button @click="toggleEdit(index)">Edit</button>
        </div>
        <div v-else>
          <input v-model="condition.field" placeholder="Field" />
          <select v-model="condition.operator">
            <option value="equals">equals</option>
            <option value="greater_than">greater_than</option>
            <option value="less_than">less_than</option>
            <option value="not_equals">not_equals</option>
            <option value="greater_or_equal">greater_or_equal</option>
            <option value="less_or_equal">less_or_equal</option>
          </select>
          <input v-model="condition.value" placeholder="Value" />
          <button @click="toggleEdit(index)">Save</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import type { ConditionT } from "../types/roles";
import type { PropType } from "vue";

export default defineComponent({
  props: {
    conditions: {
      type: Array as PropType<ConditionT[]>,
      required: true,
    },
  },
  emits: ["update:conditions", "save"],
  setup(props, { emit }) {
    const conditions = ref([...props.conditions]);
    const isEditing = ref(conditions.value.map(() => false));

    watch(
      () => conditions.value,
      (newConditions) => {
        conditions.value = [...newConditions];
      }
    );

    function toggleEdit(index: number) {
      isEditing.value[index] = !isEditing.value[index];
      if (!isEditing.value[index]) {
        emit("update:conditions", conditions.value);
        emit("save");
      }
    }

    return {
      conditions,
      isEditing,
      toggleEdit,
    };
  },
});
</script>

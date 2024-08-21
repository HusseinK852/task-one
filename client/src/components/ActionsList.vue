<template>
  <div v-if="actions && actions.length">
    <label>Actions:</label>
    <ul>
      <li v-for="(action, index) in actions" :key="action._id">
        <div v-if="!isEditing[index]">
          <span>
            Type: {{ action.type }} <br />
            <span v-if="action.algorithm">
              Algorithm: {{ action.algorithm }} <br />
            </span>
            <span
              v-if="action.key_size"
              :class="{ 'text-red-500': isNaN(Number(action.key_size)) }"
            >
              Key Size: {{ action.key_size }} <br />
            </span>
          </span>
          <button @click="toggleEditing(index)">Edit</button>
        </div>
        <div v-else>
          <input
            v-model="actions[index].type"
            type="text"
            placeholder="Type"
            @blur="toggleEditing(index)"
          />
          <input
            v-model="actions[index].algorithm"
            type="text"
            placeholder="Algorithm"
            @blur="toggleEditing(index)"
          />
          <input
            v-model="actions[index].key_size"
            type="text"
            placeholder="Key Size"
            :class="{
              'border-red-500': isNaN(Number(actions[index].key_size)),
            }"
            @blur="toggleEditing(index)"
          />
          <button @click="toggleEditing(index)">Save</button>
          <button @click="removeAction(index)">Remove</button>
        </div>
      </li>
    </ul>
    <button @click="addAction">Add Action</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import type { PropType } from "vue";
import type { ActionT } from "../types/roles";

export default defineComponent({
  props: {
    actions: {
      type: Array as PropType<ActionT[]>,
      required: true,
    },
  },
  emits: ["update:actions", "save"],
  setup(props, { emit }) {
    const actions = ref([...props.actions]);
    const isEditing = ref(actions.value.map(() => false));

    watch(
      () => props.actions,
      (newActions) => {
        actions.value = [...newActions];
      }
    );

    const toggleEditing = (index: number) => {
      isEditing.value[index] = !isEditing.value[index];
      if (!isEditing.value[index]) {
        emit("update:actions", actions.value);
        emit("save");
      }
    };

    const removeAction = (index: number) => {
      actions.value.splice(index, 1);
      emit("update:actions", actions.value);
      emit("save");
    };

    const addAction = () => {
      const newAction: ActionT = {
        _id: String(Date.now()),
        type: "",
        algorithm: "",
        key_size: "",
      };
      actions.value.push(newAction);
      isEditing.value.push(true);
      emit("update:actions", actions.value);
    };

    return {
      actions,
      isEditing,
      toggleEditing,
      removeAction,
      addAction,
    };
  },
});
</script>

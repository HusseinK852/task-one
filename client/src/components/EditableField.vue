<template>
  <div>
    <label>{{ label }}: </label>
    <span v-if="!isEditing">{{ value }}</span>
    <input v-else :type="type" v-model="localValue" />
    <button @click="toggleEdit">
      {{ isEditing ? "Save" : "Edit" }}
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";

export default defineComponent({
  props: {
    label: {
      type: String,
      required: true,
    },
    value: {
      type: [String, Number, Boolean],
      required: true,
    },
    modelValue: {
      type: [String, Number, Boolean],
      required: true,
    },
    type: {
      type: String,
      default: "text",
    },
  },
  emits: ["update:modelValue", "save"],
  setup(props, { emit }) {
    const isEditing = ref(false);
    const localValue = ref(props.modelValue);

    watch(
      () => props.modelValue,
      (newValue) => {
        localValue.value = newValue;
      }
    );

    function toggleEdit() {
      isEditing.value = !isEditing.value;
      if (!isEditing.value) {
        emit("update:modelValue", localValue.value);
        emit("save");
      }
    }

    return {
      isEditing,
      localValue,
      toggleEdit,
    };
  },
});
</script>

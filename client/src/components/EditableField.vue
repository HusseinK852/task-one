<template>
  <div>
    <v-row>
      <v-col cols="12" md="4">
        <v-label>{{ label }}:</v-label>
      </v-col>
      <v-col cols="12" md="6">
        <span v-if="!isEditing">{{ value }}</span>
        <v-text-field
          v-else
          v-model="localValue"
          dense
          hide-details
          solo
          :type="type"
        />
      </v-col>
      <v-col cols="12" md="2">
        <v-btn icon @click="toggleEdit">
          <v-icon v-if="isEditing">mdi-content-save</v-icon>
          <v-icon v-else>mdi-pencil</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, watch } from 'vue'

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
        default: 'text',
      },
    },
    emits: ['update:modelValue'],
    setup (props, { emit }) {
      const isEditing = ref(false)
      const localValue = ref(props.modelValue)

      watch(
        () => props.modelValue,
        newValue => {
          localValue.value = newValue
        }
      )

      function toggleEdit () {
        isEditing.value = !isEditing.value
        if (!isEditing.value) {
          emit('update:modelValue', localValue.value)
        }
      }

      return {
        isEditing,
        localValue,
        toggleEdit,
      }
    },
  })
</script>

<style scoped>

v-label {
  font-weight: bold;
  font-size: 1.2em;
}

v-text-field {
  width: 100%;
}
</style>

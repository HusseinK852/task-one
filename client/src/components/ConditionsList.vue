<template>
  <v-container v-if="localConditions.length">
    <v-row>
      <v-col cols="12">
        <v-label>Conditions:</v-label>
      </v-col>
      <v-col cols="12">
        <v-list>
          <v-list-item v-for="(condition, index) in localConditions" :key="condition._id">
            <div v-if="!isEditing[index]">
              <span>{{ condition.field }} {{ condition.operator }} {{ condition.value }}</span>
              <v-btn icon @click="toggleEdit(index)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </div>
            <div v-else>
              <v-text-field
                v-model="localConditions[index].field"
                dense
                hide-details
                label="Field"
                solo
              />
              <v-select
                v-model="localConditions[index].operator"
                dense
                hide-details
                :items="operators"
                label="Operator"
                solo
              />
              <v-text-field
                v-model="localConditions[index].value"
                dense
                hide-details
                label="Value"
                solo
              />
              <v-btn icon @click="toggleEdit(index)">
                <v-icon>mdi-content-save</v-icon>
              </v-btn>
            </div>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>

    <v-btn class="mt-4" color="primary" @click="addCondition">
      <v-icon left>mdi-plus</v-icon> Add Condition
    </v-btn>

    <v-row v-if="isAddingNew">
      <v-col cols="4">
        <v-text-field
          v-model="newCondition.field"
          dense
          hide-details
          label="Field"
          solo
        />
      </v-col>
      <v-col cols="4">
        <v-select
          v-model="newCondition.operator"
          dense
          hide-details
          :items="operators"
          label="Operator"
          solo
        />
      </v-col>
      <v-col cols="4">
        <v-text-field
          v-model="newCondition.value"
          dense
          hide-details
          label="Value"
          solo
        />
      </v-col>
      <v-col cols="12">
        <v-btn @click="saveNewCondition">Save</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
  import { defineComponent, ref, watch } from 'vue'
  import type { ConditionT } from '../types/rules'
  import type { PropType } from 'vue'

  export default defineComponent({
    props: {
      modelValue: {
        type: Array as PropType<ConditionT[]>,
        required: true,
      },
    },
    emits: ['update:modelValue'],
    setup (props, { emit }) {
      const localConditions = ref([...props.modelValue])
      const isEditing = ref(Array(localConditions.value.length).fill(false))
      const isAddingNew = ref(false)

      const operators = ['equals', 'greater_than', 'less_than', 'not_equals', 'greater_or_equal', 'less_or_equal']

      const newCondition = ref<ConditionT>({
        field: '',
        operator: 'equals',
        value: '',
      })

      const toggleEdit = (index: number) => {
        isEditing.value[index] = !isEditing.value[index]
        if (!isEditing.value[index]) {
          emit('update:modelValue', [...localConditions.value])
        }
      }

      const addCondition = () => {
        isAddingNew.value = true
      }

      const saveNewCondition = () => {
        localConditions.value.push({ ...newCondition.value })
        emit('update:modelValue', [...localConditions.value])
        resetNewCondition()
      }

      const resetNewCondition = () => {
        isAddingNew.value = false
        newCondition.value = { field: '', operator: 'equals', value: '' }
      }

      return {
        localConditions,
        isEditing,
        isAddingNew,
        newCondition,
        operators,
        toggleEdit,
        addCondition,
        saveNewCondition,
      }
    },
  })
</script>

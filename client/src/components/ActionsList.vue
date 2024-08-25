<template>
  <v-container v-if="localActions && localActions.length">
    <v-row>
      <v-col cols="12">
        <v-label class="font-weight-bold mb-4">Actions:</v-label>
      </v-col>
      <v-col cols="12">
        <v-row v-for="(action, index) in localActions" :key="action._id" class="mb-3">
          <v-col cols="12">
            <v-card outlined>
              <v-card-title>
                <v-icon color="primary" small>mdi-action</v-icon>
                <span class="ml-2">{{ action.type }}</span>
                <v-spacer />
                <v-btn icon @click="toggleEditing(index)">
                  <v-icon v-if="isEditing[index]">mdi-content-save</v-icon>
                  <v-icon v-else>mdi-pencil</v-icon>
                </v-btn>
              </v-card-title>
              <v-card-subtitle v-if="!isEditing[index]">
                <div>
                  <span>Type: {{ action.type }}</span><br>
                  <span v-if="action.algorithm">Algorithm: {{ action.algorithm }}</span><br>
                  <span
                    v-if="action.key_size"
                    :class="{
                      'text-red-500': isNaN(Number(action.key_size)),
                    }"
                  >
                    Key Size: {{ action.key_size }}
                  </span>
                </div>
              </v-card-subtitle>
              <v-card-subtitle v-else>
                <v-text-field
                  v-model="localActions[index].type"
                  dense
                  hide-details
                  label="Type"
                  solo
                  @blur="toggleEditing(index)"
                />
                <v-text-field
                  v-model="localActions[index].algorithm"
                  dense
                  hide-details
                  label="Algorithm"
                  solo
                  @blur="toggleEditing(index)"
                />
                <v-text-field
                  v-model="localActions[index].key_size"
                  :class="{
                    'border-red-500': isNaN(Number(localActions[index].key_size)),
                  }"
                  dense
                  hide-details
                  label="Key Size"
                  solo
                  @blur="toggleEditing(index)"
                />
              </v-card-subtitle>
            </v-card>
          </v-col>
        </v-row>
        <v-btn class="mt-4" color="primary" @click="addAction">
          <v-icon left>mdi-plus</v-icon> Add Action
        </v-btn>
      </v-col>
    </v-row>
    <v-row v-if="isAddingNew" class="mt-4">
      <v-col cols="12">
        <v-card outlined>
          <v-card-title>Add New Action</v-card-title>
          <v-card-subtitle>
            <v-text-field
              v-model="newAction.type"
              dense
              hide-details
              label="Type"
              solo
            />
            <v-text-field
              v-model="newAction.algorithm"
              dense
              hide-details
              label="Algorithm"
              solo
            />
            <v-text-field
              v-model="newAction.key_size"
              :class="{
                'border-red-500': isNaN(Number(newAction.key_size)),
              }"
              dense
              hide-details
              label="Key Size"
              solo
            />
            <v-btn color="success" :disabled="!newAction.type || !newAction.algorithm || isNaN(Number(newAction.key_size))" @click="saveNewAction">
              <v-icon left>mdi-check</v-icon> Save
            </v-btn>
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
  import { defineComponent, ref, watch } from 'vue'
  import type { ActionT } from '../types/rules'
  import type { PropType } from 'vue'

  export default defineComponent({
    props: {
      modelValue: {
        type: Array as PropType<ActionT[]>,
        required: true,
      },
    },
    emits: ['update:modelValue'],
    setup (props, { emit }) {
      const localActions = ref([...props.modelValue])
      const isEditing = ref(Array(localActions.value.length).fill(false))
      const isAddingNew = ref(false)

      const newAction = ref<ActionT>({
        type: '',
        algorithm: '',
        key_size: 0,
      })

      const toggleEditing = (index: number) => {
        isEditing.value[index] = !isEditing.value[index]
        if (!isEditing.value[index]) {
          emit('update:modelValue', [...localActions.value])
        }
      }

      const addAction = () => {
        isAddingNew.value = true
      }

      const saveNewAction = () => {
        if (newAction.value.type && newAction.value.algorithm && !isNaN(Number(newAction.value.key_size))) {
          localActions.value.push({ ...newAction.value })
          emit('update:modelValue', [...localActions.value])
          resetNewAction()
        }
      }

      const resetNewAction = () => {
        isAddingNew.value = false
        newAction.value = { type: '', algorithm: '', key_size: 0 }
      }

      return {
        localActions,
        isEditing,
        isAddingNew,
        newAction,
        toggleEditing,
        addAction,
        saveNewAction,
      }
    },
  })
</script>

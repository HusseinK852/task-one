<template>
  <v-container>
    <v-container v-if="editableRule" class="rule-details">
      <v-row style="margin-bottom: 50px;">
        <v-col cols="12">
          <h1>{{ editableRule.id }}</h1>
        </v-col>
      </v-row>

      <v-row class="grid-container" style="gap: 50px;">
        <v-col cols="12" md="5">
          <EditableField
            v-model="editableRule.name"
            label="Name"
            :value="editableRule.name"
          />
        </v-col>

        <v-col cols="12" md="5">
          <EditableField
            v-model="editableRule.description"
            label="Description"
            :value="editableRule.description"
          />
        </v-col>

        <v-col cols="12" md="5">
          <EditableField
            v-model="editableRule.priority"
            label="Priority"
            type="number"
            :value="editableRule.priority"
          />
        </v-col>

        <v-col cols="12" md="5">
          <EditableField
            v-model="editableRule.enabled"
            label="Enabled"
            type="checkbox"
            :value="editableRule.enabled"
          />
        </v-col>

        <v-col cols="12" md="5">
          <ConditionsList
            v-model="editableRule.conditions"
            :value="editableRule.conditions"
          />
        </v-col>

        <v-col cols="12" md="5">
          <ActionsList
            v-model="editableRule.actions"
            :value="editableRule.actions"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import EditableField from '../components/EditableField.vue'
  import ConditionsList from '../components/ConditionsList.vue'
  import ActionsList from '../components/ActionsList.vue'
  import type { RuleT } from '../types/rules'

  export default defineComponent({
    components: {
      EditableField,
      ConditionsList,
      ActionsList,
    },
    props: {
      editableRule: {
        type: Object as () => RuleT | null,
        required: true,
      },
    },
    watch: {
      editableRule: {
        deep: true,
        handler (newVal) {
          console.log('editableRule changed:', newVal)
        },
      },
    },
  })
</script>

<style scoped>
.rule-details {
  padding: 20px;
  margin-top: 80px;
}

h1 {
  text-align: center;
}

.text-center {
  text-align: center;
}
</style>

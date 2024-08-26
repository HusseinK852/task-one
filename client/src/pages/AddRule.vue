<template>
  <v-container>
    <v-form @submit.prevent="submitForm">
      <v-text-field v-model="rule.name" label="Name" required />

      <v-textarea v-model="rule.description" label="Description" required />

      <v-card class="my-4">
        <v-card-title>Conditions</v-card-title>
        <v-card-text>
          <v-row v-for="(condition, index) in rule.conditions" :key="index">
            <v-col cols="3">
              <v-text-field v-model="condition.field" label="Field" required />
            </v-col>
            <v-col cols="3">
              <v-select
                v-model="condition.operator"
                :items="operators"
                label="Operator"
                required
              />
            </v-col>
            <v-col cols="3">
              <v-text-field v-model="condition.value" label="Value" required />
            </v-col>
            <v-col v-if="index !== 0" cols="3">
              <v-btn class="mx-0 px-0" icon small @click.prevent="removeCondition(index)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-btn class="mx-0 px-0" color="primary" small @click.prevent="addCondition">Add Condition</v-btn>
        </v-card-text>
      </v-card>

      <v-card class="my-4">
        <v-card-title>Actions</v-card-title>
        <v-card-text>
          <v-row v-for="(action, index) in rule.actions" :key="index">
            <v-col cols="3">
              <v-text-field v-model="action.type" label="Action Type" required />
            </v-col>
            <v-col cols="3">
              <v-text-field v-model="action.algorithm" label="Algorithm" />
            </v-col>
            <v-col cols="3">
              <v-text-field v-model="action.value" label="Value" />
            </v-col>
            <v-col v-if="index !== 0" cols="3">
              <v-btn class="mx-0 px-0" icon small @click.prevent="removeAction(index)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-btn class="mx-0 px-0" color="primary" small @click.prevent="addAction">Add Action</v-btn>
        </v-card-text>
      </v-card>

      <v-text-field v-model="rule.priority" label="Priority" required type="number" />

      <v-btn color="success" type="submit">Save Rule</v-btn>
    </v-form>
  </v-container>
</template>

  <script lang="ts">
  import { defineComponent, reactive } from 'vue'
  import { useRulesStore } from '../stores/useRulesStore'

  export default defineComponent({
    setup () {
      const rulesStore = useRulesStore()
      rulesStore.fetchRules()

      const operators = ['equals', 'greater_than', 'less_than', 'not_equals', 'greater_or_equal', 'less_or_equal']

      const rule = reactive({
        id: '',
        name: '',
        description: '',
        conditions: [{ field: '', operator: '', value: '' }],
        actions: [{ type: '', algorithm: '', value: '' }],
        priority: 0,
        enabled: true,
      })

      function addCondition () {
        rule.conditions.push({ field: '', operator: '', value: '' })
      }

      function removeCondition (index: number) {
        rule.conditions.splice(index, 1)
      }

      function addAction () {
        rule.actions.push({ type: '', algorithm: '', value: '' })
      }

      function removeAction (index: number) {
        rule.actions.splice(index, 1)
      }

      function generateNextId () {
        const lastRule = rulesStore.rules[rulesStore.rules.length - 1]
        const lastId = lastRule ? lastRule.id : 'rule_000'
        const lastNumber = parseInt(lastId.split('_')[1])
        const newNumber = lastNumber + 1
        return `rule-${newNumber.toString().padStart(3, '0')}`
      }

      function submitForm () {
        if (rule.name && rule.description && rule.priority !== 0) {
          rule.id = generateNextId()
          rulesStore.createRule(rule)
          console.log('Rule submitted:', rule)
        } else {
          console.error('Please fill in all required fields.')
        }
      }

      return {
        operators,
        rule,
        addCondition,
        removeCondition,
        addAction,
        removeAction,
        submitForm,
      }
    },
  })
  </script>

  <style scoped></style>

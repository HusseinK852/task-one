<template>
  <v-app v-if="editableRule">
    <v-toolbar color="primary" flat>
      <v-app-bar-title>
        {{ editableRule.id }}
      </v-app-bar-title>
      <v-spacer />
      <v-btn @click="saveAllData">SAVE</v-btn>
      <v-btn @click="validate">VALIDATE</v-btn>
      <v-btn @click="deleteRule">DELETE</v-btn>
      <v-btn @click="enabledRule">{{ editableRule.enabled ? 'Disable' : 'Enable' }}</v-btn>
    </v-toolbar>
    <v-main>
      <router-view :editable-rule="editableRule" />
    </v-main>
  </v-app>
</template>

<script lang="ts">
  import { defineComponent, ref, watch } from 'vue'
  import { useRulesStore } from '../stores/useRulesStore'
  import { useRoute, useRouter } from 'vue-router'
  import type { RuleT } from '../types/rules'

  export default defineComponent({
    setup () {
      const editableRule = ref<RuleT | null>(null)
      const rulesStore = useRulesStore()
      const route = useRoute()
      const router = useRouter()

      const fetchRule = async (ruleId: string) => {
        if (ruleId) {
          try {
            editableRule.value = await rulesStore.fetchRule(ruleId)
            console.log(editableRule.value)
          } catch (error) {
            console.error('Failed to fetch rule:', error)
          }
        } else {
          console.error('Rule ID is missing')
        }
      }

      watch(
        () => route.params.ruleId,
        newRuleId => {
          fetchRule(newRuleId as string)
        },
        { immediate: true }
      )

      function saveAllData () {
        if (editableRule.value) {
          rulesStore.editRule(editableRule.value).then(updatedRule => {
            editableRule.value = updatedRule
          })
        }
      }

      function validate () {
        console.log(editableRule.value)
        if (editableRule.value) {
          rulesStore.validateRule(editableRule.value).then(validationResult => {
            if (validationResult === 'success') {
              console.log('Rule is valid')
            } else {
              console.error('Rule is invalid:', validationResult)
            }
          })
        } else {
          console.error('No rule to validate')
        }
      }

      function deleteRule () {
        if (editableRule.value) {
          rulesStore.deleteRule(editableRule.value.id).then(() => {
            editableRule.value = null
            router.push('/')
          })
        } else {
          console.error('No rule to delete')
        }
      }

      function enabledRule () {
        if (editableRule.value) {
          editableRule.value.enabled = !editableRule.value.enabled
          rulesStore.editRule(editableRule.value).then(updatedRule => {
            editableRule.value = updatedRule
          })
        }
      }

      return {
        editableRule,
        saveAllData,
        validate,
        deleteRule,
        enabledRule,
      }
    },
  })
</script>

<style scoped>
.v-toolbar {
  padding: 0 24px;
}
.v-app-bar-title {
  max-width: 100px;
}
</style>

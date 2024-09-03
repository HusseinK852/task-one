<template>
  <div class="d-flex align-center justify-center icon-container">
    <v-btn class="icon-wrapper" depressed icon @click="bugClick">
      <v-icon color="grey lighten-1">mdi-bug</v-icon>
    </v-btn>
    <v-btn class="icon-wrapper save" depressed icon @click="saveClick">
      <v-icon color="white">mdi-check</v-icon>
    </v-btn>
    <v-btn class="icon-wrapper cancel" depressed icon @click="cancelClick">
      <v-icon color="white">mdi-close</v-icon>
    </v-btn>
  </div>
</template>

<script lang="ts">
  import { defineComponent, PropType } from 'vue'
  import { useRoute } from 'vue-router'
  import { useRulesStore } from '../stores/useRulesStore'
  import type { JsonPreview } from '../types/jsonPreview'

  export default defineComponent({
    props: {
      rule: {
        type: Object as PropType<JsonPreview>,
        required: true,
      },
    },
    setup (props) {
      const route = useRoute<{ ruleId: string }>()
      const rulesStore = useRulesStore()

      const newRule = (): JsonPreview => {
        return {
          name: 'test',
          description: props.rule.description,
          nodes: props.rule.nodes,
          connections: props.rule.connections,
          enabled: props.rule.enabled,
        }
      }

      const bugClick = async () => {
        try {
          const ruleData = newRule()
          const response = await rulesStore.validateRule(ruleData as Rule)
          console.log(response.message)
        } catch (error) {
          console.error('Validation error:', error)
        }
      }

      const saveClick = async () => {
        try {
          const ruleData = newRule()
          if (route.params.ruleId === 'add') {
            delete ruleData._id
            await rulesStore.createRule(ruleData as Rule)
          } else {
            await rulesStore.updateRule(route.params.ruleId, ruleData as Rule)
          }
        } catch (error) {
          console.error('Save error:', error)
        }
      }

      const cancelClick = () => {
        location.reload()
      }

      return {
        bugClick,
        saveClick,
        cancelClick,
      }
    },
  })
</script>

<style scoped>
.icon-container {
  gap: 10px;
  background: transparent;
}

.icon-wrapper {
  background-color: #f0f0f0;
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.icon-wrapper.save {
  background-color: #4caf50;
}

.icon-wrapper.cancel {
  background-color: #f44336;
}

.v-btn--depressed {
  box-shadow: none;
}
</style>

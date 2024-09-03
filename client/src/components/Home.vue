<template>
  <v-container>
    <v-row justify="space-between">
      <h2 class="text-h4">My Rules</h2>
    </v-row>

    <v-row class="my-4" justify="space-between">
      <v-btn color="primary" @click="addDecision">Add</v-btn>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        hide-details
        label="Search"
        single-line
      />
    </v-row>

    <v-row v-for="(rule, index) in filteredRules" :key="index" class="mb-4">
      <v-card class="w-100 pa-4" @click="viewRule(rule._id)">
        <v-row justify="space-between">
          <v-col cols="2">{{ rule.name }}</v-col>
          <v-col class="text-right" cols="2">
            <v-btn
              v-if="!rule.enabled"
              text
              @click.stop="toggleRule(index, true)"
            >
              Enable
            </v-btn>
            <v-btn v-else text @click.stop="toggleRule(index, false)">
              Disable
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-row>

    <v-card class="pa-4">
      <h3 class="text-h6">Decision Tree</h3>
    </v-card>
  </v-container>
</template>

<script>
  import { computed, defineComponent, onMounted, ref } from 'vue'
  import { useRulesStore } from '../stores/useRulesStore'
  import { useRouter } from 'vue-router'

  export default defineComponent({
    setup () {
      const rulesStore = useRulesStore()
      const search = ref('')
      const router = useRouter()

      onMounted(async () => {
        await rulesStore.fetchRules()
      })

      const filteredRules = computed(() => {
        if (!search.value) {
          return rulesStore.rules
        }
        return rulesStore.rules.filter(rule =>
          rule.name.toLowerCase().includes(search.value.toLowerCase())
        )
      })

      const addDecision = () => {
        router.push('/rules/add')
      }

      const viewRule = ruleId => {
        router.push(`/rules/${ruleId}`)
      }

      const toggleRule = async (index, enable) => {
        const rule = filteredRules.value[index]
        try {
          await rulesStore.toggleRule(rule._id, enable)
          rule.enabled = enable
        } catch (error) {
          console.error(
            `Failed to ${enable ? 'enable' : 'disable'} rule:`,
            error
          )
        }
      }

      return {
        search,
        filteredRules,
        addDecision,
        viewRule,
        toggleRule,
      }
    },
  })
</script>

<style scoped>
.v-card {
  border-left: 4px solid orange;
}

.v-row {
  margin: 20px 0;
}

.v-text-field {
  padding: 0 30px;
}
</style>

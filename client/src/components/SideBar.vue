<template>
  <v-app>
    <v-navigation-drawer app color="#ae16ab" width="300">
      <v-list dense>
        <v-list-item
          v-for="rule in allRules"
          :key="rule._id"
          class="v-list-item--link"
          @click="navigateToRule(rule.id)"
        >
          <v-list-item-title>{{ rule.name }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-app>
</template>

<script lang="ts">
  import { computed, defineComponent, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useRulesStore } from '../stores/useRulesStore'

  export default defineComponent({
    setup () {
      const router = useRouter()
      const rulesStore = useRulesStore()

      const allRules = computed(() => rulesStore.rules)

      const navigateToRule = (ruleId: string) => {
        router.push(`/rule/${ruleId}`)
      }

      onMounted(() => {
        rulesStore.fetchRules().catch(error => {
          console.error('Error fetching rules on component mount:', error)
        })
      })

      return {
        allRules,
        navigateToRule,
      }
    },
  })
</script>

<style scoped>
  .v-navigation-drawer {
    height: 100vh;
    padding-top: 1rem;
  }
  .v-list-item {
    margin: 1rem;
    background: white;
    color: black;
  }
</style>

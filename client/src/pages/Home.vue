<template>
  <div>
    <h1>Welcome to the Rules Management Page</h1>
    <v-btn class="mt-4" color="primary" @click="importRules">Import Rules</v-btn>
    <v-btn class="mt-2" color="secondary" @click="addRule">Add New Rule</v-btn>
  </div>
</template>

  <script lang="ts">
  import { defineComponent } from 'vue'
  import { useRouter } from 'vue-router'

  export default defineComponent({
    setup () {
      const router = useRouter()

      const importRules = () => {
        // Logic to import rules
      }

      const addRule = () => {
        router.push('/rule/add-rule')
      }

      return {
        importRules,
        addRule,
      }
    },
  })
  </script>

  <style lang="scss">
  </style>

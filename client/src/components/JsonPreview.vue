<template>
  <pre>{{ jsonPreview }}</pre>
</template>

<script lang="ts">
  import { defineComponent, PropType } from 'vue'
  import type { JsonPreview } from '../types/jsonPreview'

  export default defineComponent({
    props: {
      jsonPreview: {
        type: Object as PropType<JsonPreview>,
        required: true,
      },
    },
  })
</script>

<style scoped>
pre {
  background-color: #f4f4f4;
  padding: 15px;
  border-radius: 5px;
  overflow: auto;
}
</style>

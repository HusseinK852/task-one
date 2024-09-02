<template>
  <pre>{{ jsonPreview }}</pre>
</template>

  <script lang="ts">
  import { defineComponent, PropType } from 'vue'

  export default defineComponent({
    props: {
      jsonPreview: {
        type: Object as PropType<Record<string, any>>,
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

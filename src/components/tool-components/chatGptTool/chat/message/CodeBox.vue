<template>
   <pre class="markdown-code" data-prismjs-copy="Copy">
              <code v-html="content">

              </code>
   </pre>
</template>
<script setup lang="ts">

const props = defineProps({
  content: {
    type: String,
    required: true
  }
})

</script>


<style scoped>

</style>
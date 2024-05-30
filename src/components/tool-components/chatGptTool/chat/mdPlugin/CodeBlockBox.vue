<template>
   <pre class="markdown-code-block">
      <el-button class="copy" size="small">复制</el-button>
      <code v-html="code"/>
    </pre>
</template>
<script setup lang="ts">
import {ref} from "vue";

defineProps<
    {
      code: string
    }
>()
</script>


<style scoped>
.copy{
  position: absolute;
}
</style>

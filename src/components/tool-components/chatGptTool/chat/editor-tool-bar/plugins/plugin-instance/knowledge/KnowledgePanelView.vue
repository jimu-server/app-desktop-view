<template>
  <q-card
      style="width: 25vw;height: 20vh"
  >
    <div class="fit column" style="padding: 5px">
      <div class="full-width">
        知识库列表
      </div>
      <div style="flex-grow: 1">

      </div>
    </div>
  </q-card>
</template>

<script setup lang="ts">
import {onMounted} from "vue";

const props = defineProps<{
  data: any
}>()

onMounted(async () => {

})
</script>


<style scoped>

</style>